import { describe, it, expect, vi } from 'vitest';
import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { BoundaryFallback } from '../components/BoundaryFallback';
import { ErrorBoundary } from '../components/ErrorBoundary';

function Broken(): ReactNode {
  throw new Error('render boom');
}

describe('BoundaryFallback', () => {
  it('renders the fallback UI with a retry action', () => {
    const onRetry = vi.fn();

    render(<BoundaryFallback onRetry={onRetry} />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(
      screen.getByText(/The claims review interface ran into an unexpected problem/)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Try again/i })).toBeInTheDocument();
  });
});

describe('ErrorBoundary', () => {
  it('renders default fallback when a child throws during render', () => {
    render(
      <ErrorBoundary>
        <Broken />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(
      screen.getByText(/The claims review interface ran into an unexpected problem/)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Try again/i })).toBeInTheDocument();
  });

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <p>ok</p>
      </ErrorBoundary>
    );

    expect(screen.getByText('ok')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });
});
