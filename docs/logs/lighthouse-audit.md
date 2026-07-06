# Lighthouse Audit Results

## Accessibility and Performance

### Lighthouse

- First Contentful Paint: 0.3 s
- Largest Contentful Paint: 0.4 s
- Total Blocking Time: 20 ms
- Cumulative Layout Shift: 0
- Speed Index: 0.5 s
- Score: 100%

### Decision

Mobile score wasnt perfect (96% performance) but is accepted as-is. Further increases would be out of scope for this timeboxed take-home.

### Changes made

- Upgraded secondary text and placeholder colors from `gray-500` to `gray-400` to meet WCAG 2.1 AA contrast ratios on dark backgrounds.
- Removed unused static assets from `client/src/assets/`.
- Fixed Vite config TypeScript typing.
