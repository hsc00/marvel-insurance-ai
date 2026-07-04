# Project Log - MarvelX Claims Review UI

## Scaffold, Docs, and Timebox Decisions — 2026-07-03

### Work Completed

1. Repository setup:
   - `git init` and root `.gitignore`
   - `README.md` and `AGENTS.md`
   - VitePress docs site in `docs/`
   - Vite + React + TypeScript scaffold in `client/`
   - TanStack Query installed in `client/`
   - Empty FastAPI project structure scaffolded in `server/`
   - `.env.example` added for client and server
   - `.github/agents/` and `.github/skills/` configured
   - `.kilo/` configured for local orchestration
   - Husky pre-commit hook added for frontend TS/TSX
   - ADRs and project log created in `docs/`

2. Documentation and process:
   - ADRs documented in `docs/adr/`
   - VitePress configured and building
   - PR guardrail strategy documented

### Deviation Notes

- Backend pre-commit/CI enforcement dropped to preserve frontend execution time; documented as a deliberate trade-off in `docs/adr/010-pr-guardrails.md`.
- VitePress kept despite timebox because setup took ~5 minutes and makes documentation easier to read and more professional.
- Table virtualization was initially part of the roadmap but because of timeboxing it was decided to be removed.

---

## FastAPI Pydantic Models for Claims — 2026-07-04

Created `server/src/models/claims.py` with:

- `ClaimStatus` enum
- `ClaimPriority` enum
- `Claim` model
- `ClaimFiltersApplied` model for filter query params
- `ClaimsResponse` response envelope
- `ErrorResponse` model for error payloads

Created `server/src/models/__init__.py` exporting all types.

### Validation

- `confidence` field constrained to 0-1
- String fields validated non-blank via `field_validator` and `ConfigDict(str_strip_whitespace=True)`
- `max_length` constraints added to prevent oversized payloads

### Design Rationale: Extensibility

- Enum values can be extended without breaking existing consumers (e.g., adding new `ClaimStatus` values like `archived`, `escalated`)
- New fields can be added to `Claim` model without requiring frontend changes
- `ConfigDict(str_strip_whitespace=True)` applied consistently across models for predictable normalization
- `__all__` export list defines intentional public API surface for clean imports
- Standard Pydantic v2 patterns only — no custom abstractions to learn when inheriting this codebase

---

## Seed In-Memory Claim Data — 2026-07-04

Created `server/src/data/seed_claims.py` with 8 sample claims covering all statuses and priorities:

- 2 `pending` claims (high and low priority)
- 2 `in_review` claims (medium and high priority)
- 2 `approved` claims (medium and high priority)
- 2 `denied` claims (low priority)

Claims include realistic names, claim IDs, and agent summaries for UI development testing.

### Minimal Tests

Added `server/tests/test_claims.py` with 3 critical validation tests:

- Confidence bounds enforcement (reject >1 or <0)
- Blank string rejection for required fields
- Valid claim serialization

Added pytest configuration in `server/pyproject.toml` for easy test execution: `python -m pytest server/tests`.

---

## GET /claims Endpoint — 2026-07-04

Implemented `server/main.py` with:

- `GET /claims` endpoint using `Annotated` type hints for FastAPI Query parameters with descriptions
- Uses `filter_claims()` function to filter in-memory claims across claimant_name, claim_id, and agent_summary
- Returns `ClaimsResponse` with `items`, `total`, and `filters` fields
- Invalid enum values automatically return 422 via Pydantic validation

---

## Code Quality Tooling — 2026-07-04

Added Prettier configuration (`client/.prettierrc.json`) and lint-staged integration for consistent formatting across frontend.

Added Ruff configuration (`server/pyproject.toml`) for Python linting and formatting.

Updated `package.json` lint-staged to run Prettier on all staged files before TypeScript checks.

Added `ruff==0.12.1` to `server/requirements.txt` for automated linting.

## Explicit 422 Validation Error Path — 2026-07-04

Added a custom `RequestValidationError` exception handler in `server/main.py` that normalizes FastAPI's default validation errors into the project's `ErrorResponse` shape.
I could've added integration tests to test the error correctly with FastAPI `TestClient` but for this challenge it was not added.

## Poetry Setup and Dependency Management — 2026-07-04

Added Poetry for Python dependency management in the backend to ensure reproducible builds and easier setup for reviewers.

### Time Constraint Note

- CodeRabbit and SonarQube were only used as local extensions as that would make development slower and not produce significant gains for a single-developer project.
- GitHub Actions pipeline was skipped to keep timebox real - local pre-commit hooks + extensions already enforce code quality at development time.

## SSE Stream Error Handling and Heartbeat — 2026-07-04

Guarded `event_generator()` in `server/main.py` with try/except blocks:

- Initial batch event wrapped: emits `error` event on serialization failure
- Loop body wrapped: emits `error` event on any processing error and returns gracefully
- Added guard for empty `statuses` list when updating claim status (prevents `random.choice` on empty sequence)
- Added periodic heartbeat comment `: heartbeat` every 5 seconds to prevent proxy/idle connection drops
- Added `DEFAULT_RETRY_INTERVAL = 3000` (3 seconds)
- Error events now include `retry:` field instructing SSE clients to wait before reconnecting
- Follows SSE specification for automatic client reconnection behavior

## CORS Configuration — 2026-07-04

Added `CORSMiddleware` to `server/main.py`:

- Configured via environment variables: `CORS_ORIGINS`, `CORS_METHODS`, `CORS_HEADERS`
- Defaults: `CORS_ORIGINS=http://localhost:5173` (Vite dev server), `CORS_METHODS=*`, `CORS_HEADERS=*`
- `allow_credentials=True` for cookie/auth support
- Added `load_dotenv()` call to load environment variables from `.env` file
- Updated `server/.env.example` with CORS configuration variables

---

## Frontend Type Definitions — 2026-07-04

Created `client/src/types/claims.ts` to mirror backend Pydantic models.

### Type Mapping: Python → TypeScript

| Backend Model         | Frontend Type                   |
| --------------------- | ------------------------------- |
| `ClaimStatus` enum    | `type ClaimStatus` union        |
| `ClaimPriority` enum  | `type ClaimPriority` union      |
| `Claim` model         | `interface Claim`               |
| `ClaimFiltersApplied` | `interface ClaimFiltersApplied` |
| `ClaimsResponse`      | `interface ClaimsResponse`      |
| `ErrorResponse`       | `interface ErrorResponse`       |

### erasableSyntaxOnly Decision

- `client/tsconfig.app.json` enables `erasableSyntaxOnly: true`
- This disallows TypeScript `enum` syntax because it requires runtime JavaScript enum emitters
- Python `ClaimStatus`/`ClaimPriority` string enums were therefore mirrored as TypeScript string union types
- Runtime values remain identical to backend enum values, ensuring full API contract compatibility
- String unions provide equivalent type safety with zero runtime overhead and better IntelliSense behavior

### Contract Alignment

- All field names preserved 1:1 with backend (`claim_id`, `claimant_name`, `agent_summary`, `confidence`)
- `updated_at` typed as `string` matching FastAPI/Pydantic JSON serialization of `datetime` to ISO 8601
- Added SSEType definitions for real-time stream events
