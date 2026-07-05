import type { Claim } from '../types/claims';
import { formatDateTime, getStatusConfig } from '../utils/claimUtils';
import { useHighlightedClaim } from '../hooks/useHighlightedClaim';

export function ClaimRow({ claim }: Readonly<{ claim: Readonly<Claim> }>) {
  const { highlightedClaimId } = useHighlightedClaim();
  const isHighlighted = highlightedClaimId === claim.id;
  const statusConfig = getStatusConfig(claim.status);

  return (
    <tr
      className={`border-b border-border transition-colors duration-500 ${
        isHighlighted ? 'bg-accent/10' : 'hover:bg-white/5'
      }`}
    >
      <td className="px-4 py-3.5">
        <p className="text-sm font-medium text-gray-100 truncate" title={claim.agent_summary}>
          {claim.agent_summary}
        </p>
        <p className="text-xs text-gray-400 truncate" title={claim.claim_id}>
          {claim.claim_id}
        </p>
      </td>
      <td className="px-4 py-3.5 text-sm text-gray-300">{claim.claimant_name}</td>
      <td className="px-4 py-3.5">
        <span
          aria-label={`Status: ${statusConfig.label}`}
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusConfig.classes}`}
        >
          {statusConfig.label}
        </span>
      </td>
      <td className="px-4 py-3.5 text-sm text-gray-300 tabular-nums">
        {Math.round(claim.confidence * 100)}%
      </td>
      <td className="px-4 py-3.5 text-sm text-gray-400 tabular-nums">
        {formatDateTime(claim.updated_at)}
      </td>
    </tr>
  );
}
