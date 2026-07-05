import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';

describe('LoadingState', () => {
  it('renders loading text', () => {
    render(<LoadingState />);

    expect(screen.getByText('Loading claims...')).toBeInTheDocument();
  });
});

describe('ErrorState', () => {
  it('renders error message', () => {
    render(<ErrorState error={new Error('Network failed')} onRetry={() => {}} />);

    expect(screen.getByText('Unable to load claims')).toBeInTheDocument();
    expect(screen.getByText('Network failed')).toBeInTheDocument();
  });

  it('renders retry button when onRetry is provided', () => {
    render(<ErrorState error={new Error('Failed')} onRetry={() => {}} />);

    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });
});

describe('EmptyState', () => {
  it('renders empty state message', () => {
    render(<EmptyState />);

    expect(screen.getByText('No claims found')).toBeInTheDocument();
    expect(screen.getByText(/No claims match your current filter criteria/)).toBeInTheDocument();
  });
});
