"use client";
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', background: '#ffebee', color: '#c62828', margin: '20px', borderRadius: '8px' }}>
          <h2>Oops, there is an error!</h2>
          <p><strong>{this.state.error?.toString()}</strong></p>
          <pre style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>
            {this.state.error?.stack}
          </pre>
          <pre style={{ fontSize: '12px', whiteSpace: 'pre-wrap', marginTop: '10px' }}>
            {this.state.errorInfo?.componentStack}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}
