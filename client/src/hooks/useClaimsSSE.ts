import { useEffect, useCallback, useState } from 'react';
import type { SSEClaimUpdateEvent, ClaimFiltersApplied } from '../types/claims';

export function useClaimsSSE(filters: ClaimFiltersApplied) {
  const [lastEvent, setLastEvent] = useState<SSEClaimUpdateEvent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const retry = useCallback(() => {
    setError(null);
    setRetryCount(prev => prev + 1);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.priority) params.set('priority', filters.priority);
    if (filters.search) params.set('search', filters.search);

    const url = `/claims/stream?${params.toString()}`;
    const eventSource = new EventSource(url);

    eventSource.addEventListener('initial_batch', (event: Event) => {
      try {
        const data = (event as MessageEvent<string>).data;
        const parsed = JSON.parse(data);
        setLastEvent({ type: 'initial_batch', data: parsed });
        setError(null);
      } catch {
        setError('Stream connection failed');
      }
    });

    eventSource.addEventListener('claim_update', (event: Event) => {
      try {
        const data = (event as MessageEvent<string>).data;
        const parsed = JSON.parse(data);
        setLastEvent({ type: 'claim_update', data: parsed });
        setError(null);
      } catch {
        setError('Stream connection failed');
      }
    });

    eventSource.addEventListener('error', (event: Event) => {
      const data = (event as MessageEvent<string>).data;
      if (!data) {
        // Browser-level connection failure. Let EventSource auto-reconnect.
        return;
      }

      try {
        const parsed = JSON.parse(data);
        setError(
          (parsed as { detail?: string }).detail ||
            (parsed as { error?: string }).error ||
            'Stream error'
        );
      } catch {
        setError('Stream error');
      }
      eventSource.close();
    });

    return () => {
      eventSource.close();
    };
  }, [filters.status, filters.priority, filters.search, retryCount]);

  return { lastEvent, error, retry } as const;
}
