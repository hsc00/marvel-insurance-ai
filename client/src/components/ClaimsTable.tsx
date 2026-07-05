import type { Claim } from '../types/claims';
import { ClaimRow } from './ClaimRow';
import { ClaimCard } from './ClaimCard';

export function ClaimsTable({ claims }: Readonly<{ claims: readonly Claim[] }>) {
  return (
    <div>
      <div className="hidden md:block overflow-x-auto" aria-label="Claims">
        <table className="w-full table-fixed">
          <colgroup>
            <col className="w-[65%]" />
            <col className="w-[15%]" />
            <col className="w-[20%]" />
          </colgroup>
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

      <ul className="md:hidden divide-y divide-border" aria-label="Claims cards">
        {claims.map(claim => (
          <li key={claim.id}>
            <ClaimCard claim={claim} />
          </li>
        ))}
      </ul>
    </div>
  );
}
