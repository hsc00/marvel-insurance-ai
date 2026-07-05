# SSE and Real-time Updates

Implemented `server/main.py` with SSE `/claims/stream` using `StreamingResponse` and an async generator. `initial_batch` hydrates the table with a full `ClaimsResponse`. Subsequent `claim_update` events replace matching claims by id. Heartbeat `: heartbeat` comment every 3s prevents proxy/idle drops. `DEFAULT_RETRY_INTERVAL = 3000` controls SSE reconnect backoff. Error events include `retry:` headers to instruct clients to back off after transport failures.

Frontend `useClaimsSSE(filters)` opens an `EventSource` to `/claims/stream`, parses `initial_batch`, `claim_update`, and `error` events, and closes automatically on unmount or when filters change.

CORS is configured via `server/src/config.py` for `localhost:5173` by default. `server/main.py` imports CORS env from `config.py`, which owns `.env` loading.
