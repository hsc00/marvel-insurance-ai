import type { Claim } from '../types/claims';
import { STATUS_CONFIG, formatDateTime } from '../utils/claimUtils';
import { useHighlightedClaim } from '../hooks/useHighlightedClaim';

export function ClaimRow({ claim }: Readonly<{ claim: Readonly<Claim> }>) {
  const { highlightedClaimId } = useHighlightedClaim();
  const isHighlighted = highlightedClaimId === claim.id;
  const config = STATUS_CONFIG[claim.status] ?? {
    label: claim.status,
    classes: 'bg-gray-900/20 text-gray-300',
  };

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
        <p className="text-xs text-gray-500 truncate" title={claim.claim_id}>
          {claim.claim_id}
        </p>
      </td>
      <td className="px-4 py-3.5">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${config.classes}`}
        >
          {config.label}
        </span>
      </td>
      <td className="px-4 py-3.5 text-sm text-gray-400 tabular-nums">
        {formatDateTime(claim.updated_at)}
      </td>
    </tr>
  );
}
