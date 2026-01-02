// Centralized Logger - True Roof 2026 Application Logging System
// Handles all logging operations with console and Supabase integration

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type {
  LogLevel,
  LogCategory,
  LogEntry,
  LogConfig,
  PerformanceMetric,
  ErrorContext,
  UserAction,
  NetworkRequest,
  DatabaseOperation
} from './types';
import {
  defaultLogConfig,
  shouldLog,
  formatLogMessage,
  sanitizeLogData,
  detectEnvironment
} from './types';

class Logger {
  private config: LogConfig;
  private supabase: SupabaseClient | null = null;
  private logQueue: LogEntry[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private isFlushing = false;
  private sessionId: string;
  private userId?: string;
  private version = '1.0.0';

  constructor(config: Partial<LogConfig> = {}) {
    this.config = { ...defaultLogConfig, ...config };
    this.sessionId = this.generateSessionId();

    // Initialize Supabase client if enabled
    if (this.config.enableSupabase && this.config.supabaseUrl && this.config.supabaseKey) {
      this.supabase = createClient(this.config.supabaseUrl, this.config.supabaseKey);
    }

    // Start periodic flush
    this.startPeriodicFlush();

    // Set up unload handler for client-side
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.flushLogs(true);
      });
    }

    // Log initialization
    this.info('system', 'Logger initialized', {
      environment: this.config.environment,
      enableConsole: this.config.enableConsole,
      enableSupabase: this.config.enableSupabase
    });
  }

  // Session management
  private generateSessionId(): string {
    if (typeof window !== 'undefined') {
      // Client-side: use existing session or create new
      const existing = sessionStorage.getItem('trueroof_session_id');
      if (existing) return existing;

      const newId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('trueroof_session_id', newId);
      return newId;
    }

    // Server-side: generate new session
    return `server_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }

  setSessionId(sessionId: string): void {
    this.sessionId = sessionId;
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('trueroof_session_id', sessionId);
    }
  }

  // Core logging methods
  private log(level: LogLevel, category: LogCategory, message: string, metadata?: Record<string, any>, error?: Error): void {
    // Check if we should log at this level
    if (!shouldLog(level, this.config.logLevels.console) && !shouldLog(level, this.config.logLevels.supabase)) {
      return;
    }

    const entry: LogEntry = {
      id: this.generateLogId(),
      timestamp: new Date().toISOString(),
      level,
      category,
      message: sanitizeLogData(message),
      user_id: this.userId,
      session_id: this.sessionId,
      page_url: typeof window !== 'undefined' ? window.location.href : undefined,
      metadata: metadata ? sanitizeLogData(metadata) : undefined,
      environment: this.config.environment,
      version: this.version
    };

    // Add error stack if provided
    if (error) {
      entry.error_stack = error.stack;
    }

    // Add to queue
    this.logQueue.push(entry);

    // Console logging
    if (this.config.enableConsole && shouldLog(level, this.config.logLevels.console)) {
      this.logToConsole(entry);
    }

    // Auto-flush if queue is full
    if (this.logQueue.length >= this.config.batchSize) {
      this.flushLogs();
    }
  }

  private generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private logToConsole(entry: LogEntry): void {
    const formatted = formatLogMessage(entry);
    const metadata = entry.metadata ? `\n${JSON.stringify(entry.metadata, null, 2)}` : '';
    const stack = entry.error_stack ? `\n${entry.error_stack}` : '';

    switch (entry.level) {
      case 'DEBUG':
        console.debug(`🐛 ${formatted}${metadata}${stack}`);
        break;
      case 'INFO':
        console.info(`ℹ️ ${formatted}${metadata}${stack}`);
        break;
      case 'WARN':
        console.warn(`⚠️ ${formatted}${metadata}${stack}`);
        break;
      case 'ERROR':
        console.error(`❌ ${formatted}${metadata}${stack}`);
        break;
      case 'FATAL':
        console.error(`💀 ${formatted}${metadata}${stack}`);
        break;
    }
  }

  private async flushLogs(force = false): Promise<void> {
    if (this.isFlushing || (!force && this.logQueue.length === 0)) {
      return;
    }

    if (!this.config.enableSupabase || !this.supabase) {
      // If Supabase is disabled, just clear the queue
      this.logQueue = [];
      return;
    }

    this.isFlushing = true;
    const logsToSend = [...this.logQueue];
    this.logQueue = [];

    try {
      // Filter logs that should be sent to Supabase
      const supabaseLogs = logsToSend.filter(log => shouldLog(log.level, this.config.logLevels.supabase));

      if (supabaseLogs.length > 0) {
        const { error } = await this.supabase
          .from('application_logs')
          .insert(supabaseLogs.map(log => ({
            id: log.id,
            timestamp: log.timestamp,
            level: log.level,
            category: log.category,
            message: log.message,
            error_stack: log.error_stack,
            user_id: log.user_id,
            session_id: log.session_id,
            page_url: log.page_url,
            component_id: log.component_id,
            metadata: log.metadata,
            environment: log.environment,
            version: log.version
          })));

        if (error) {
          console.error('Failed to send logs to Supabase:', error);
          // Re-queue failed logs
          this.logQueue.unshift(...supabaseLogs);
        }
      }
    } catch (error) {
      console.error('Error flushing logs:', error);
      // Re-queue all logs on error
      this.logQueue.unshift(...logsToSend);
    } finally {
      this.isFlushing = false;
    }
  }

  private startPeriodicFlush(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    this.flushTimer = setInterval(() => {
      this.flushLogs();
    }, this.config.flushInterval);
  }

  // Public logging methods
  debug(category: LogCategory, message: string, metadata?: Record<string, any>): void {
    this.log('DEBUG', category, message, metadata);
  }

  info(category: LogCategory, message: string, metadata?: Record<string, any>): void {
    this.log('INFO', category, message, metadata);
  }

  warn(category: LogCategory, message: string, metadata?: Record<string, any>): void {
    this.log('WARN', category, message, metadata);
  }

  error(category: LogCategory, message: string, error?: Error, metadata?: Record<string, any>): void {
    this.log('ERROR', category, message, metadata, error);
  }

  fatal(category: LogCategory, message: string, error?: Error, metadata?: Record<string, any>): void {
    this.log('FATAL', category, message, metadata, error);
  }

  // Specialized logging methods
  logError(error: Error, context?: ErrorContext): void {
    const metadata: Record<string, any> = {
      error_name: error.name,
      error_message: error.message,
      ...context
    };

    if (context?.componentStack) {
      metadata.component_stack = context.componentStack;
    }

    this.error('client', `Application Error: ${error.message}`, error, metadata);
  }

  logPerformance(metric: PerformanceMetric): void {
    if (!this.config.enablePerformanceTracking) return;

    this.info('performance', `Performance: ${metric.name}`, {
      value: metric.value,
      unit: metric.unit,
      category: metric.category,
      ...metric.metadata
    });
  }

  logUserAction(action: UserAction): void {
    if (!this.config.enableUserTracking) return;

    this.info('user_action', `User Action: ${action.action}`, {
      element: action.element,
      component: action.component,
      value: action.value,
      ...action.metadata
    });
  }

  logNetworkRequest(request: NetworkRequest): void {
    const level = request.error ? 'ERROR' : 'DEBUG';
    const message = `${request.method} ${request.url}`;

    const metadata = {
      status: request.status,
      duration: request.duration,
      size: request.size,
      error: request.error,
      ...request.metadata
    };

    if (request.error) {
      this.error('network', `Network Error: ${message}`, undefined, metadata);
    } else {
      this.debug('network', `Network Request: ${message}`, metadata);
    }
  }

  logDatabaseOperation(operation: DatabaseOperation): void {
    const metadata = {
      operation: operation.operation,
      table: operation.table,
      duration: operation.duration,
      row_count: operation.rowCount,
      error: operation.error,
      ...operation.metadata
    };

    if (operation.error) {
      this.error('database', `Database Error: ${operation.operation} on ${operation.table}`, undefined, metadata);
    } else {
      this.debug('database', `Database Operation: ${operation.operation} on ${operation.table}`, metadata);
    }
  }

  logValidationFailure(field: string, value: any, reason: string, component?: string): void {
    this.warn('validation', `Validation failed for field: ${field}`, {
      field,
      value: sanitizeLogData(value),
      reason,
      component
    });
  }

  logComponentRender(componentId: string, duration: number, props?: Record<string, any>): void {
    if (!this.config.enablePerformanceTracking) return;

    this.debug('rendering', `Component render: ${componentId}`, {
      component_id: componentId,
      duration_ms: duration,
      props: props ? sanitizeLogData(props) : undefined
    });
  }

  logSecurityEvent(event: string, details?: Record<string, any>): void {
    this.warn('security', `Security Event: ${event}`, details);
  }

  // Utility methods
  updateConfig(newConfig: Partial<LogConfig>): void {
    this.config = { ...this.config, ...newConfig };

    // Reinitialize Supabase if config changed
    if (newConfig.supabaseUrl && newConfig.supabaseKey) {
      this.supabase = createClient(newConfig.supabaseUrl, newConfig.supabaseKey);
    }

    // Restart periodic flush if interval changed
    if (newConfig.flushInterval) {
      this.startPeriodicFlush();
    }
  }

  getConfig(): LogConfig {
    return { ...this.config };
  }

  getQueueLength(): number {
    return this.logQueue.length;
  }

  async forceFlush(): Promise<void> {
    await this.flushLogs(true);
  }

  // Cleanup
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    this.flushLogs(true);
  }
}

// Singleton instance
let loggerInstance: Logger | null = null;

export function initLogger(config?: Partial<LogConfig>): Logger {
  if (!loggerInstance) {
    // Get environment variables
    const env = typeof window === 'undefined' ? process.env : {};

    const defaultConfig: Partial<LogConfig> = {
      supabaseUrl: env.SUPABASE_URL,
      supabaseKey: env.SUPABASE_ANON_KEY,
      environment: detectEnvironment(),
      enableConsole: detectEnvironment() !== 'production',
      enableSupabase: true
    };

    loggerInstance = new Logger({ ...defaultConfig, ...config });
  }

  return loggerInstance;
}

export function getLogger(): Logger | null {
  return loggerInstance;
}

// Convenience functions
export function debug(category: LogCategory, message: string, metadata?: Record<string, any>): void {
  loggerInstance?.debug(category, message, metadata);
}

export function info(category: LogCategory, message: string, metadata?: Record<string, any>): void {
  loggerInstance?.info(category, message, metadata);
}

export function warn(category: LogCategory, message: string, metadata?: Record<string, any>): void {
  loggerInstance?.warn(category, message, metadata);
}

export function error(category: LogCategory, message: string, error?: Error, metadata?: Record<string, any>): void {
  loggerInstance?.error(category, message, error, metadata);
}

export function fatal(category: LogCategory, message: string, error?: Error, metadata?: Record<string, any>): void {
  loggerInstance?.fatal(category, message, error, metadata);
}

// Specialized convenience functions
export function logError(error: Error, context?: ErrorContext): void {
  loggerInstance?.logError(error, context);
}

export function logPerformance(metric: PerformanceMetric): void {
  loggerInstance?.logPerformance(metric);
}

export function logUserAction(action: UserAction): void {
  loggerInstance?.logUserAction(action);
}

export function logNetworkRequest(request: NetworkRequest): void {
  loggerInstance?.logNetworkRequest(request);
}

export function logDatabaseOperation(operation: DatabaseOperation): void {
  loggerInstance?.logDatabaseOperation(operation);
}

export function logValidationFailure(field: string, value: any, reason: string, component?: string): void {
  loggerInstance?.logValidationFailure(field, value, reason, component);
}

export function logComponentRender(componentId: string, duration: number, props?: Record<string, any>): void {
  loggerInstance?.logComponentRender(componentId, duration, props);
}

export function logSecurityEvent(event: string, details?: Record<string, any>): void {
  loggerInstance?.logSecurityEvent(event, details);
}

// Default export
export default Logger;
