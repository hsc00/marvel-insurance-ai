import { useEffect, useMemo, useState } from 'react';
import type { Claim, ClaimFiltersApplied } from '../types/claims';
import { useClaimsQuery } from './useClaimsQuery';
import { useClaimsSSE } from './useClaimsSSE';
import { useDebounce } from './useDebounce';

const SEARCH_DEBOUNCE_MS = 300;
const HIGHLIGHT_TIMEOUT_MS = 1500;

type SortField = ClaimFiltersApplied['sort'];

function matchesFilters(claim: Claim, filters: ClaimFiltersApplied) {
  if (filters.status && claim.status !== filters.status) return false;
  if (filters.search) {
    const term = filters.search.toLowerCase();
    if (
      !claim.claimant_name.toLowerCase().includes(term) &&
      !claim.claim_id.toLowerCase().includes(term) &&
      !claim.agent_summary.toLowerCase().includes(term)
    ) {
      return false;
    }
  }
  return true;
}

function compareClaimsBy(field: SortField) {
  return (first: Claim, second: Claim): number => {
    switch (field) {
      case 'claimant_name':
        return first.claimant_name.localeCompare(second.claimant_name);
      case 'confidence':
        return second.confidence - first.confidence;
      case 'status':
        return first.status.localeCompare(second.status);
      case 'updated_at':
      default:
        return new Date(second.updated_at).getTime() - new Date(first.updated_at).getTime();
    }
  };
}

export function useClaimsViewModel() {
  const [filters, setFilters] = useState<ClaimFiltersApplied>({
    status: null,
    search: null,
    sort: 'updated_at',
  });

  const debouncedSearch = useDebounce(filters.search, SEARCH_DEBOUNCE_MS);

  const { data, isLoading, isError, error, refetch } = useClaimsQuery({
    ...filters,
    search: debouncedSearch,
  });

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

  const debouncedFilters = useMemo(
    () => ({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch]
  );

  useEffect(() => {
    setHasInitialBatch(false);
  }, [filters.status, debouncedSearch, filters.sort]);

  useEffect(() => {
    if (data?.items && !hasInitialBatch) {
      setMergedClaims(data.items);
    }
  }, [data?.items, hasInitialBatch]);

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
        return matchesFilters(lastEvent.data, debouncedFilters)
          ? updated
          : updated.filter(claim => claim.id !== lastEvent.data.id);
      });
      if (matchesFilters(lastEvent.data, debouncedFilters)) {
        setHighlightedClaimId(lastEvent.data.id);
      }
    }
  }, [lastEvent, debouncedFilters]);

  useEffect(() => {
    if (!highlightedClaimId) return;
    const timer = setTimeout(() => setHighlightedClaimId(null), HIGHLIGHT_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [highlightedClaimId]);

  const hasExistingData = mergedClaims.length > 0;

  const sortedClaims = useMemo(() => {
    if (!filters.sort) return mergedClaims;
    return [...mergedClaims].sort(compareClaimsBy(filters.sort));
  }, [mergedClaims, filters.sort]);

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
