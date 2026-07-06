import type { Claim, ClaimFiltersApplied } from '../types/claims';

export const STATUS_CONFIG = {
  pending: { label: 'Pending', classes: 'bg-yellow-900/20 text-yellow-300' },
  in_review: { label: 'In Review', classes: 'bg-blue-900/20 text-blue-300' },
  approved: { label: 'Approved', classes: 'bg-green-900/20 text-green-300' },
  denied: { label: 'Denied', classes: 'bg-red-900/20 text-red-300' },
} as const;

export type ClaimStatus = keyof typeof STATUS_CONFIG;

export function getStatusConfig(status: string): { label: string; classes: string } {
  return (
    STATUS_CONFIG[status as ClaimStatus] ?? {
      label: status,
      classes: 'bg-gray-900/20 text-gray-300',
    }
  );
}

export function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function matchesFilters(claim: Claim, filters: ClaimFiltersApplied) {
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

export function compareClaimsBy(field: ClaimFiltersApplied['sort']) {
  return (first: Claim, second: Claim): number => {
    if (!field) return 0;
    switch (field) {
      case 'claimant_name':
        // Ascending: A → Z
        return first.claimant_name.localeCompare(second.claimant_name);
      case 'confidence':
        // Descending: highest confidence first
        return second.confidence - first.confidence;
      case 'status':
        // Ascending: deterministic enum order
        return first.status.localeCompare(second.status);
      case 'updated_at':
      default:
        // Descending: newest claims first
        return new Date(second.updated_at).getTime() - new Date(first.updated_at).getTime();
    }
  };
}
