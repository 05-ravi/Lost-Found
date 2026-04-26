from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.item import Item
from app.schemas.item import ItemCreate, ItemResponse

router = APIRouter(prefix="/items", tags=["Items"])

@router.post("/", response_model=ItemResponse)
def create_item(
    item: ItemCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    new_item = Item(
        title=item.title,
        description=item.description,
        location=item.location,
        owner_id=current_user.id
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.get("/me", response_model=list[ItemResponse])
def my_items(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return db.query(Item).filter(Item.owner_id == current_user.id).all()
