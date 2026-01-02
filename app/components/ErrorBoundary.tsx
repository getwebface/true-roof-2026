// Error Boundary Component - True Roof 2026
// Catches React rendering errors and logs them to Supabase

import React, { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { logError } from '~/lib/logging/logger';
import type { ErrorContext } from '~/lib/logging/types';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentId?: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { componentId, onError } = this.props;

    // Log the error
    const context: ErrorContext = {
      componentStack: errorInfo.componentStack,
      errorBoundary: 'ErrorBoundary',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      timestamp: new Date().toISOString()
    };

    logError(error, context);

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }

    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Something went wrong
            </h3>
            <p className="text-red-600 text-sm mb-4">
              We encountered an error while loading this section. Our team has been notified.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Reload Page
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-xs text-red-700 font-medium">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for wrapping components with error boundaries
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

// Hook for manual error logging in functional components
export function useErrorHandler(componentId?: string) {
  return React.useCallback((error: Error, context?: Partial<ErrorContext>) => {
    const fullContext: ErrorContext = {
      componentStack: context?.componentStack,
      errorBoundary: context?.errorBoundary || 'useErrorHandler',
      userAgent: context?.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : undefined),
      viewport: context?.viewport || (typeof window !== 'undefined' ? {
        width: window.innerWidth,
        height: window.innerHeight
      } : undefined),
      url: context?.url || (typeof window !== 'undefined' ? window.location.href : undefined),
      referrer: context?.referrer || (typeof document !== 'undefined' ? document.referrer : undefined),
      timestamp: context?.timestamp || new Date().toISOString(),
      userId: context?.userId,
      sessionId: context?.sessionId
    };

    logError(error, fullContext);
  }, [componentId]);
}

export default ErrorBoundary;
