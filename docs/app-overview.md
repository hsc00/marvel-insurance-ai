# App Overview

## State Management

The frontend uses a layered state strategy:

1. **TanStack Query** — owns all server state (claims data, loading, error, caching, background refetch). This is the primary bus between backend and UI.
2. **React `useState`** — local UI state that does not need to be shared, such as filter inputs and sort selection.
3. **React Context** — lightweight shared UI state that would otherwise require prop drilling. Used for the SSE row-highlight transient state (`HighlightedClaimContext`).

A custom `useClaimsViewModel` hook extracts all data orchestration out of `App.tsx`:

- Composes `useClaimsQuery` and `useClaimsSSE`
- Merges REST `initial_batch` with SSE `claim_update` events
- Owns debounced search, filter-dependent visibility, and sort derivation

TanStack Query was chosen instead of Zustand or Redux Toolkit because the app is server-state driven; adding a global store would duplicate caching and async-state boilerplate without value.

## Data Contract

Backend models (Pydantic v2) and frontend types are mirrored intentionally:

| Backend               | Frontend                        |
| --------------------- | ------------------------------- |
| `ClaimStatus` enum    | `type ClaimStatus` union        |
| `ClaimPriority` enum  | `type ClaimPriority` union      |
| `Claim` model         | `interface Claim`               |
| `ClaimFiltersApplied` | `interface ClaimFiltersApplied` |
| `ClaimsResponse`      | `interface ClaimsResponse`      |
| `ErrorResponse`       | `interface ErrorResponse`       |

Key contract rules:

- Field names preserve 1:1 mapping.
- `updated_at` is an ISO 8601 string; backend serializes `datetime` to JSON string.
- `client/tsconfig.app.json` enables `erasableSyntaxOnly: true`, so Python enums are mirrored as TypeScript string unions instead of TS enums. Runtime values remain identical, guaranteeing API contract compatibility with zero runtime overhead.

## Real-time Updates

Real-time claim updates use **Server-Sent Events (SSE)** between FastAPI and the browser `EventSource`.

Why SSE:

- One-way server→client streaming matches claim activity changes perfectly.
- Native browser support with `EventSource`; no extra socket library required.
- FastAPI emits `StreamingResponse` with an async generator.
- Works well with TanStack Query: incoming SSE events merge into the query cache rather than replace it, preserving pagination/filter state.

SSE lifecycle:

1. `useClaimsSSE` opens an `EventSource` to `/claims/stream` with the same filter params as REST.
2. `initial_batch` hydrates the table from the full `ClaimsResponse`.
3. `claim_update` replaces matching claims by id.
4. `error` events surface a user-facing message and trigger manual retry.
5. The backend sends a heartbeat comment every 3s and a `retry:` header on errors so clients back off after transport failures.
6. The connection closes automatically on unmount or when filters change.

## What Was Skipped + Why

- **Table virtualization** — For a single-page sample dataset, windowing adds a dependency without measurable benefit.
- **Comprehensive test suite** — Minimal tests demonstrate capability; the take-home rewards strong delivery, not exhaustive coverage.
- **Theming** — Tailwind v4 setup supports future theming without structural changes.
- **Offline support** — Right-sized for online coverage review only.
- **CI/CD pipeline** — Local pre-commit hooks + extensions already enforce code quality at development time.
- **Automatic SSE retry / exponential backoff** — Manual retry is implemented; automatic `EventSource` reconnect follows the SSE spec but is bounded by the hook's async task lifecycle.
- **URL-synced filters** — Filters are lost on refresh; this is a known future enhancement.
- **Priority filter removed from UI** — Replaced with a Sort control to reduce control density. Priority can be reintroduced easily in the future.
- **Runtime contract validation in the frontend** — Would catch backend contract drift at runtime, but types already mirror Pydantic closely and adding Zod would have been overengineering for this take-home.
- **Responsive DOM duplication** — Both `<table>` (md+) and card layout (<md) render; in a production app we would conditionally render one, but the take-home rewards shipping a strong result quickly.
- **Architecture diagram** - cool to be part of documentation as it is a visual representation of how components, client and server interact but for this challenge would be over engineering too.

## What to Build Next

- **URL-synced filters** — Persist filter/sort state in query params so reviewers can share views.
- **Request timeout / abort cleanup** — Add client-side fetch timeout to avoid indefinite loading states on slow networks.
- **SSE retry with exponential backoff** — Replace manual retry with automatic backoff based on SSE `retry:` headers.
- **Persistent filters** — Use `localStorage` to preserve reviewer context across sessions.
- **Automated accessibility checks** — Add `axe-core` or Lighthouse CI to catch focus/contrast issues before handoff.
- **Extended test coverage** — Hook-level tests for `useClaimsSSE` and `useDebounce`, plus integration tests for filter state changes.
- **Table virtualization** — If claims volume grows, windowed rendering keeps DOM size bounded.
