# 010 - PR Guardrails and Quality Gating

## Context

We want quality guardrails without slowing startup velocity. Backend enforcement was added as a quick win once the initial frontend execution path was stable, bringing client and server under the same pre-commit contract.

## Decision

- **Client-side pre-commit hook:** Husky + lint-staged for lint and typecheck on staged TS/TSX files.
- **Blocking checks in pipeline:** `tsc --noEmit`, `eslint`, `vitest run`, `npm run build`
- **Code Reviews checks:** SonarCloud quality signals, CodeRabbit review
- **Backend enforcement:** Pre-commit runs `ruff check .`, `ruff format .`, and `pytest` whenever `server/` files are staged.

## Rationale

Local pre-commit hooks catch obvious issues before commit, reducing wasted CI runs and reviewer noise. Coverage is now both client and server; backend validation was added after the initial frontend path was stable.
