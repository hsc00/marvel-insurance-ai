# 001 - Frontend Framework Choice

## Context

We need to build a React + TypeScript UI for reviewing claim-processing activity with real-time updates. The application uses Vite as the build tool and dev server. The assignment requires a structured interactive display with filtering, loading/error states, and real-time elements.

Key considerations:

- Need to demonstrate React/TypeScript skills
- Must be runnable locally with clear setup instructions
- Should showcase component architecture and state management

## Decision

We will use Vite + React + TypeScript as our frontend stack.

## Alternatives Considered

### Vite + React + TypeScript (Selected)

Pros:

- Fast development setup with minimal configuration
- Excellent developer experience with fast HMR (Hot Module Replacement)
- TypeScript support out of the box
- Lightweight and modern tooling
- Easy to run and understand for reviewers

Cons:

- Need to set up separate backend (required anyway)
- Less opinionated than full frameworks (requires more decisions)

### Next.js

Pros:

- Built-in API routes for backend slice
- File-based routing
- Strong ecosystem integration

Cons:

- More complex setup for a simple take-home project
- Can shift focus to framework features rather than core requirements
- SSR considerations not needed for this assignment
- Might lead to over-engineering the backend slice

## Consequences

### Positive

- Clear focus on React implementation rather than framework setup
- Aligns with modern React development practices

### Negative

- Need to set up separate backend (already required)
- Less opinionated than full frameworks (requires more decisions on structure)
