# Scaffold, Docs, and Timebox Decisions

## Repository Setup

- `git init` and root `.gitignore`
- `README.md` and `AGENTS.md`
- VitePress docs site in `docs/`
- Vite + React + TypeScript scaffold in `client/`
- TanStack Query installed in `client/`
- Empty FastAPI project structure scaffolded in `server/`
- Root `.env.example` added for CORS configuration
- `.github/agents/` and `.github/skills/` configured
- Husky pre-commit hook added for frontend TS/TSX
- ADRs and project log created in `docs/`

## Deviation Notes

- Backend pre-commit enforcement initially deferred, then added as a quick win once the initial frontend execution path was stable; documented with rationale in `docs/adr/010-pr-guardrails.md`.
- VitePress kept despite 4-hour timebox because setup took ~5 minutes and makes documentation easier to read and more professional.
