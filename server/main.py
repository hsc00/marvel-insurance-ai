"""MarvelX Claims Review API server."""

import asyncio
import os
import random
import json
from datetime import datetime, timezone
from typing import Annotated

from dotenv import load_dotenv
from fastapi import FastAPI, Query, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse

from src.data.seed_claims import CLAIMS_DATA
from src.models.claims import (
    Claim,
    ClaimFiltersApplied,
    ClaimPriority,
    ClaimsResponse,
    ClaimStatus,
    ErrorResponse,
)

# Load environment variables from .env file
load_dotenv()

# CORS configuration
CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:5173').split(',')
CORS_METHODS = os.getenv('CORS_METHODS', '*').split(',')
CORS_HEADERS = os.getenv('CORS_HEADERS', '*').split(',')

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=CORS_METHODS,
    allow_headers=CORS_HEADERS,
)

# Agent summaries for claim updates
AGENT_SUMMARIES = [
    'Under review by senior agent',
    'Additional documentation requested',
    'Quality check in progress',
    'Processing payment authorization',
    'Claim forwarded to specialist',
]

DEFAULT_RETRY_INTERVAL = 3000


def update_claim(claim: Claim) -> Claim | None:
    """Randomly update a claim's confidence, status, or agent summary."""
    update_type = random.choice(['confidence', 'status', 'agent_summary'])

    if update_type == 'confidence':
        new_confidence = round(random.uniform(0.0, 1.0), 2)
        return claim.model_copy(update={'confidence': new_confidence})

    if update_type == 'status':
        statuses = [s for s in ClaimStatus if s != claim.status]
        if not statuses:
            return None
        new_status = random.choice(statuses)
        return claim.model_copy(update={'status': new_status})

    new_summary = random.choice(AGENT_SUMMARIES)
    return claim.model_copy(update={'agent_summary': new_summary})


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


@app.get('/claims/stream')
async def stream_claims(
    request: Request,
    status: Annotated[ClaimStatus | None, Query(description='Filter by claim status')] = None,
    priority: Annotated[ClaimPriority | None, Query(description='Filter by claim priority')] = None,
    search: Annotated[
        str | None,
        Query(
            description='Search in claimant_name, claim_id, or agent_summary',
            min_length=1,
        ),
    ] = None,
) -> StreamingResponse:
    """Stream claims with periodic updates via Server-Sent Events."""

    filters = ClaimFiltersApplied(status=status, priority=priority, search=search)
    filtered_claims = list(filter_claims(CLAIMS_DATA, filters))

    async def event_generator():
        # Send initial batch event
        try:
            initial_response = ClaimsResponse(
                items=filtered_claims,
                total=len(filtered_claims),
                filters=filters,
            )
            yield f"event: initial_batch\ndata: {json.dumps(initial_response.model_dump(mode='json'))}\n\n"
        except Exception as e:
            yield f"retry: {DEFAULT_RETRY_INTERVAL}\n"
            yield f"event: error\ndata: {json.dumps({'detail': 'Failed to serialize initial batch', 'error': str(e)})}\n\n"
            return

        # Send periodic claim updates
        while not await request.is_disconnected():
            try:
                await asyncio.sleep(5)

                # Send heartbeat comment to keep idle connections alive (proxies, load balancers)
                yield ": heartbeat\n\n"

                if not filtered_claims:
                    continue

                # Randomly select a claim to update
                claim_index = random.randint(0, len(filtered_claims) - 1)
                claim = filtered_claims[claim_index]

                # Update the claim and skip if no valid update possible
                updated_claim = update_claim(claim)
                if updated_claim is None:
                    continue

                # Update the claim in filtered_claims and mark updated_at
                filtered_claims[claim_index] = updated_claim.model_copy(
                    update={'updated_at': datetime.now(timezone.utc)}
                )

                yield f"event: claim_update\ndata: {json.dumps(filtered_claims[claim_index].model_dump(mode='json'))}\n\n"
            except Exception as e:
                yield f"retry: {DEFAULT_RETRY_INTERVAL}\n"
                yield f"event: error\ndata: {json.dumps({'detail': 'Stream processing error', 'error': str(e)})}\n\n"
                return

    return StreamingResponse(
        event_generator(),
        media_type='text/event-stream',
        headers={
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    )
