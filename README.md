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
- Quality: fast pre commit and code analysis extensions checks.

## Backend Quick Start (Poetry)

Dependencies are managed with Poetry. A `poetry.lock` is committed so the environment is reproducible.

```bash
cd server
poetry install          # installs deps into managed virtualenv
poetry run pytest       # run backend tests
```

Start the backend:

**Windows / macOS / Linux**:

```bash
cd server && poetry run uvicorn main:app --reload --port 8000
```

For optional development commands:

- Backend linting: `poetry run ruff check src && poetry run ruff format src --check`
- Backend typecheck: handled by Pydantic at runtime.

## Quality Guardrails

- Frontend pre-commit: Husky + lint-staged runs `lint` and `typecheck` on staged `*.{ts,tsx}` files.
- Frontend checks: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`
- Backend checks: `poetry run pytest` in `server/`
- Advisory: SonarQube and CodeRabbit only as local extensions to keep development more agile during commits.

See `docs/adr/010-pr-guardrails.md` for the rationale.
