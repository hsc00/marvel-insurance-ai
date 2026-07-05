"""Core validation tests for claim models."""

from datetime import datetime, timezone

import pytest
from pydantic import ValidationError

from main import filter_claims
from src.data.seed_claims import CLAIMS_DATA
from src.models.claims import (
    Claim,
    ClaimFiltersApplied,
    ClaimPriority,
    ClaimsResponse,
    ClaimStatus,
)

FIXED_DATETIME = datetime(2024, 1, 15, 10, 30, 0, tzinfo=timezone.utc)


class TestClaimValidation:
    """Critical validation tests for Claim model."""

    def test_confidence_bounds_rejected(self) -> None:
        """Confidence values outside 0-1 range should be rejected."""
        with pytest.raises(ValidationError):
            Claim(
                id='1',
                claim_id='CLM-001',
                claimant_name='Jane Doe',
                status=ClaimStatus.PENDING,
                priority=ClaimPriority.HIGH,
                updated_at=FIXED_DATETIME,
                agent_summary='Test',
                confidence=1.5,
            )

    def test_blank_string_rejected(self) -> None:
        """Blank or whitespace-only strings should be rejected."""
        with pytest.raises(ValidationError):
            Claim(
                id='1',
                claim_id='CLM-001',
                claimant_name='   ',
                status=ClaimStatus.PENDING,
                priority=ClaimPriority.HIGH,
                updated_at=FIXED_DATETIME,
                agent_summary='Test',
                confidence=0.5,
            )

    def test_valid_claim(self) -> None:
        """Valid claim should serialize correctly."""
        claim = Claim(
            id='1',
            claim_id='CLM-001',
            claimant_name='Jane Doe',
            status=ClaimStatus.PENDING,
            priority=ClaimPriority.HIGH,
            updated_at=FIXED_DATETIME,
            agent_summary='Test summary',
            confidence=0.95,
        )
        data = claim.model_dump(mode='json')
        assert data['status'] == 'pending'
        assert data['priority'] == 'high'
        assert data['confidence'] == 0.95


class TestGetClaimsEndpoint:
    """Tests for GET /claims endpoint filtering logic."""

    def test_get_claims_no_filters_returns_all(self) -> None:
        """No filters should return all claims."""
        response = ClaimsResponse(
            items=CLAIMS_DATA,
            total=len(CLAIMS_DATA),
            filters=ClaimFiltersApplied(),
        )
        assert response.total == len(CLAIMS_DATA)
        assert len(response.items) == len(CLAIMS_DATA)

    def test_filter_by_status(self) -> None:
        """Filtering by status should return only matching claims."""
        filters = ClaimFiltersApplied(status=ClaimStatus.APPROVED)
        filtered = filter_claims(CLAIMS_DATA, filters)
        assert len(filtered) == 2
        assert all(c.status == ClaimStatus.APPROVED for c in filtered)

    def test_filter_by_priority(self) -> None:
        """Filtering by priority should return only matching claims."""
        filters = ClaimFiltersApplied(priority=ClaimPriority.HIGH)
        filtered = filter_claims(CLAIMS_DATA, filters)
        assert len(filtered) == 3
        assert all(c.priority == ClaimPriority.HIGH for c in filtered)

    def test_filter_by_status_and_priority(self) -> None:
        """Filtering by both status and priority should return intersection."""
        filters = ClaimFiltersApplied(
            status=ClaimStatus.APPROVED,
            priority=ClaimPriority.HIGH,
        )
        filtered = filter_claims(CLAIMS_DATA, filters)
        assert len(filtered) == 1
        assert filtered[0].claimant_name == 'Carol Davis'

    def test_filter_by_search_claimant_name(self) -> None:
        """Search should match claimant_name field."""
        filters = ClaimFiltersApplied(search='alice')
        filtered = filter_claims(CLAIMS_DATA, filters)
        assert len(filtered) == 1
        assert filtered[0].claimant_name == 'Alice Johnson'

    def test_filter_by_search_claim_id(self) -> None:
        """Search should match claim_id field."""
        filters = ClaimFiltersApplied(search='CLM-2026-003')
        filtered = filter_claims(CLAIMS_DATA, filters)
        assert len(filtered) == 1
        assert filtered[0].claimant_name == 'Carol Davis'

    def test_filter_by_search_agent_summary(self) -> None:
        """Search should match agent_summary field."""
        filters = ClaimFiltersApplied(search='fraud')
        filtered = filter_claims(CLAIMS_DATA, filters)
        assert len(filtered) == 1
        assert filtered[0].claimant_name == 'Frank Brown'

    def test_filter_by_all_params(self) -> None:
        """All filters should combine correctly."""
        filters = ClaimFiltersApplied(
            status=ClaimStatus.PENDING,
            priority=ClaimPriority.HIGH,
            search='vehicle',
        )
        filtered = filter_claims(CLAIMS_DATA, filters)
        assert len(filtered) == 1
        assert filtered[0].claimant_name == 'Alice Johnson'

    def test_no_results_returns_empty_list(self) -> None:
        """No matching claims returns empty list with total 0."""
        filters = ClaimFiltersApplied(
            status=ClaimStatus.DENIED,
            priority=ClaimPriority.HIGH,
        )
        filtered = filter_claims(CLAIMS_DATA, filters)
        assert len(filtered) == 0
        assert filtered == []

    def test_blank_search_rejected(self) -> None:
        """Blank search string should be rejected by Pydantic validation."""
        with pytest.raises(ValidationError):
            ClaimFiltersApplied(search='   ')
