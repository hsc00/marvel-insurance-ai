# 006 - Testing Strategy

## Context

The assignment doesn't explicitly require tests, but the job description mentions:

- "Strong testing instincts (unit, integration, E2E)"
- The code will be evaluated for quality and maintainability

We should include appropriate testing to:

- Demonstrate testing instincts
- Ensure code quality
- Make the project maintainable
- Show understanding of different testing layers

Time constraints:

- Testing should be proportional to overall effort
- Focus on high-impact tests that demonstrate skills

## Decision

We will implement a focused testing strategy with:

- Frontend unit tests using Vitest
- Backend contract tests using pytest

Testing is intentionally narrow to preserve frontend execution time.

## Alternatives Considered

### Comprehensive test coverage

Pros:

- Thorough validation
- Demonstrates testing expertise

Cons:

- Time-intensive
- May delay core implementation
- Diminishing returns on time investment
- Not required by assignment and might be overkill

### No tests

Pros:

- Maximum time for core features
- Focus entirely on implementation

Cons:

- Against job requirements ("strong testing instincts")
- Makes code harder to maintain and refactor

### Only frontend tests

Pros:

- Focus on main assignment area
- Faster implementation

Cons:

- Doesn't demonstrate full-stack thinking
- Backend slice is part of evaluation criteria

### Only backend tests

Pros:

- Validate API contract quality
- Demonstrate backend testing skills

Cons:

- Frontend is main focus of assignment
- UI quality is major evaluation criterion

## Consequences

### Positive

- Shows appropriate test coverage for different layers
- Validates core functionality
- Improves code quality and confidence
- Aligns with requirements
- Makes future changes safer

### Negative

- Time investment could be spent on features
- Risk of spending too much time on tests instead of core implementation
- May need to prioritize which tests are most valuable
