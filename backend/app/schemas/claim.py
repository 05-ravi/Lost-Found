"""Pydantic schemas for Claim"""
from pydantic import BaseModel
from datetime import datetime


class ClaimBase(BaseModel):
    item_id: int


class ClaimCreate(ClaimBase):
    pass


class ClaimOut(ClaimBase):
    id: int
    claimer_id: int
    created_at: datetime

    class Config:
        orm_mode = True
