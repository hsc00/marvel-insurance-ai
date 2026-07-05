from __future__ import annotations

from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field, field_validator


class ClaimStatus(str, Enum):
    PENDING = 'pending'
    IN_REVIEW = 'in_review'
    APPROVED = 'approved'
    DENIED = 'denied'


class ClaimPriority(str, Enum):
    LOW = 'low'
    MEDIUM = 'medium'
    HIGH = 'high'


class ClaimSortField(str, Enum):
    UPDATED_AT = 'updated_at'
    CONFIDENCE = 'confidence'
    CLAIMANT_NAME = 'claimant_name'
    STATUS = 'status'


class Claim(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    id: str = Field(..., min_length=1, max_length=100)
    claim_id: str = Field(..., min_length=1, max_length=50)
    claimant_name: str = Field(..., min_length=1, max_length=200)
    status: ClaimStatus
    priority: ClaimPriority
    updated_at: datetime
    agent_summary: str = Field(..., min_length=1, max_length=500)
    confidence: float = Field(..., ge=0, le=1)

    @field_validator('id', 'claim_id', 'claimant_name', 'agent_summary')
    @classmethod
    def reject_blank_strings(cls, value: str) -> str:
        if not value.strip():
            raise ValueError('must not be blank')
        return value


class ClaimFiltersApplied(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    status: ClaimStatus | None = None
    priority: ClaimPriority | None = None
    search: str | None = Field(default=None, min_length=1)
    sort: ClaimSortField | None = None

    @field_validator('search')
    @classmethod
    def normalize_search(cls, value: str | None) -> str | None:
        if value is None:
            return None
        normalized = value.strip()
        if not normalized:
            raise ValueError('search must not be blank')
        return normalized


class ClaimsResponse(BaseModel):
    items: list[Claim]
    total: int = Field(..., ge=0)
    filters: ClaimFiltersApplied


class ErrorResponse(BaseModel):
    detail: str
    status_code: int = Field(..., ge=400, le=599)
    errors: list[str] = Field(default_factory=list)


__all__ = [
    'Claim',
    'ClaimFiltersApplied',
    'ClaimPriority',
    'ClaimSortField',
    'ClaimsResponse',
    'ClaimStatus',
    'ErrorResponse',
]
