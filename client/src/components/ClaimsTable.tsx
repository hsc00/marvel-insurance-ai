import type { Claim } from '../types/claims';
import { ClaimRow } from './ClaimRow';

interface ClaimsTableProps {
  claims: readonly Claim[];
}

export function ClaimsTable({ claims }: Readonly<ClaimsTableProps>) {
  return (
    <div className="overflow-x-auto" aria-label="Claims">
      <table className="w-full min-w-max">
        <thead>
          <tr className="border-b border-border">
            <th
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400"
              scope="col"
            >
              Claim
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400"
              scope="col"
            >
              Status
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400"
              scope="col"
            >
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {claims.map(claim => (
            <ClaimRow key={claim.id} claim={claim} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
