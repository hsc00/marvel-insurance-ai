# 003 - Backend Framework Choice

## Context

We need to implement a small backend/data slice that:

- Serves at least one endpoint for the UI
- Supports at least one filter/query parameter
- Includes basic validation
- Has one explicit error path with appropriate status code
- Provides a response shape designed for the UI
- Is small in scope but built as a contract a teammate could inherit

## Decision

We will use Python + FastAPI for the backend implementation, managed with **Poetry** for dependency management and **Uvicorn** as the ASGI server for local development.

## Alternatives Considered

### Express.js (Node.js)

Pros:

- JavaScript/TypeScript ecosystem consistency with frontend
- Familiar to most developers
- Lightweight and flexible

Cons:

- Doesn't align with the company tech stack (explicitly mentions Python + FastAPI)
- Would require manual validation implementation
- Less structured approach to API contracts
- Misses opportunity to demonstrate Python skills relevant to the role

### Flask

Pros:

- Lightweight Python framework
- Familiar to many Python developers

Cons:

- Less modern than FastAPI
- No built-in validation or serialization
- Requires more manual setup for API features
- Less automatic documentation generation

## Consequences

### Positive

- Direct alignment with company tech stack
- Poetry for reliable dependency management and virtual environments
- Uvicorn as a fast ASGI server for development and production
- FastAPI provides automatic request validation with Pydantic
- Built-in OpenAPI documentation generation
- Modern async capabilities if needed
- Strong typing with Python type hints
- Demonstrates ability to work in Python ecosystem
- Clean separation between frontend and backend contracts
- Professional-grade API contract with minimal code

### Negative

- Requires Python environment setup
- Two language ecosystems to manage (Python for backend, JavaScript/TypeScript for frontend)
- Slight increase in complexity for reviewers to run the project
