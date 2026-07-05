import type { ClaimFiltersApplied, ClaimsResponse } from '../types/claims';

const API_BASE = '/claims';

export async function fetchClaims(filters?: {
  status: ClaimFiltersApplied['status'];
  search: ClaimFiltersApplied['search'];
  sort: ClaimFiltersApplied['sort'];
  signal?: AbortSignal;
}): Promise<ClaimsResponse> {
  const params = new URLSearchParams();

  if (filters?.status) {
    params.set('status', filters.status);
  }
  if (filters?.search) {
    params.set('search', filters.search);
  }
  if (filters?.sort) {
    params.set('sort', filters.sort);
  }

  const response = await fetch(`${API_BASE}?${params.toString()}`, { signal: filters?.signal });

  if (!response.ok) {
    let errorData: { detail?: string; errors?: string[] } = {};
    try {
      errorData = (await response.json()) as { detail?: string; errors?: string[] };
    } catch {
      errorData = { detail: response.statusText || `HTTP ${response.status}` };
    }
    throw new Error(errorData.detail || errorData.errors?.join(', ') || `HTTP ${response.status}`);
  }

  return response.json() as Promise<ClaimsResponse>;
}
