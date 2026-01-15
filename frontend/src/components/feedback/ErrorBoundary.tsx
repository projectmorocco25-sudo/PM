"use client";

import { Component, type ReactNode } from "react";

import { ErrorState } from "@/components/feedback/ErrorState";

type Props = {
  children: ReactNode;
  fallbackTitle?: string;
};

type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    // Placeholder for future logging hook.
    console.error("UI ErrorBoundary caught error:", error);
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorState
          title={this.props.fallbackTitle ?? "Something went wrong"}
          message={this.state.error.message}
          onRetry={() => this.setState({ error: null })}
        />
      );
    }

    return this.props.children;
  }
}

