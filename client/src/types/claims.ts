export type ClaimStatus = 'pending' | 'in_review' | 'approved' | 'denied';

export type ClaimPriority = 'low' | 'medium' | 'high';

export interface Claim {
  id: string;
  claim_id: string;
  claimant_name: string;
  status: ClaimStatus;
  priority: ClaimPriority;
  updated_at: string;
  agent_summary: string;
  confidence: number;
}

export interface ClaimFiltersApplied {
  status: ClaimStatus | null;
  priority: ClaimPriority | null;
  search: string | null;
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

export type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error';
