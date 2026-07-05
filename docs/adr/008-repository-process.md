# 008 - Repository Process and Development Workflow

## Context

This project is a challenge, but should be inheritable by teammates. We need explicit process rules for agents and developers.

## Decision

- Docs and ADR Engineer agent updates the relevant log file under `docs/logs/` immediately after agents complete work.
- Agents do not expand beyond their delegated scope.
- ADRs are created/updated in `docs/adr/`.
- PRs require tier-1 checks (typecheck, lint, tests, build) and tier-2 extensions ( CodeRabbit and SonarQube).

## Alternatives Rejected

- No documentation (too risky for handoff).
- Comprehensive enterprise guardrails (too slow for startup).
