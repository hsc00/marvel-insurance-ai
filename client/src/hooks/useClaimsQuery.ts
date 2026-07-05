import { useQuery } from '@tanstack/react-query';
import type { ClaimFiltersApplied } from '../types/claims';
import { fetchClaims } from '../api/claims';

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
    staleTime: 30000,
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
