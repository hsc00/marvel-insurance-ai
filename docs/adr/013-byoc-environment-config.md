# 013 - BYOC-Ready Configuration

## Context

The role mentions BYOC as a bonus. This challenge should show environment-awareness without over-building infrastructure.

## Decision

- Use environment variables for API URLs (`VITE_API_BASE_URL`).
- No hard-coded production URLs.
- CORS configurable via environment.
- In-memory seed data (no external DB).
- No offline sync, no enterprise identity provider integration.
- Configuration documented in `.env.example` files.
- Frontend uses `VITE_API_BASE_URL`
- Backend uses `API_BASE_URL`

## Consequences

- Customer-hosted deployment path is clear.
- No unnecessary complexity for the challenge scope.
