---
name: frontend-engineer
description: Frontend development guidelines for Vite + React + TypeScript. TanStack Query, Tailwind CSS, real-time SSE, and performance optimization. Use when creating components, pages, features, fetching data, styling, or working with frontend code.
license: MIT
---

# Frontend Engineer

Comprehensive guide for Vite + React development, emphasizing TanStack Query, real-time SSE, and responsive design.

## When to Use

- Creating new components or pages
- Building new features
- Fetching data with TanStack Query
- Real-time SSE integration
- Styling components with Tailwind
- Performance optimization
- Organizing frontend code
- TypeScript best practices

## Validation Commands

```bash
npm run typecheck  # TypeScript validation
npm run lint       # ESLint check
npm run test       # Vitest unit tests
npm run build      # Production build
```

## Core Principles

1. **Lazy Load Heavy Components**: Tables, charts, modals
2. **TanStack Query for Data**: useQuery, useSuspenseQuery preferred
3. **SSE for Real-time**: Use native EventSource or custom hooks
4. **Tailwind First**: Prefer utility classes over custom CSS
5. **TypeScript Strict**: Avoid `any`, use explicit types
6. **Accessibility Built-in**: Keyboard nav, ARIA, focus states

## Loading/Error/Empty States

- Use TanStack Query's built-in status flags
- Render skeletons for loading
- Show clear error messages with recovery
- Design meaningful empty states

## Real-time Patterns

```tsx
function useClaimStream() {
  const [events, setEvents] = useState<Claim[]>([]);
  useEffect(() => {
    const source = new EventSource('/api/claims/stream');
    source.onmessage = (e) => setEvents(prev => [...prev, JSON.parse(e.data)]);
    return () => source.close();
  }, []);
  return events;
}
```

## File Organization

```
client/src/
  components/     # Reusable UI components
  features/       # Feature modules (claims/, etc.)
  hooks/          # Custom React hooks
  types/          # TypeScript interfaces
  lib/          # Utility functions
```