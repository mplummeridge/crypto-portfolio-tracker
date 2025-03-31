"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import React from "react";

interface ErrorBoundaryProps {
  fallback?: React.ReactNode; // Optional custom fallback UI
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

const DefaultFallback = ({ onRetry }: { onRetry?: () => void }) => (
  <div className="bg-destructive/10 border border-destructive/30 text-destructive text-xs rounded p-3 flex flex-col items-center justify-center min-h-[100px]">
    <AlertTriangle className="w-5 h-5 mb-1" />
    <p className="mb-2 font-medium">Could not load this section.</p>
    {onRetry && (
      <Button
        variant="destructive"
        size="sm"
        className="h-6 px-2 text-xs"
        onClick={onRetry}
      >
        Try Again
      </Button>
    )}
  </div>
);

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    // Note: Retry might not always work if the underlying issue persists.
    // Consider adding logic to prevent infinite retry loops if needed.
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || <DefaultFallback onRetry={this.handleRetry} />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
