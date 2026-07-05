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

---

## Explicit 422 Validation Error Path — 2026-07-04

Added a custom `RequestValidationError` exception handler in `server/main.py` that normalizes FastAPI's default validation errors into the project's `ErrorResponse` shape.
I could've added integration tests to test the error correctly with FastAPI `TestClient` but for this challenge it was not added.

---

## Poetry Setup and Dependency Management — 2026-07-04

Added Poetry for Python dependency management in the backend to ensure reproducible builds and easier setup for reviewers.

### Time Constraint Note

- CodeRabbit and SonarQube were only used as local extensions as that would make development slower and not produce significant gains for a single-developer project.
- GitHub Actions pipeline was skipped to keep timebox real - local pre-commit hooks + extensions already enforce code quality at development time.

---

## SSE Stream Error Handling and Heartbeat — 2026-07-04

Guarded `event_generator()` in `server/main.py` with try/except blocks:

- Initial batch event wrapped: emits `error` event on serialization failure
- Loop body wrapped: emits `error` event on any processing error and returns gracefully
- Added guard for empty `statuses` list when updating claim status (prevents `random.choice` on empty sequence)
- Added periodic heartbeat comment `: heartbeat` every 3 seconds to prevent proxy/idle connection drops
- Added `DEFAULT_RETRY_INTERVAL = 3000` (3 seconds)
- Error events now include `retry:` field instructing SSE clients to wait before reconnecting
- Follows SSE specification for automatic client reconnection behavior

---

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

---

## ClaimsTable UI Feature — 2026-07-04

### Files Created

- `client/src/api/claims.ts` - fetchClaims helper calling GET /api/claims with filter params
- `client/src/hooks/useClaimsQuery.ts` - TanStack Query hook with staleTime/gcTime caching
- `client/src/components/ClaimsTable.tsx` - responsive table wrapper with ClaimRow list
- `client/src/components/ClaimRow.tsx` - single claim row with status/priority badges, confidence progress bar
- `client/src/components/FilterBar.tsx` - status, priority, and search filter controls
- `client/src/components/LoadingState.tsx` - loading spinner with accessible role="status"
- `client/src/components/ErrorState.tsx` - error display with retry button
- `client/src/components/EmptyState.tsx` - empty state for no matching claims

### Accessibility

- All interactive elements have proper aria-label attributes
- Keyboard focus rings via focus:outline-none focus:ring-2 focus:ring-accent
- Role attributes on status/error/empty states for screen readers
- sr-only labels for form inputs

---

## SSE Hook Integration and Real-Time Claims Updates — 2026-07-05

### Files Created

- `client/src/hooks/useClaimsSSE.ts` - Custom React hook for SSE real-time updates

### Implementation Details

`useClaimsSSE(filters)` connects to `/claims/stream` using the same query params as `fetchClaims`.

**SSE Event Parsing:**

- `initial_batch` - Parsed to full `ClaimsResponse`, sets `lastEvent`
- `claim_update` - Parsed to `Claim`, sets `lastEvent`
- `error` - Parsed to `ErrorResponse`, sets `error` message

**Cleanup:** EventSource closed on unmount and when filters change.

### App.tsx Changes

- Applied SSE updates: `initial_batch` replaces claims, `claim_update` replaces matching claim by id (ignores if not found)
- ClaimsTable now renders `mergedClaims` instead of raw `data.items`
- Loading/error/empty states remain driven by TanStack Query

### Scope Note

The frontend SSE hook test was assessed against `docs/implementation-tasks.md`. The take-home explicitly limits the test scope to backend SSE contract coverage; frontend hook tests were therefore not retained to respect the documented minimal-test constraint.

---

## Responsive Layout Basics — 2026-07-05

Implemented mobile card layout

### Trade-off

Implemented exactly 2 layout breakpoints (`<md` cards, `md+` table) instead of adding tablet-specific polishing (`sm`). This keeps the diff small while delivering a distinct mobile experience.

