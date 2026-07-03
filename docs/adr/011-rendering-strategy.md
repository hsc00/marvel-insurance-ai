# 011 - Rendering Strategy

## Context

Choosing between SPA, SSR, and SSG for the claims review interface.

## Decision

- **Product app:** Vite SPA (React, no SSR)
- **Documentation:** VitePress SSG
- **SSE:** Client-side real-time updates

## Consequences

- Fast startup development without SSR complexity.
- Clear separation between interactive dashboard and static docs.
- Real-time updates handled in browser after initial load.
