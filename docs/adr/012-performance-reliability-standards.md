# 012 - Performance, Reliability, and Core Web Vitals

## Context

The role emphasizes diagnosing and fixing performance issues. We should set targets for that in this challenge.

## Decision

- LCP: under 2.5s
- CLS: under 0.1
- INP: under 200ms
- Loading/error/empty/disconnected states required for all data views
- SSE lifecycle must handle reconnections
- Avoid layout shift with stable container heights

These are targets, not hard CI gates initially.
