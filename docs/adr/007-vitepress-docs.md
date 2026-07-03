# 007 - Documentation UI with VitePress

## Context

The assignment requires documentation including:

- README with setup/run/test commands
- Explanations of state management, data-contract choices, real-time simulation choices
- Timebox trade-offs (what was skipped)
- Next steps section

## Decision

We will use VitePress to create a documentation site for ADRs, logs, and project documentation.

## Alternatives Considered

### Plain Markdown files in `/docs` folder

Pros:

- No additional setup
- Direct in repository
- No build step

Cons:

- Harder to navigate
- Less professional presentation
- Harder to organize large amounts of documentation

### Separate GitHub Wiki

Pros:

- External to code repository
- Familiar to developers

Cons:

- Separates docs from code
- Harder to keep in sync
- Less controllable in terms of presentation

## Consequences

### Positive

- Clean, navigable documentation site
- Demonstrates care for documentation quality
- Same Vite ecosystem (no new tooling)
- ADRs and logs easy to read and reference
- Professional presentation for review

### Negative

- Additional setup time (~5 minutes)
- Slight increase in project complexity
- Another thing to keep running during development

## Mitigation

- Use default VitePress theme (no customization)
- Keep docs content concise
- Auto-build and serve as part of dev scripts
- Do not spend time on custom styling
