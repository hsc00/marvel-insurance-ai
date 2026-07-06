import { useQuery } from '@tanstack/react-query';
import type { ClaimFiltersApplied } from '../types/claims';
import { fetchClaims } from '../api/claims';

const STALE_TIME_MS = 30000; // 30s "hard reset" buffer for stream sync
const GC_TIME_MS = 5 * 60 * 1000; // 5m cache to keep navigation snappy

export function useClaimsQuery(filters: ClaimFiltersApplied) {
  return useQuery({
    queryKey: [
      'claims',
      { status: filters.status, search: filters.search, sort: filters.sort },
    ] as const,
    queryFn: ({ signal }) =>
      fetchClaims({
        status: filters.status,
        search: filters.search,
        sort: filters.sort,
        signal,
      }),
    staleTime: STALE_TIME_MS,
    gcTime: GC_TIME_MS,
  });
}
