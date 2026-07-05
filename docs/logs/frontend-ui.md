# Frontend UI Core

## Types and Contract

Created `client/src/types/claims.ts` to mirror backend Pydantic models. Enums became TypeScript string unions because `erasableSyntaxOnly: true` is enabled. Runtime values remain identical to the backend, guaranteeing API contract compatibility with zero runtime overhead.

## Components

Built responsive claims table with `ClaimCard` (mobile) and `ClaimRow` (desktop) layouts. `FilterBar` provides status and search filters plus sort selection. `LoadingState`, `ErrorState`, and `EmptyState` handle all data-view states with proper ARIA roles and keyboard focus rings.

## Real-time and Highlights

TanStack Query caches server state from `GET /claims`. SSE updates merge into the query cache rather than replacing it. After each `claim_update`, a 1.5-second row highlight is triggered via `ClaimIdContext` so reviewers can see which row changed.

## Architecture Improvements

- `useClaimsQuery` and `useClaimsSSE` are composed in a custom `useClaimsViewModel` hook.
- `useClaimsViewModel` owns debounced search, filter-dependent visibility, sort derivation, and merge logic, keeping `App.tsx` view-only.
- A root-level `ErrorBoundary` for unhandled render errors wraps the application in `main.tsx`.
