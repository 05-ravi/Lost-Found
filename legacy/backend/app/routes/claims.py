from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.claim import Claim
from app.models.item import Item
from app.models.user import User
from app.schemas.claim import ClaimCreate, ClaimResponse

router = APIRouter(prefix="/claims", tags=["Claims"])

# --------------------------
# POST /claims → Create claim
# --------------------------
@router.post("/", response_model=ClaimResponse)
def create_claim(
    claim: ClaimCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = db.query(Item).filter(Item.id == claim.item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    if item.owner_id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot claim your own item")

    existing_claim = (
        db.query(Claim)
        .filter(
            Claim.item_id == claim.item_id,
            Claim.claimant_id == current_user.id
        )
        .first()
    )
    if existing_claim:
        raise HTTPException(status_code=400, detail="You already claimed this item")

    new_claim = Claim(
        item_id=claim.item_id,
        claimant_id=current_user.id
    )

    db.add(new_claim)
    db.commit()
    db.refresh(new_claim)

    return new_claim


# --------------------------
# GET /claims/my → My claims
# --------------------------
@router.get("/my", response_model=list[ClaimResponse])
def get_my_claims(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    claims = (
        db.query(Claim)
        .filter(Claim.claimant_id == current_user.id)
        .all()
    )
    return claims


# --------------------------
# PATCH /claims/{id} → Approve / Reject
# --------------------------
@router.patch("/{claim_id}", response_model=ClaimResponse)
def update_claim_status(
    claim_id: int,
    status_value: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")

    item = db.query(Item).filter(Item.id == claim.item_id).first()
    if item.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only item owner can update claim status"
        )

    if status_value not in ["Approved", "Rejected"]:
        raise HTTPException(
            status_code=400,
            detail="Status must be Approved or Rejected"
        )

    claim.status = status_value
    db.commit()
    db.refresh(claim)

    return claim
