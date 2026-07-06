# Marvel Claims Review UI

Real-time claims review UI project.

## Repository Structure

- `client/` — Vite + React + TypeScript frontend
- `server/` — FastAPI + Pydantic Python backend
- `docs/` — VitePress documentation site
- `.github/agents/` and `.github/skills/` — Github Copilot sub agents orchestration configuration

## Documentation (VitePress)

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
- Poetry (recommended) or Python `venv` + `pip`

### Frontend (Vite + React)

The frontend dev server proxies `/claims` to the backend. The proxy target is controlled by the `VITE_API_URL` environment variable (see `client/.env.example`).

macOS / Linux:

```bash
cd client
cp .env.example .env   # optional: edit VITE_API_URL if your backend runs elsewhere
npm install
npm run dev
# open http://localhost:5173
```

Windows (PowerShell):

```powershell
cd client
Copy-Item .env.example .env   # optional: edit VITE_API_URL if your backend runs elsewhere
npm install
npm run dev
# open http://localhost:5173
```

Use `npm run build` then `npm run preview` for a production preview.

### Backend (FastAPI)

Default backend address: http://localhost:8000

Using Poetry (cross-platform, recommended):

```bash
cd server
poetry install
cp .env.example .env   # macOS/Linux; on Windows use Copy-Item or copy
poetry run uvicorn main:app --reload --port 8000
```

Using Python `venv` + `pip` (macOS / Linux):

```bash
cd server
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload --port 8000
```

Using Python `venv` + `pip` (Windows PowerShell):

```powershell
cd server
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
py -m uvicorn main:app --reload --port 8000
```

If `uvicorn` isn't found in your PATH after `pip install`, run it with the Python module form: `python -m uvicorn main:app`.

## Quality Guardrails

- Frontend checks: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`
- Backend checks with Poetry: `poetry run ruff check .`, `poetry run ruff format .`, `poetry run pytest` in `server/`
- Backend checks with `venv`: `ruff check .`, `ruff format .`, `pytest` after activating `server/.venv`
- Code Reviews: SonarQube and CodeRabbit only as local extensions to keep development more agile during commits.

See `docs/adr/010-pr-guardrails.md` for the rationale.

## Validation

Final local validation covered:

- Frontend: lint, typecheck, unit tests, Core Web Vitals metrics and production build
- Backend: Ruff check, Ruff format check, and pytest
- Docs: VitePress build
- Browser smoke test: page load, filtering, sorting, empty state, backend validation error, SSE initial batch/update, and mobile layout
- Recovery smoke test: backend unavailable on load, retry after backend restart, warm outage with existing data visible, and SSE recovery after backend restart
