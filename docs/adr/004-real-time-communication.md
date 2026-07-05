# 004 - Real-time Communication Approach

## Context

The assignment requires "at least one streaming or real-time element" with options including:

- Simulated SSE
- Polling
- Timers
- Local event stream

The scenario describes reviewers needing to "watch claim-processing activity as it changes" with "streaming or frequently changing AI-agent output."

Key requirements:

- Show real-time updates in the UI
- Handle connection states (connecting, connected, disconnected)
- Update UI efficiently without full page refreshes
- Work with our chosen backend (FastAPI)

## Decision

We will use Server-Sent Events (SSE) for real-time communication.

## Alternatives Considered

### WebSocket

Pros:

- Bidirectional communication
- Lower latency
- Industry standard for real-time applications

Cons:

- More complex to implement and manage
- Overkill for one-way streaming (server to client only)
- Requires more complex connection management
- More code for both client and server
- Not necessary for this use case (claim updates flowing from server to client)

### Polling

Pros:

- Simple to implement
- Works with any HTTP backend
- Familiar pattern

Cons:

- Inefficient (constant requests even when no updates)
- Higher latency (updates only as frequent as polling interval)
- More complex to implement cancellation and proper error handling
- Creates unnecessary load on server

### Long Polling

Pros:

- More efficient than regular polling
- Works with HTTP/1.1

Cons:

- Complex to implement correctly
- Resource-intensive on server (holding connections open)
- More complex error handling and reconnection logic
- Overkill for this use case

### Client-side timers for simulated updates

Pros:

- Very simple to implement
- No backend changes required

Cons:

- Not truly real-time
- Doesn't demonstrate actual backend integration
- Misrepresents the real-time requirement
- Would not work with actual claim processing data

## Consequences

### Positive

- Perfect fit for one-way server-to-client streaming
- Built-in browser support (EventSource API)
- Efficient (single connection, server-initiated updates)
- Simpler than WebSockets for this use case
- Works well with FastAPI
- Easy to simulate for development/testing
- Standard HTTP protocol (easier to debug/proxy)
- Natural fit for claim activity updates (server knows when new data arrives)

### Negative

- HTTP/1.1 connection limits (typically 6 per domain)
- Less bidirectional than WebSockets (but not needed here)
- Potential issues with proxy/firewall handling (but minimal for localhost)
- Requires careful connection management for reconnection
- HTTP/2 or HTTP/3 could mitigate connection limits and add multiplexing, but are outside this take-home's scope and would require server/proxy config changes instead of the current lightweight SSE path.

## Implementation Plan

1. Create SSE endpoint in FastAPI (/claims/stream)
2. Implement client-side EventSource connection
3. Handle connection states in UI (connecting, connected, disconnected, error)
4. Update UI components with real-time claim data
5. Implement proper cleanup on component unmount

## Follow-Up Notes

- Frontend merges SSE updates with TanStack Query rather than replacing the cache; this preserves manual pagination/filter caching while reflecting live mutations.
- Backend sends `retry:` millisecond headers so clients can back off after transport errors instead of hammering the endpoint.
- Backend emits a periodic heartbeat comment (`: heartbeat`) every 3 seconds to prevent proxy/idle connection drops.
- Initial SSE batch (`initial_batch`) replaces the TanStack Query cache with the full claims payload; subsequent `claim_update` events replace the matching claim by id.
- Client-side retry is minimal: on error, the status indicator supports manual retry. Automatic EventSource reconnects remain bounded by `asyncio` task lifecycle in the hook.
