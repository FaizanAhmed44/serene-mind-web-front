import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  componentName?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const componentName = this.props.componentName || 'Unknown Component';
    
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('🔴 ERROR BOUNDARY CAUGHT AN ERROR');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('📍 Component:', componentName);
    console.error('❌ Error:', error.toString());
    console.error('📄 Error Message:', error.message);
    console.error('📚 Stack Trace:', error.stack);
    console.error('🔍 Component Stack:', errorInfo.componentStack);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Store error info in state
    this.setState({
      error,
      errorInfo
    });

    // Also log to window for easy debugging
    if (typeof window !== 'undefined') {
      (window as Window & { lastError?: unknown }).lastError = {
        component: componentName,
        error: error.toString(),
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString()
      };
      console.log('💾 Error saved to window.lastError');
    }
  }

  render() {
    if (this.state.hasError) {
      const componentName = this.props.componentName || 'Component';
      
      // If custom fallback provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback with error details
      return (
        <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg">
          <div className="text-red-800 font-bold mb-2">
            ⚠️ Error in {componentName}
          </div>
          <div className="text-red-600 text-sm mb-2">
            {this.state.error?.message || 'Unknown error occurred'}
          </div>
          <details className="text-xs text-red-700">
            <summary className="cursor-pointer font-semibold mb-1">
              🔍 View Details
            </summary>
            <pre className="bg-red-100 p-2 rounded overflow-auto max-h-40">
              {this.state.error?.stack}
            </pre>
          </details>
          <div className="text-xs text-red-600 mt-2">
            Check browser console for full details (window.lastError)
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;