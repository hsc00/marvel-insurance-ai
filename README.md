# Marvel Claims Review UI

Real-time claims review UI project.

## Repository Process

- Architecture decisions live in `docs/adr`.
- Project logs live in `docs/logs` and are updated immediately after meaningful work.
- Frontend app lives in `client`.
- Backend API lives in `server`.
- Documentation site is powered by VitePress from `docs`.

## Documentation

```bash
cd docs
npm install
npm run dev
```

## Current Stack

- Frontend: Vite, React, TypeScript, TanStack Query, Tailwind CSS.
- Backend: Python, FastAPI, Pydantic.
- Real-time: Server-Sent Events.
- Docs: VitePress static site generation.
- Quality: fast pre commit checks plus PR CI guardrails.

## Quality Guardrails

- Frontend pre-commit: Husky + lint-staged runs `lint` and `typecheck` on staged `*.{ts,tsx}` files.
- Frontend checks: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`
- Backend checks: `pytest` in `server/`
- PR checks: frontend blocking checks; backend enforcement is intentionally limited as a frontend-focused trade-off.
- Advisory: SonarCloud only as local extension to keep development fast, CodeRabbit review during PRs.

See `docs/adr/010-pr-guardrails.md` for the rationale.
