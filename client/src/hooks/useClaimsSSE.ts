import { useEffect, useCallback, useState } from 'react';
import type { SSEClaimUpdateEvent, ClaimFiltersApplied } from '../types/claims';

function parseSseEventData(event: Event) {
  try {
    const data = (event as MessageEvent<string>).data;
    return JSON.parse(data);
  } catch {
    throw new Error('Stream connection failed');
  }
}

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
    if (filters.search) params.set('search', filters.search);
    if (filters.sort) params.set('sort', filters.sort);

    const url = `/claims/stream?${params.toString()}`;
    const eventSource = new EventSource(url);

    eventSource.addEventListener('initial_batch', (event: Event) => {
      try {
        const parsed = parseSseEventData(event);
        setLastEvent({ type: 'initial_batch', data: parsed });
        setError(null);
      } catch {
        setError('Stream connection failed');
      }
    });

    eventSource.addEventListener('claim_update', (event: Event) => {
      try {
        const parsed = parseSseEventData(event);
        setLastEvent({ type: 'claim_update', data: parsed });
        setError(null);
      } catch {
        setError('Stream connection failed');
      }
    });

    eventSource.addEventListener('error', (event: Event) => {
      const rawData = (event as MessageEvent<string>).data;
      if (!rawData) {
        // Browser-level connection failure. Let EventSource auto-reconnect.
        return;
      }

      try {
        const parsed = JSON.parse(rawData);
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
  }, [filters.status, filters.search, filters.sort, retryCount]);

  return { lastEvent, error, retry } as const;
}
