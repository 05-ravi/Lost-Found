from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# --------------------------
# Create Claim (request)
# --------------------------
class ClaimCreate(BaseModel):
    item_id: int

# --------------------------
# Claim Response (output)
# --------------------------
class ClaimResponse(BaseModel):
    id: int
    item_id: int
    claimant_id: int
    status: str

    class Config:
        from_attributes = True
