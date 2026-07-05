import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';
import { useClaimsQuery } from '../hooks/useClaimsQuery';
import { useClaimsSSE } from '../hooks/useClaimsSSE';

vi.mock('../hooks/useClaimsQuery');
vi.mock('../hooks/useClaimsSSE');

describe('App data states', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state while fetching', () => {
    vi.mocked(useClaimsQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    vi.mocked(useClaimsSSE).mockReturnValue({
      lastEvent: null,
      error: null,
      retry: vi.fn(),
    } as any);

    render(<App />);

    expect(screen.getByText('Loading claims...')).toBeInTheDocument();
    expect(screen.queryByText('No claims found')).not.toBeInTheDocument();
  });

  it('shows empty state when loaded with no claims', () => {
    vi.mocked(useClaimsQuery).mockReturnValue({
      data: {
        items: [],
        total: 0,
        filters: { status: null, priority: null, search: null },
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    vi.mocked(useClaimsSSE).mockReturnValue({
      lastEvent: null,
      error: null,
      retry: vi.fn(),
    } as any);

    render(<App />);

    expect(screen.getByText('No claims found')).toBeInTheDocument();
  });

  it('shows error state when REST fails with no cached data', () => {
    vi.mocked(useClaimsQuery).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: new Error('REST failed'),
      refetch: vi.fn(),
    } as any);

    vi.mocked(useClaimsSSE).mockReturnValue({
      lastEvent: null,
      error: null,
      retry: vi.fn(),
    } as any);

    render(<App />);

    expect(screen.getByText('Unable to load claims')).toBeInTheDocument();
    expect(screen.getByText('REST failed')).toBeInTheDocument();
  });

  it('shows SSE error banner with retry when stream errors with cached data', () => {
    const mockRetry = vi.fn();

    vi.mocked(useClaimsQuery).mockReturnValue({
      data: {
        items: [
          {
            id: '1',
            claim_id: 'CLM-001',
            claimant_name: 'Jane Doe',
            status: 'pending',
            priority: 'high',
            updated_at: '2024-01-01T00:00:00Z',
            agent_summary: 'Under review',
            confidence: 0.85,
          },
        ],
        total: 1,
        filters: { status: null, priority: null, search: null },
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    vi.mocked(useClaimsSSE).mockReturnValue({
      lastEvent: null,
      error: 'Stream error',
      retry: mockRetry,
    } as any);

    render(<App />);

    expect(screen.getByText('Stream error')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Retry live stream connection/i })
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Retry live stream connection/i }));
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('hides SSE error banner when stream recovers with data', () => {
    vi.mocked(useClaimsQuery).mockReturnValue({
      data: {
        items: [
          {
            id: '1',
            claim_id: 'CLM-001',
            claimant_name: 'Jane Doe',
            status: 'pending',
            priority: 'high',
            updated_at: '2024-01-01T00:00:00Z',
            agent_summary: 'Under review',
            confidence: 0.85,
          },
        ],
        total: 1,
        filters: { status: null, priority: null, search: null },
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    vi.mocked(useClaimsSSE).mockReturnValue({
      lastEvent: {
        type: 'initial_batch',
        data: {
          items: [
            {
              id: '1',
              claim_id: 'CLM-001',
              claimant_name: 'Jane Doe',
              status: 'pending',
              priority: 'high',
              updated_at: '2024-01-01T00:00:00Z',
              agent_summary: 'Under review',
              confidence: 0.85,
            },
          ],
          total: 1,
          filters: { status: null, priority: null, search: null },
        },
      },
      error: null,
      retry: vi.fn(),
    } as any);

    render(<App />);

    expect(screen.queryByText('Stream error')).not.toBeInTheDocument();
    expect(screen.getAllByText('CLM-001').length).toBeGreaterThan(0);
  });
});