---

## Build Verification — 2026-07-05

Executed quality gates for both client and server.

### Frontend

- `npm run typecheck` — passed
- `npm run lint` — passed
- `npm run build` — passed (289 ms)
- `npm run test -- --run` — 19 tests passed across 5 test files

### Backend

- `poetry run ruff check .` — passed after resolving 4 issues:
  - 1 unsorted import block
  - 3 lines exceeding 100-char limit in `server/main.py` SSE event generator
- `poetry run pytest` — 13 tests passed

### Outcome

All quality gates green. No feature regressions. Backend lint fix committed.

---

## Row Highlighting on SSE Update — 2026-07-05

Implemented a 1.5-second highlight for updated rows after `claim_update` events.

### State Management Choice: React Context over Prop Drilling

- Used a lightweight React Context (`HighlightedClaimContext`) to avoid prop drilling.
- The feature is a good quick win because it introduces no new dependencies and keeps state logic centralized while allowing leaf components (`ClaimRow`) to consume it directly.
- KISS: minimal code, fast implementation, no external state library required.

### Changes

- `client/src/App.tsx`: Added `highlightedClaimId` state; on `claim_update`, sets the ID and auto-clears after 1.5s via timeout. Provider value memoized with `useMemo`.
- `client/src/hooks/useHighlightedClaim.tsx`: New context and hook for highlighted claim state.
- `client/src/components/ClaimRow.tsx`: Reads context internally; applies `bg-accent/10` with `transition-colors duration-500` when highlighted.
- `client/src/__tests__/ClaimRow.test.tsx`: Added two highlight assertions rendered through context provider.

---

## Frontend Readability Pass — 2026-07-05

Small readability cleanup across delegated frontend files. No behavior changes.

### Files Touched

- `client/src/App.tsx`
- `client/src/components/ClaimRow.tsx`
- `client/src/components/ClaimCard.tsx`
- `client/src/hooks/useDebounce.ts`
- `client/src/hooks/useClaimsSSE.ts`
- `client/src/utils/claimUtils.ts`

### Changes

- Extracted `getStatusConfig()` helper in `claimUtils.ts` to deduplicate the inline fallback snippet that appeared in both `ClaimCard` and `ClaimRow`; replaced inline fallbacks with the helper.
- Removed redundant `if (timerRef.current)` guards in `useDebounce.ts`; `clearTimeout` is safe with `undefined`.
- Removed redundant `Readonly<...>` wrapper from `FilterBarProps` destructuring in `FilterBar.tsx`; props were already typed as readonly.
- Extracted `parseSseEventData()` inside `useClaimsSSE.ts` to centralize `JSON.parse` + error handling that was duplicated across `initial_batch` and `claim_update` handlers.

---

## Backend Readability Pass — 2026-07-05

Performed a fast, small readability cleanup across delegated server files.

### Files Touched

- `server/tests/test_claims.py`

### Changes

- Simplified several `ClaimFiltersApplied(...)` instantiations in `server/tests/test_claims.py` by omitting explicit default `None` values, reducing noise at call sites.

---

## Sort Controls Added; Priority Removed from Data Model and UI — 2026-07-05

Replaced the Priority filter with a Sort control across backend and frontend to reduce control density and enable reviewer-friendly ordering.

### Backend Changes

- Added `ClaimSortField` enum to `server/src/models/claims.py` (`updated_at`, `confidence`, `claimant_name`, `status`).
- Extended `ClaimFiltersApplied` with `sort: ClaimSortField | None = None`.
- Updated `GET /claims` endpoint to accept `sort` query param and forwarded it to `filter_claims()`.
- `filter_claims()` now sorts results deterministically:
  - `updated_at` → newest first (default when unsorted)
  - `confidence` → highest first
  - `claimant_name` → alphabetical, case-insensitive
  - `status` → lexicographic enum order

