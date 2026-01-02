// Logging Types - True Roof 2026 Application Logging System

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

export type LogCategory =
  | 'client'
  | 'server'
  | 'network'
  | 'database'
  | 'auth'
  | 'validation'
  | 'rendering'
  | 'performance'
  | 'security'
  | 'user_action'
  | 'system'
  | 'external_api';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  error_stack?: string;
  user_id?: string;
  session_id?: string;
  page_url?: string;
  component_id?: string;
  metadata?: Record<string, any>;
  environment: string;
  version?: string;
}

export interface LogConfig {
  supabaseUrl?: string;
  supabaseKey?: string;
  environment: 'development' | 'staging' | 'production';
  enableConsole: boolean;
  enableSupabase: boolean;
  batchSize: number;
  flushInterval: number;
  maxRetries: number;
  retryDelay: number;
  enableUserTracking: boolean;
  enablePerformanceTracking: boolean;
  logLevels: {
    console: LogLevel;
    supabase: LogLevel;
  };
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count' | 'percentage';
  category: 'render' | 'network' | 'database' | 'user_interaction';
  metadata?: Record<string, any>;
}

export interface ErrorContext {
  componentStack?: string;
  errorBoundary?: string;
  userAgent?: string;
  viewport?: {
    width: number;
    height: number;
  };
  url?: string;
  referrer?: string;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

export interface UserAction {
  action: string;
  element?: string;
  component?: string;
  value?: any;
  metadata?: Record<string, any>;
}

export interface NetworkRequest {
  url: string;
  method: string;
  status?: number;
  duration?: number;
  size?: number;
  error?: string;
  metadata?: Record<string, any>;
}

export interface DatabaseOperation {
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  duration?: number;
  rowCount?: number;
  error?: string;
  metadata?: Record<string, any>;
}

// Environment detection
export const detectEnvironment = (): 'development' | 'staging' | 'production' => {
  if (typeof window === 'undefined') {
    // Server-side
    return (process.env.NODE_ENV as any) || 'development';
  }

  // Client-side
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'development';
  }
  if (hostname.includes('staging') || hostname.includes('dev')) {
    return 'staging';
  }
  return 'production';
};

// Default configuration
export const defaultLogConfig: LogConfig = {
  environment: detectEnvironment(),
  enableConsole: true,
  enableSupabase: true,
  batchSize: 10,
  flushInterval: 30000, // 30 seconds
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  enableUserTracking: true,
  enablePerformanceTracking: true,
  logLevels: {
    console: 'DEBUG',
    supabase: 'INFO'
  }
};

// Log level hierarchy for filtering
export const LOG_LEVEL_HIERARCHY: Record<LogLevel, number> = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4
};

// Utility functions
export const shouldLog = (level: LogLevel, configLevel: LogLevel): boolean => {
  return LOG_LEVEL_HIERARCHY[level] >= LOG_LEVEL_HIERARCHY[configLevel];
};

export const formatLogMessage = (entry: LogEntry): string => {
  const timestamp = new Date(entry.timestamp).toISOString();
  const level = entry.level.padEnd(5);
  const category = entry.category.padEnd(12);
  const message = entry.message;

  return `[${timestamp}] ${level} ${category} ${message}`;
};

export const sanitizeLogData = (data: any): any => {
  if (typeof data === 'string') {
    // Remove sensitive information
    return data
      .replace(/password[^=]*=([^&\s]*)/gi, 'password=***')
      .replace(/token[^=]*=([^&\s]*)/gi, 'token=***')
      .replace(/key[^=]*=([^&\s]*)/gi, 'key=***')
      .replace(/secret[^=]*=([^&\s]*)/gi, 'secret=***');
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeLogData);
  }

  if (data && typeof data === 'object') {
    const sanitized: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      if (['password', 'token', 'key', 'secret', 'apiKey', 'authToken'].includes(key)) {
        sanitized[key] = '***';
      } else {
        sanitized[key] = sanitizeLogData(value);
      }
    }
    return sanitized;
  }

  return data;
};
