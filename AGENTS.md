# Agent Instructions

All agents must follow these rules:

## 1. Requirements Compliance

Before making changes, check `docs/adr/` for relevant decisions. Every implementation must satisfy:

- Loading/error/empty states for all data views
- WCAG 2.1 AA accessibility (keyboard nav, ARIA, focus states)
- Core Web Vitals targets (LCP<2.5s, CLS<0.1, INP<200ms)
- SSE lifecycle handling
- Validation and error responses in backend
- Environment-variable configuration for BYOC

## 2. Documentation Updates

After completing implementation work:

1. Update `docs/logs/project-log.md` immediately with factual changes
2. Create or update ADRs in `docs/adr/` if architecture changes
3. Sync changes to `.github/`
4. Update VitePress sidebar if adding new ADRs or logs

## 3. Quality Standards

- TypeScript: zero errors
- Lint: zero errors
- Tests: all passing
- Build: succeeds

## Location Rules

- `.github/agents/` and `.github/skills/`
