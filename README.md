# Marvel Claims Review UI

Real-time claims review UI project.

## Repository Structure

- `client/` — Vite + React + TypeScript frontend
- `server/` — FastAPI + Pydantic Python backend
- `docs/` — VitePress documentation site
- `.github/agents/` and `.github/skills/` — Kilo orchestration configuration

## Documentation

Detailed decisions, state management rationale, data contract notes, real-time notes, skipped features, and future roadmap live in `docs/app-overview.md`. Architecture decisions are recorded in `docs/adr/`.

```bash
cd docs
npm install
npm run dev
```

## Quick Start

### Prerequisites

- Node.js >= 18
- Python >= 3.10
- Poetry

### Frontend

```bash
cd client
npm install
npm run dev
```

Frontend API calls are proxied to the backend via Vite dev server (`client/vite.config.ts`). No env file is required for local development.

### Backend

```bash
cd server
poetry install
cp .env.example .env   # optional; CORS values are centralized in repo root .env
poetry run uvicorn main:app --reload --port 8000
```

### Docs

```bash
cd docs
npm install
npm run dev
```

## Quality Guardrails

- Frontend checks: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`
- Backend checks: `poetry run ruff check .`, `poetry run ruff format .`, `poetry run pytest` in `server/`
- Code Reviews: SonarQube and CodeRabbit only as local extensions to keep development more agile during commits.

See `docs/adr/010-pr-guardrails.md` for the rationale.
