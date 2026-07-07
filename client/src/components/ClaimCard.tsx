import type { Claim } from '../types/claims';
import { formatDateTime, getStatusConfig } from '../utils/claimUtils';
import { useHighlightedClaim } from '../hooks/useHighlightedClaim';

export function ClaimCard({ claim }: Readonly<{ claim: Readonly<Claim> }>) {
  const { highlightedClaimId } = useHighlightedClaim();
  const isHighlighted = highlightedClaimId === claim.id;
  const statusConfig = getStatusConfig(claim.status);

  return (
    <div
      className={[
        'p-4 space-y-2 transition-colors duration-500',
        isHighlighted ? 'bg-accent/10' : undefined,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-100 truncate" title={claim.agent_summary}>
            {claim.agent_summary}
          </p>
          <p className="text-xs text-gray-400 truncate" title={claim.claim_id}>
            {claim.claim_id}
          </p>
          <p className="text-xs text-gray-300 truncate" title={claim.claimant_name}>
            {claim.claimant_name}
          </p>
        </div>
        <span
          aria-label={`Status: ${statusConfig.label}`}
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium shrink-0 ${statusConfig.classes}`}
        >
          {statusConfig.label}
        </span>
      </div>
      <div className="flex items-center justify-between text-xs text-gray-400 tabular-nums">
        <span>{formatDateTime(claim.updated_at)}</span>
      </div>
    </div>
  );
}
