import { Component, type ReactNode } from 'react';
import { BoundaryFallback } from './BoundaryFallback';

type State = {
  hasError: boolean;
  error: Error | null;
};

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

export class ErrorBoundary extends Component<Props, State> {
  // Track whether an error has occurred and store the error object.
  state: State = { hasError: false, error: null };

  // Catches errors in child components and updates the state to trigger a fallback UI.
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  // Reset the error boundary when retrying.
  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <BoundaryFallback onRetry={this.handleRetry} />;
    }

    return this.props.children;
  }
}
