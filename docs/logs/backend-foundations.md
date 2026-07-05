# Backend Foundations

## Pydantic Models

Created `server/src/models/claims.py` with `ClaimStatus`, `ClaimPriority` enums, `Claim`, `ClaimFiltersApplied`, `ClaimsResponse`, and `ErrorResponse`. Confidence is constrained to [0,1]. Required strings are validated non-blank with `field_validator` and `ConfigDict(str_strip_whitespace=True)`. `__all__` export list defines the intentional public API surface.

## Seed Data

Added `server/src/data/seed_claims.py` with 8 sample claims: 2 `pending`, 2 `in_review`, 2 `approved`, 2 `denied`. Each includes realistic claimant names, claim IDs, and agent summaries.

## Endpoint

Implemented `GET /claims` with `Annotated` Query params for status, search, and sort. `filter_claims()` matches against `claimant_name`, `claim_id`, and `agent_summary`. Returns `ClaimsResponse` with `items`, `total`, and `filters`.

## Validation Error Path

Custom `RequestValidationError` handler in `server/main.py` normalizes FastAPI's 422 errors into the project's `ErrorResponse` shape, so the frontend can handle them consistently.
