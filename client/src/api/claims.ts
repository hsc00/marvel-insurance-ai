import type { ClaimFiltersApplied, ClaimsResponse } from '../types/claims';

const API_BASE = '/claims';

export async function fetchClaims(filters?: {
  status: ClaimFiltersApplied['status'];
  priority: ClaimFiltersApplied['priority'];
  search: ClaimFiltersApplied['search'];
  signal?: AbortSignal;
}): Promise<ClaimsResponse> {
  const params = new URLSearchParams();

  if (filters?.status) {
    params.set('status', filters.status);
  }
  if (filters?.priority) {
    params.set('priority', filters.priority);
  }
  if (filters?.search) {
    params.set('search', filters.search);
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
