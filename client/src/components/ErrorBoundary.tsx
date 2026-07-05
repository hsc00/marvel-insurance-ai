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
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

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