### Frontend Changes

- Removed `ClaimPriority` type and `priority` field from `client/src/types/claims.ts` `Claim` and `ClaimFiltersApplied`.
- Added `ClaimSortField` type and `sort` field to `ClaimFiltersApplied`.
- `client/src/api/claims.ts`: removed `priority` query param; added `sort` query param.
- `client/src/hooks/useClaimsQuery.ts` and `client/src/hooks/useClaimsSSE.ts`: updated query keys and stream params to use `sort` instead of `priority`.
- `client/src/components/FilterBar.tsx`: replaced priority dropdown with sort dropdown; extracted `FILTER_SELECT_CLASSES` to deduplicate select styling.
- `client/src/components/ClaimsTable.tsx` and `client/src/components/ClaimCard.tsx`: added `Claimant` and `Confidence` columns to align with the sortable fields and improve scanability.
- Tests updated to remove `priority` literals and assert sort column rendering where applicable.

### Trade-off

- The backend still supports the `priority` query parameter; the type remains in `ClaimFiltersApplied` so the capability is not lost—only the UI and client-side model defer it. Re-introducing a Priority UI control can be evaluated after reviewer feedback on the new Sort control.

---

## Cleanup pass: magic numbers — 2026-07-05

Small post-Pass cleanup focused on readability and test ownership. Magic numbers removed, all the other cleanups would be over-engineering.

---

## App.tsx Refactor: Extracted Claims View Model Hook — 2026-07-05

Moved orchestrations out of `client/src/App.tsx` into `client/src/hooks/useClaimsViewModel.ts` to improve separation of concerns and reduce component size.

### Changes

- **New file:** `client/src/hooks/useClaimsViewModel.ts` owns:
  - `ClaimFiltersApplied` state and debounced search wiring
  - `useClaimsQuery` and `useClaimsSSE` composition
  - SSE + REST merge logic (`initial_batch`, `claim_update`)
  - Row highlighting timer and filter-dependent visibility
  - Sorting via `useMemo`
  - Derived state (`hasExistingData`, `highlightedClaimContextValue`)
- **Updated:** `client/src/App.tsx` now only renders UI and consumes the returned view-model values.

### Rationale

- Keeps `App.tsx` under ~120 lines (view-only).
- Centralizes data-orchestration rules in one hook so they don't live inline in JSX.
- Existing tests in `client/src/__tests__/App.test.tsx` continue to pass because they mock `useClaimsQuery` and `useClaimsSSE` directly, which the view-model hook still imports.

---

## React Error Boundary — 2026-07-05

Implemented a root-level React error boundary to prevent unhandled render errors from killing the entire UI.

### Files Created

- `client/src/components/ErrorBoundary.tsx` — class boundary component
- `client/src/components/BoundaryFallback.tsx` — presentational fallback view
- `client/src/__tests__/ErrorBoundary.test.tsx` — regression tests

### Files Modified

- `client/src/main.tsx` — wrapped root `App` with `ErrorBoundary`

### Separation of Concerns

Split into two files to match the project's view/logic pattern:

- `ErrorBoundary.tsx` owns error capture/recovery state only
- `BoundaryFallback.tsx` owns the presentational fallback UI, keeping the boundary class thin

---

## Backend Config Module + .env Fixes — 2026-07-05

### New Files

- `server/src/config.py` — owns API route constants and env loading:
  - Loads `.env` from repo root via `find_dotenv(filename='.env', usecwd=False)` regardless of CWD
  - Exports `CORS_ORIGINS`, `CORS_METHODS`, `CORS_HEADERS`

### Changed Files

- `server/main.py` — switched to shared route constants and imported CORS env from `config.py`, removing inline `load_dotenv()` and local env parsing.

### Future Implementation

- Client-side configurable API base via Vite env vars.
- Backend `API_BASE_URL` support for per-environment deployments.
