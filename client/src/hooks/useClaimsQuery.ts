import { useQuery } from '@tanstack/react-query';
import type { ClaimFiltersApplied } from '../types/claims';
import { fetchClaims } from '../api/claims';

const STALE_TIME_MS = 30000;
const GC_TIME_MS = 5 * 60 * 1000;

export function useClaimsQuery(filters: ClaimFiltersApplied) {
  return useQuery({
    queryKey: [
      'claims',
      { status: filters.status, priority: filters.priority, search: filters.search },
    ] as const,
    queryFn: ({ signal }) =>
      fetchClaims({
        status: filters.status,
        priority: filters.priority,
        search: filters.search,
        signal,
      }),
    staleTime: STALE_TIME_MS,
    gcTime: GC_TIME_MS,
  });
}
