# Frontend Refactors and Polish

## Readability Pass

- Extracted `getStatusConfig()` helper in `claimUtils.ts` to deduplicate status badge text between `ClaimCard` and `ClaimRow`.
- Centralized `JSON.parse` + error handling in `parseSseEventData()` inside `useClaimsSSE.ts`.

## Magic Numbers

Replaced inline timings and counts with named constants in the view-model and SSE hook for clearer intent and easier tuning.
