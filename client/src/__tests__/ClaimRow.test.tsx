import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ClaimRow } from '../components/ClaimRow';
import { HighlightedClaimContext } from '../hooks/useHighlightedClaim';
import type { Claim } from '../types/claims';
import { formatDateTime } from '../utils/claimUtils';

const claim: Claim = {
  id: '1',
  claim_id: 'CLM-2026-001',
  claimant_name: 'Alice Johnson',
  status: 'approved',
  updated_at: '2026-07-05T10:30:00Z',
  agent_summary: 'Approved after review',
  confidence: 0.95,
};

function renderWithHighlight(claim: Claim, highlightedClaimId: string) {
  return render(
    <HighlightedClaimContext.Provider value={{ highlightedClaimId }}>
      <table>
        <tbody>
          <ClaimRow claim={claim} />
        </tbody>
      </table>
    </HighlightedClaimContext.Provider>
  );
}

function renderClaimRow(claim: Claim) {
  return render(
    <table>
      <tbody>
        <ClaimRow claim={claim} />
      </tbody>
    </table>
  );
}

describe('ClaimRow', () => {
  it('renders claim id and agent summary', () => {
    renderClaimRow(claim);

    expect(screen.getByText('CLM-2026-001')).toBeInTheDocument();
    expect(screen.getByText('Approved after review')).toBeInTheDocument();
  });

  it('renders a formatted date including year', () => {
    renderClaimRow(claim);

    expect(screen.getByText(formatDateTime(claim.updated_at))).toBeInTheDocument();
  });

  it('renders the status badge', () => {
    renderClaimRow(claim);

    expect(screen.getByText('Approved')).toBeInTheDocument();
  });

  it('applies highlight class when the claim matches highlightedClaimId', () => {
    renderWithHighlight(claim, '1');

    const row = screen.getByText('CLM-2026-001').closest('tr');
    expect(row).toHaveClass('bg-accent/10');
  });

  it('does not highlight row when the claim does not match highlightedClaimId', () => {
    renderWithHighlight(claim, '2');

    const row = screen.getByText('CLM-2026-001').closest('tr');
    expect(row).not.toHaveClass('bg-accent/10');
  });
});
