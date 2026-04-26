from pydantic import BaseModel
from typing import Optional

class ItemCreate(BaseModel):
    title: str
    description: Optional[str] = None
    location: Optional[str] = None

class ItemResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    location: Optional[str]
    is_found: bool

    class Config:
        from_attributes = True
