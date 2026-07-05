# Implementation Tasks

## Phase 0: Repository & Docs Setup (completed)

1. Initialize Git repository
2. Create `README.md`
3. Create initial ADRs in `docs/adr/`
4. Create `AGENTS.md` with process rules
5. Initialize VitePress docs site in `docs/`
6. Scaffold `client/` with Vite + React + TypeScript
7. Install TanStack Query in `client/`
8. Scaffold `server/` as empty FastAPI project structure
9. Create `.env.example` for client and server
10. Create `docs/logs/project-log.md`
11. Set up `.github/agents/` and `.github/skills/`
12. Add Husky pre-commit hook for frontend TS/TSX

## Phase 1: Foundations (completed)

1. Add FastAPI Pydantic models for claims
2. Seed in-memory claim data
3. Implement GET /claims with filtering
4. Add validation + explicit error path (422)
5. Implement SSE /claims/stream endpoint
6. Configure CORS
7. Mirror TypeScript types in frontend

## Phase 2: Frontend Core (completed)

1. ClaimsTable component
2. ClaimRow component
3. FilterBar with status/priority/search
4. LoadingState, ErrorState, EmptyState
5. TanStack Query integration
6. SSE hook for real-time updates
7. Responsive layout basics
8. Accessibility: keyboard nav, focus states, ARIA

## Phase 3: Polish & Real-time (completed)

1. Error/retry flows
2. Build verification
3. Row highlighting on update
4. Improve code readability

## Phase 4: Tests (completed)

1. Backend: valid filter logic returns matching claims
2. Backend: invalid filter values rejected via Pydantic validation
3. Backend: SSE stream behavior validated at unit level
4. Backend: Unicode claimant names filter/search correctly
5. Frontend: loading/error/empty states render
6. Frontend: filter interaction updates query

## Phase 5: Documentation (45 min)

1. Update README with setup/run/test commands
2. Explain state management choices
3. Explain data contract choices
4. Explain real-time simulation choices
5. Document what was skipped + why (right-sizing)
6. Document what to build next
7. Update ADRs for any new decisions made during implementation

## Trade‑offs for Deadline

The challenge was timeboxed as 4 hours so I wanted to show my ability to make trade-offs without compromising product quality. There were stuff that I added even if it wasn't required because it was the minimum quality requirements for me (for example debouncing to improve UI/UX performance issues) but mostly I tried to commit to make the development shipment as fast as possible and cut all the "red tape" I could.

- No table virtualization (could be used to improve performance but in this case wouldn't add much)
- No comprehensive test suite (just minimal tests to show capabilities)
- No theming
- No offline support
- No CI/CD pipeline (Only local checks)
- Minimal backend tests (no TestClient; kept minimal as it's not the focus)
- Known responsive DOM duplication (table + card layouts both render); responsive optimization was out of scope because the challenge rewards delivering a strong result quickly, not full optimization passes.
