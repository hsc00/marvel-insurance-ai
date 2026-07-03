---
name: backend-engineer
description: FastAPI backend patterns for the MarvelX Claims Review take-home: Pydantic models, in-memory data, validation, SSE streaming, error shapes, pytest coverage. Use when implementing server routes or backend tests.
---

# Backend Engineer

Practical backend guidance for the claims review take-home.

## When to Use

- Implementing FastAPI endpoints
- Adding Pydantic request/response models
- Writing pytest tests for backend routes
- Adding SSE streaming behavior
- Handling validation and error responses

## FastAPI Patterns

### Route Structure
```python
from fastapi import FastAPI, Query, HTTPException
from pydantic import BaseModel

class Claim(BaseModel):
    id: str
    claim_id: str
    claimant_name: str
    status: str
    priority: str
    updated_at: str
    agent_summary: str
    confidence: float

class ClaimsResponse(BaseModel):
    items: list[Claim]
    total: int
    filters: dict
```

### Validation
- Validate query params with `Query(...)`
- Raise `HTTPException(status_code=422, detail=...)` for bad input
- Keep error shape coherent and minimal

### SSE Pattern
```python
from fastapi.responses import StreamingResponse
import asyncio

async def event_generator():
    while True:
        yield f"data: {payload}\n\n"
        await asyncio.sleep(1)
```

### Tests
- Happy path: valid filter returns 200 and expected shape
- Error path: invalid filter returns 400/422
- Stream path: endpoint yields events