import type { Claim } from '../types/claims';
import { formatDateTime, getStatusConfig } from '../utils/claimUtils';

export function ClaimCard({ claim }: Readonly<{ claim: Readonly<Claim> }>) {
  const config = getStatusConfig(claim.status);

  return (
    <div className="p-4 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-100 truncate" title={claim.agent_summary}>
            {claim.agent_summary}
          </p>
          <p className="text-xs text-gray-500 truncate" title={claim.claim_id}>
            {claim.claim_id}
          </p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium shrink-0 ${config.classes}`}
        >
          {config.label}
        </span>
      </div>
      <p className="text-xs text-gray-400 tabular-nums">{formatDateTime(claim.updated_at)}</p>
    </div>
  );
}
