import { useEffect, useCallback, useState } from 'react';
import type { SSEClaimUpdateEvent, ClaimFiltersApplied } from '../types/claims';

/**
 * Safely parses data payloads from Server-Sent Events.
 * Intentionally swallows raw parsing errors to normalize downstream generic error messaging.
 */
function parseSseEventData(event: Event) {
  try {
    const data = (event as MessageEvent<string>).data;
    return JSON.parse(data);
  } catch {
    throw new Error('Stream connection failed');
  }
}

/**
 * Custom hook managing a real-time Server-Sent Events (SSE) connection.
 * Dynamically teardowns and rebuilds the stream connection when filters change
 * or a manual retry is triggered.
 */
export function useClaimsSSE(filters: ClaimFiltersApplied) {
  const [lastEvent, setLastEvent] = useState<SSEClaimUpdateEvent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Manual escape hatch allowing the client to forcefully recreate
  // the EventSource instance if it lands in a stuck state.
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

    // Event handlers clear previous transient errors upon a successful
    // parse to seamlessly auto-heal the UI state.
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
    });

    // Closes the connection on unmount or filter adjustments to prevent
    // connection leaks or data mixing.
    return () => {
      eventSource.close();
    };
  }, [filters.status, filters.search, filters.sort, retryCount]);

  return { lastEvent, error, retry } as const;
}
