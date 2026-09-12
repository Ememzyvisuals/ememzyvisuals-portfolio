"use client";
// components/ui/ErrorBoundary.tsx
//
// Contains a crash to the component that caused it instead of taking down
// the whole page with Next.js's full-screen "Application error" overlay.

import React from "react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="card-surface p-8 text-center text-sm text-muted-foreground">
            Something went wrong loading this section. Try refreshing the page.
          </div>
        )
      );
    }
    return this.props.children;
  }
}
