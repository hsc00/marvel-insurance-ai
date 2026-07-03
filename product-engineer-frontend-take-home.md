# Product Engineer (Frontend-leaning) Take-Home: Real-Time Claims Review UI

Timebox: around 4 hours.

Build a small React + TypeScript UI for reviewing claim-processing activity. The core of the assignment is frontend ownership: component structure, state, async handling, responsiveness, accessibility basics, and clear trade-offs. You also build a small backend/data slice behind it, so we can see how you treat a surface that isn't your main focus.

## How to approach this

Treat this as code a team will inherit and keep building on. We care about the foundation you set: choices another engineer could pick up next week and extend without fighting you. Clear component boundaries, honest naming, types at the seams, state that's easy to follow, and a data contract designed for the UI rather than bolted onto one happy path.

Right-sizing is the whole game. Under-build and it falls apart on contact; over-build (premature abstractions, a state library you don't need, a backend slice that's secretly a second project) and you've buried the foundation under scaffolding. We read for where you chose to invest and where you deliberately chose to stop.

This bar applies to the **entire** submission, including the backend/data slice. That slice is smaller in scope, not lower in quality: a one-file route with a coherent contract, real validation, and a sane error shape beats a sprawling mock nobody could build on. Don't let your standard drop just because a part "isn't the point."

Use your real toolchain, AI assistants included. We don't care how the code was produced; we care that you own every line. You walk us through the submission and defend your decisions in the next round, so build something you fully understand.

## Scenario

MarvelX reviewers need to watch claim-processing activity as it changes. They need a structured view, useful filtering, and clear feedback when data is loading, empty, or broken. In the real product this type of surface often sits on top of streaming or frequently changing AI-agent output.

## Required Scope

Frontend:

- React + TypeScript.
- Structured interactive display, such as a table, dashboard, or activity feed.
- Filtering or sorting in the UI.
- Loading, error, and empty states.
- At least one streaming or real-time element. Simulated SSE, polling, timers, or a local event stream are all acceptable.
- Responsive styling and basic accessibility: semantic HTML, keyboard-usable controls, readable focus states.

Backend/data slice:

- Small local API/backend route implemented by you. A framework route handler, lightweight Node server, or equivalent is fine.
- At least one endpoint that serves the UI.
- At least one filter/query parameter.
- Basic validation and one explicit error path with an appropriate status code.
- A response shape that is designed for the UI rather than hard-coded around a single happy path.
- Small in scope, but built as a contract a teammate would inherit: coherent shape, real validation, types at the boundary. A bare route is fine; a throwaway mock is not.

Documentation:

- README with setup/run/test commands.
- Explain state management, data-contract choices, real-time simulation choices, and what you skipped because of the timebox.
- One short section: what you'd build next, and what you deliberately left out and why. This is where we read your right-sizing judgment.

## Suggested Data Shape

You may choose your own shape. If useful, model claim activity with fields such as:

- id
- claim_id
- claimant_name
- status
- priority
- updated_at
- agent_summary
- confidence

Add or remove fields if your design needs it. The exact schema matters less than whether the UI and API contract are coherent.

## Submission

Send a repository link or archive with the code and README. Include enough setup instructions that we can run the UI, the local backend/data route, and any tests locally.

## What We Evaluate

- Component architecture and TypeScript quality.
- Async, loading, error, and empty-state handling.
- Real-time or simulated streaming behavior.
- CSS quality, responsiveness, and accessibility basics.
- Backend/data slice as a foundation, not a mock: coherent contract, validation, error response, types at the boundary, simple setup.
- A consistent foundation-grade bar across the whole submission, held even on the part that isn't your focus, without over-building it.
- Right-sizing judgment: investing in what's load-bearing, deferring the rest on purpose, and saying which is which.
- README clarity and honest trade-offs.
