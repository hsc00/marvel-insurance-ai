import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ClaimsTable } from '../components/ClaimsTable';
import type { Claim } from '../types/claims';

const claims: Claim[] = [
  {
    id: '1',
    claim_id: 'CLM-2026-001',
    claimant_name: 'Alice Johnson',
    status: 'approved',
    priority: 'high',
    updated_at: '2026-07-05T10:30:00Z',
    agent_summary: 'Approved after review',
    confidence: 0.95,
  },
  {
    id: '2',
    claim_id: 'CLM-2026-002',
    claimant_name: 'Bob Smith',
    status: 'pending',
    priority: 'low',
    updated_at: '2026-07-06T11:00:00Z',
    agent_summary: 'Awaiting docs',
    confidence: 0.7,
  },
];

describe('ClaimsTable', () => {
  it('renders headers', () => {
    render(<ClaimsTable claims={claims} />);

    expect(screen.getByText('Claim')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
  });

  it('renders rows for each claim', () => {
    render(<ClaimsTable claims={claims} />);

    expect(screen.getByText('CLM-2026-001')).toBeInTheDocument();
    expect(screen.getByText('CLM-2026-002')).toBeInTheDocument();
  });

  it('renders empty table when no claims provided', () => {
    render(<ClaimsTable claims={[]} />);

    expect(screen.queryByText('CLM-2026-001')).not.toBeInTheDocument();
  });
});
