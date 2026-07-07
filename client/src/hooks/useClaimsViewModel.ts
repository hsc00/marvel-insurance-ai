import { useEffect, useMemo, useState } from 'react';
import type { Claim, ClaimFiltersApplied } from '../types/claims';
import { useClaimsQuery } from './useClaimsQuery';
import { useClaimsSSE } from './useClaimsSSE';
import { useDebounce } from './useDebounce';
import { compareClaimsBy, matchesFilters } from '../utils/claimUtils';

const SEARCH_DEBOUNCE_MS = 300;
const HIGHLIGHT_TIMEOUT_MS = 1500;

/**
 * Orchestrates claim data by synchronizing initial REST snapshots (useClaimsQuery)
 * with real-time SSE updates (useClaimsSSE).
 * Provides a unified 'mergedClaims' state for the UI, handling debounced filtering
 * and local sorting.
 */
export function useClaimsViewModel() {
  const [filters, setFilters] = useState<ClaimFiltersApplied>({
    status: null,
    search: null,
    sort: 'updated_at',
  });

  const debouncedSearch = useDebounce(filters.search, SEARCH_DEBOUNCE_MS);

  // REST snapshot: initial page of claims matching the debounced filters.
  const { data, isLoading, isError, error, refetch } = useClaimsQuery({
    ...filters,
    search: debouncedSearch,
  });

  // SSE stream: subscribes to real-time claim updates using the same debounced filters.
  const {
    lastEvent,
    error: sseError,
    retry: sseRetry,
  } = useClaimsSSE({
    ...filters,
    search: debouncedSearch,
  });

  const [mergedClaims, setMergedClaims] = useState<Claim[]>([]);
  const [hasInitialBatch, setHasInitialBatch] = useState(false);
  const [highlightedClaimId, setHighlightedClaimId] = useState<string | null>(null);

  // Stable filter object for useEffects and downstream matchers.
  const debouncedFilters = useMemo(
    () => ({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch]
  );

  // Reset the initial batch flag when user inputs change, forcing
  // the app to wait for a fresh 'initial_batch' event from the stream.
  useEffect(() => {
    setHasInitialBatch(false);
  }, [filters.status, debouncedSearch, filters.sort]);

  // Fallback: If the stream hasn't provided an initial_batch yet,
  // hydrate the state with data from the REST API query.
  useEffect(() => {
    if (data?.items && !hasInitialBatch) {
      setMergedClaims(data.items);
    }
  }, [data?.items, hasInitialBatch]);

  // Synchronizes local state with SSE updates:
  // 1. Initial batches force a complete reset of the claim list.
  // 2. Updates perform a targeted map of existing items.
  // 3. Claims that fall out of filter scope are removed from the list.
  useEffect(() => {
    if (!lastEvent) return;
    if (lastEvent.type === 'initial_batch') {
      setHasInitialBatch(true);
      setMergedClaims(lastEvent.data.items);
    } else if (lastEvent.type === 'claim_update') {
      setMergedClaims(prev => {
        const updated = prev.map(claim =>
          claim.id === lastEvent.data.id ? lastEvent.data : claim
        );
        // Remove the claim if it no longer matches the current filters.
        return matchesFilters(lastEvent.data, debouncedFilters)
          ? updated
          : updated.filter(claim => claim.id !== lastEvent.data.id);
      });
      // Ensure the updated claim is highlighted if it matches the current filters.
      if (matchesFilters(lastEvent.data, debouncedFilters)) {
        setHighlightedClaimId(lastEvent.data.id);
      }
    }
  }, [lastEvent, debouncedFilters]);

  // Clears the highlight after timeout.
  useEffect(() => {
    if (!highlightedClaimId) return;
    const timer = setTimeout(() => setHighlightedClaimId(null), HIGHLIGHT_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [highlightedClaimId]);

  const hasExistingData = mergedClaims.length > 0;

  // Locally sorted view of mergedClaims to keep the
  // list order stable and comparable.
  const sortedClaims = useMemo(() => {
    if (!filters.sort) return mergedClaims;
    return [...mergedClaims].sort(compareClaimsBy(filters.sort));
  }, [mergedClaims, filters.sort]);

  // Context value exposed to descendant components.
  const highlightedClaimContextValue = useMemo(
    () => ({ highlightedClaimId }),
    [highlightedClaimId]
  );

  return {
    filters,
    onFiltersChange: setFilters,
    isLoading,
    isError,
    error,
    refetch,
    sseError,
    sseRetry,
    mergedClaims,
    sortedClaims,
    hasExistingData,
    highlightedClaimId,
    highlightedClaimContextValue,
  };
}
