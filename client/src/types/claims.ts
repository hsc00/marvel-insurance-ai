export type ClaimStatus = 'pending' | 'in_review' | 'approved' | 'denied';

export type ClaimSortField = 'updated_at' | 'confidence' | 'claimant_name' | 'status';

export interface Claim {
  id: string;
  claim_id: string;
  claimant_name: string;
  status: ClaimStatus;
  updated_at: string;
  agent_summary: string;
  confidence: number;
}

export interface ClaimFiltersApplied {
  status: ClaimStatus | null;
  search: string | null;
  sort: ClaimSortField | null;
}

export interface ClaimsResponse {
  items: Claim[];
  total: number;
  filters: ClaimFiltersApplied;
}

export interface ErrorResponse {
  detail: string;
  status_code: number;
  errors: string[];
}

export type SSEEventType = 'initial_batch' | 'claim_update' | 'error';

export type SSEClaimUpdateEvent =
  | {
      type: 'initial_batch';
      data: ClaimsResponse;
    }
  | {
      type: 'claim_update';
      data: Claim;
    }
  | {
      type: 'error';
      data: ErrorResponse;
    };
