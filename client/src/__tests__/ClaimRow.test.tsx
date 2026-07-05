import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ClaimRow } from '../components/ClaimRow';
import type { Claim } from '../types/claims';

const claim: Claim = {
  id: '1',
  claim_id: 'CLM-2026-001',
  claimant_name: 'Alice Johnson',
  status: 'approved',
  priority: 'high',
  updated_at: '2026-07-05T10:30:00Z',
  agent_summary: 'Approved after review',
  confidence: 0.95,
};

describe('ClaimRow', () => {
  it('renders claim id and agent summary', () => {
    render(<ClaimRow claim={claim} />);

    expect(screen.getByText('CLM-2026-001')).toBeInTheDocument();
    expect(screen.getByText('Approved after review')).toBeInTheDocument();
  });

  it('renders a formatted date including year', () => {
    render(<ClaimRow claim={claim} />);

    expect(screen.getByText('Jul 5, 2026, 11:30 AM')).toBeInTheDocument();
  });

  it('renders the status badge', () => {
    render(<ClaimRow claim={claim} />);

    expect(screen.getByText('Approved')).toBeInTheDocument();
  });
});
