import { useEffect, useState } from 'react';
import type { SSEClaimUpdateEvent, ClaimFiltersApplied } from '../types/claims';

export function useClaimsSSE(filters: ClaimFiltersApplied) {
  const [lastEvent, setLastEvent] = useState<SSEClaimUpdateEvent | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);

    const params = new URLSearchParams();
    if (filters.status) {
      params.set('status', filters.status);
    }
    if (filters.priority) {
      params.set('priority', filters.priority);
    }
    if (filters.search) {
      params.set('search', filters.search);
    }

    const url = `/claims/stream?${params.toString()}`;
    const eventSource = new EventSource(url);

    eventSource.addEventListener('initial_batch', (event: Event) => {
      try {
        const data = (event as MessageEvent<string>).data;
        const parsed = JSON.parse(data);
        setLastEvent({ type: 'initial_batch', data: parsed });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse initial batch');
      }
    });

    eventSource.addEventListener('claim_update', (event: Event) => {
      try {
        const data = (event as MessageEvent<string>).data;
        const parsed = JSON.parse(data);
        setLastEvent({ type: 'claim_update', data: parsed });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse claim update');
      }
    });

    eventSource.addEventListener('error', (event: Event) => {
      const data = (event as MessageEvent<string>).data;
      if (!data) {
        // Native EventSource connection error — let it auto-reconnect.
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
  }, [filters.status, filters.priority, filters.search]);

  return { lastEvent, error } as const;
}
