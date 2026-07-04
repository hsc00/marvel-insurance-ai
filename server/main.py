"""MarvelX Claims Review API server."""

from typing import Annotated

from fastapi import FastAPI, Query, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from src.data.seed_claims import CLAIMS_DATA
from src.models.claims import (
    Claim,
    ClaimFiltersApplied,
    ClaimPriority,
    ClaimsResponse,
    ClaimStatus,
    ErrorResponse,
)

app = FastAPI()


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_request: Request, exc: RequestValidationError):
    """Normalize FastAPI validation errors into the project's ErrorResponse shape."""
    errors = [f"{'.'.join(map(str, err['loc']))}: {err['msg']}" for err in exc.errors()]
    return JSONResponse(
        status_code=422,
        content=ErrorResponse(
            detail='Validation failed',
            status_code=422,
            errors=errors,
        ).model_dump(mode='json'),
    )


@app.get('/claims')
def get_claims(
    status: Annotated[ClaimStatus | None, Query(description='Filter by claim status')] = None,
    priority: Annotated[ClaimPriority | None, Query(description='Filter by claim priority')] = None,
    search: Annotated[
        str | None,
        Query(
            description='Search in claimant_name, claim_id, or agent_summary',
            min_length=1,
        ),
    ] = None,
) -> ClaimsResponse:
    """Get claims with optional filtering by status, priority, and search terms."""
    filters = ClaimFiltersApplied(status=status, priority=priority, search=search)

    filtered_claims = list(filter_claims(CLAIMS_DATA, filters))

    return ClaimsResponse(
        items=filtered_claims,
        total=len(filtered_claims),
        filters=filters,
    )


def filter_claims(claims: list[Claim], filters: ClaimFiltersApplied) -> list[Claim]:
    """Filter claims by status, priority, and search terms."""
    result = claims

    if filters.status is not None:
        result = [claim for claim in result if claim.status == filters.status]

    if filters.priority is not None:
        result = [claim for claim in result if claim.priority == filters.priority]

    if filters.search is not None:
        search_lower = filters.search.lower()
        result = [
            claim
            for claim in result
            if search_lower in claim.claimant_name.lower()
            or search_lower in claim.claim_id.lower()
            or search_lower in claim.agent_summary.lower()
        ]

    return result
