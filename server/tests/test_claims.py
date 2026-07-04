"""Core validation tests for claim models."""

from datetime import datetime, timezone

import pytest
from pydantic import ValidationError

from server.src.models.claims import Claim, ClaimStatus, ClaimPriority


FIXED_DATETIME = datetime(2024, 1, 15, 10, 30, 0, tzinfo=timezone.utc)


class TestClaimValidation:
    """Critical validation tests for Claim model."""

    def test_confidence_bounds_rejected(self) -> None:
        """Confidence values outside 0-1 range should be rejected."""
        with pytest.raises(ValidationError):
            Claim(
                id="1",
                claim_id="CLM-001",
                claimant_name="Jane Doe",
                status=ClaimStatus.PENDING,
                priority=ClaimPriority.HIGH,
                updated_at=FIXED_DATETIME,
                agent_summary="Test",
                confidence=1.5,
            )

    def test_blank_string_rejected(self) -> None:
        """Blank or whitespace-only strings should be rejected."""
        with pytest.raises(ValidationError):
            Claim(
                id="1",
                claim_id="CLM-001",
                claimant_name="   ",
                status=ClaimStatus.PENDING,
                priority=ClaimPriority.HIGH,
                updated_at=FIXED_DATETIME,
                agent_summary="Test",
                confidence=0.5,
            )

    def test_valid_claim(self) -> None:
        """Valid claim should serialize correctly."""
        claim = Claim(
            id="1",
            claim_id="CLM-001",
            claimant_name="Jane Doe",
            status=ClaimStatus.PENDING,
            priority=ClaimPriority.HIGH,
            updated_at=FIXED_DATETIME,
            agent_summary="Test summary",
            confidence=0.95,
        )
        data = claim.model_dump(mode="json")
        assert data["status"] == "pending"
        assert data["priority"] == "high"
        assert data["confidence"] == 0.95