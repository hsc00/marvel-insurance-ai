import type { Claim } from '../types/claims';

interface ClaimRowProps {
  claim: Readonly<Claim>;
}

const STATUS_CONFIG = {
  pending: { label: 'Pending', classes: 'bg-yellow-900/20 text-yellow-300' },
  in_review: { label: 'In Review', classes: 'bg-blue-900/20 text-blue-300' },
  approved: { label: 'Approved', classes: 'bg-green-900/20 text-green-300' },
  denied: { label: 'Denied', classes: 'bg-red-900/20 text-red-300' },
} as const;

export function ClaimRow({ claim }: Readonly<ClaimRowProps>) {
  const config = STATUS_CONFIG[claim.status] ?? {
    label: claim.status,
    classes: 'bg-gray-900/20 text-gray-300',
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <tr
      tabIndex={0}
      className="border-b border-border transition-colors hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-inset"
    >
      <td className="px-4 py-3.5">
        <p className="text-sm font-semibold text-gray-100">{claim.agent_summary}</p>
        <p className="text-xs text-gray-500">{claim.claim_id}</p>
      </td>
      <td className="px-4 py-3.5">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${config.classes}`}
        >
          {config.label}
        </span>
      </td>
      <td className="px-4 py-3.5 text-sm text-gray-400">{formatDateTime(claim.updated_at)}</td>
    </tr>
  );
}
