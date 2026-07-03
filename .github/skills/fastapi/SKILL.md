---
name: fastapi
description: FastAPI patterns for the MarvelX Claims Review take-home: routing, SSE streaming, CORS, error handling, dependency injection, and test setup. Use when implementing backend endpoints or API structure.
---

# FastAPI

Practical FastAPI guidance for the claims review take-home.

## When to Use

- Creating FastAPI routes
- Adding SSE streaming endpoints
- Configuring CORS
- Raising HTTP exceptions with coherent shapes
- Setting up the app for local development and tests

## App Setup

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="MarvelX Claims Review API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Routes

- Keep routes small and focused.
- Use `Query(...)` for validation.
- Return coherent response shapes.
- Raise `HTTPException(status_code=422, detail=...)` for bad input.

## SSE

```python
from fastapi.responses import StreamingResponse
import asyncio

@app.get("/claims/stream")
async def stream():
    async def event_generator():
        while True:
            yield f"data: {{}}\n\n"
            await asyncio.sleep(1)
    return StreamingResponse(event_generator(), media_type="text/event-stream")
```

## Error Shape

```json
{
  "detail": "string",
  "status_code": 422,
  "errors": []
}
```

## Tests

- Use `TestClient` from `fastapi.testclient`.
- Assert status codes and response JSON shape.
- Keep tests close to the route file.