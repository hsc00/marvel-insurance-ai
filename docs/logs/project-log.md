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

- `confidence` field constrained to 0-1 via `ge=0, le=1`
- String fields validated non-blank via `field_validator` and `ConfigDict(str_strip_whitespace=True)`

### Design Rationale: Extensibility

- Enum values can be extended without breaking existing consumers (e.g., adding new `ClaimStatus` values like `archived`, `escalated`)
- New fields can be added to `Claim` model without requiring frontend changes
- `ConfigDict(str_strip_whitespace=True)` applied consistently across models for predictable normalization
- `__all__` export list defines intentional public API surface for clean imports
- Standard Pydantic v2 patterns only — no custom abstractions to learn when inheriting this codebase

---

## Code Quality Tooling — 2026-07-04

Added Prettier configuration (`client/.prettierrc.json`) and lint-staged integration for consistent formatting across frontend.

Added Ruff configuration (`server/pyproject.toml`) for Python linting and formatting.

Updated `package.json` lint-staged to run Prettier on all staged files before TypeScript checks.

Added `ruff==0.12.1` to `server/requirements.txt` for automated linting.

### Time Constraint Note

- CodeRabbit and SonarQube were only used as local extensions as that would make development slower and not produce significant gains for a single-developer project.
- GitHub Actions pipeline was skipped to keep timebox real - local pre-commit hooks + extensions already enforce code quality at development time.
