---
name: pydantic
description: Pydantic patterns for the MarvelX Claims Review take-home: request/response models, validation, field constraints, and error payloads. Use when shaping API contracts or validating backend data.
---

# Pydantic

Practical Pydantic guidance for take-home backend models.

## When to Use

- Defining request/response schemas
- Validating query parameters
- Keeping API contracts typed and UI-friendly
- Reusing field constraints across endpoints

## Base Model Pattern

```python
from pydantic import BaseModel, Field
from datetime import datetime

class Claim(BaseModel):
    id: str = Field(..., description="Unique event id")
    claim_id: str = Field(..., description="Claim identifier")
    claimant_name: str
    status: str
    priority: str
    updated_at: datetime
    agent_summary: str
    confidence: float = Field(ge=0, le=1)
```

## Envelope Response

```python
class ClaimsResponse(BaseModel):
    items: list[Claim]
    total: int
    filters: dict
```

## Validation Rules

- Prefer `Field(...)` for required fields.
- Use `ge` / `le` for numeric bounds.
- Use enums for fixed status/priority values when scope is known.
- Keep model names aligned with route boundaries.

## Error Payloads

- Prefer minimal coherent shapes.
- Do not expose stack traces.
- Keep backend error behavior documented in `docs/adr/`.