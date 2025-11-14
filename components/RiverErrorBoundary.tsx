'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary for River video component
 *
 * Catches JavaScript errors in child component tree and displays
 * a fallback UI instead of crashing the entire page.
 *
 * Usage:
 * <RiverErrorBoundary>
 *   <River videos={videos} locale="en" />
 * </RiverErrorBoundary>
 */
export class RiverErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so next render shows fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log error to console (in production, send to monitoring service)
    console.error('[RiverErrorBoundary] Error caught:', error, errorInfo);

    // TODO: Send to error monitoring service (Sentry, LogRocket, etc.)
    // if (process.env.NODE_ENV === 'production') {
    //   Sentry.captureException(error, { extra: errorInfo });
    // }
  }

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI or use prop-provided fallback
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-near-white">
          <div className="text-center px-6">
            <h2 className="font-heading text-2xl md:text-3xl text-black mb-4">
              Unable to load video gallery
            </h2>
            <p className="font-body text-mid-gray text-base md:text-lg mb-6">
              Please refresh the page or try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="font-body text-base px-6 py-3 bg-black text-white rounded hover:bg-black/90 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
