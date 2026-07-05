# 002 - State Management and Data Fetching

## Context

The application needs to handle:

- Fetching claim data from backend
- Real-time updates via SSE
- Loading, error, and empty states
- Filtering and sorting capabilities
- Caching to avoid unnecessary requests

Key requirements:

- Handle async state properly
- Show appropriate UI states during data loading
- Manage real-time data updates efficiently
- Keep component logic clean and maintainable

## Decision

We will use TanStack Query (React Query) for server state management and data fetching.

## Alternatives Considered

### Custom useState + useEffect implementation

Pros:

- No additional dependencies
- Full control over implementation
- Minimal bundle size impact

Cons:

- Significant development time required
- Easy to implement incorrectly (race conditions, caching issues)
- Complex to handle loading, error, and caching states properly
- Difficult to implement advanced features like background refetching
- More code to maintain and test

### Redux Toolkit

Pros:

- Industry standard for complex state management
- Excellent devtools
- Strong TypeScript support

Cons:

- Overkill for this scope
- Adds significant complexity and boilerplate
- Time better spent on core requirements
- Not necessary for primarily server-state driven application

### Zustand

Pros:

- Lightweight alternative to Redux
- Simple API
- Good TypeScript support

Cons:

- Still requires significant setup for data fetching patterns
- Doesn't provide built-in caching, deduplication, or background refetching
- More implementation work required for proper async state handling

## Consequences

### Positive

- Built-in caching, background refetching, and deduplication
- Standardized loading, error, and success states
- Automatic retries and polling capabilities
- Excellent TypeScript support with automatic type inference
- Devtools for debugging (in development)
- Handles complex async state patterns out of the box
- Easy to test components in isolation
- Efficient real-time updates when combined with SSE

### Negative

- Additional dependency (though lightweight)
- Slight learning curve if not familiar
- Might be overkill for very simple data fetching (but appropriate for this project)

## Layered State Strategy

The project uses a layered approach to state management:

1. **TanStack Query** for all server state: claims data, loading, errors, and caching responses.
2. **React `useState`** for local component state that does not need to be shared across the component tree.
3. **React Context** for lightweight, shared UI state that would otherwise require prop drilling across intermediate components.

This avoids introducing heavier global state libraries while keeping shared UI state accessible where needed.
