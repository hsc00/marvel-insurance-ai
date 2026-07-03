# 010 - PR Guardrails and Quality Gating

## Context

We want quality guardrails without slowing startup velocity. This project is frontend-focused, so backend pre-commit/CI enforcement is intentionally limited and documented as a trade-off.

## Decision

- **Client-side pre-commit hook:** Husky + lint-staged for lint and typecheck on staged TS/TSX files.
- **Blocking checks in pipeline:** `tsc --noEmit`, `eslint`, `vitest run`, `npm run build`
- **Advisory checks:** SonarCloud quality signals, CodeRabbit review, bundle size analysis
- **Backend enforcement:** Not added in initial phases; captured as a deliberate trade-off because the take-home is frontend-focused.

## Rationale

Local pre-commit hooks catch obvious issues before commit, reducing wasted CI runs and reviewer noise. Client coverage is frontend-only, which matches the assignment focus; backend validation remains in local test scripts for now.
