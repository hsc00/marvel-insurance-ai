# 016 - React Error Boundary

## Context

Unhandled render errors kill the entire React tree in a single-page dashboard, leaving reviewers with a blank screen and no recovery path.

## Decision

Add a root-level class `ErrorBoundary` component with a `BoundaryFallback` presentational view.

## Consequences

- Unexpected render errors are isolated to a fallback UI.
- Reviewers can manually retry without losing the entire application.
- Minimal new code; no external dependency added.
