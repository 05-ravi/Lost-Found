"""Claims routes placeholder"""
from fastapi import APIRouter

router = APIRouter(prefix="/claims")

@router.get('/')
async def list_claims():
    return []
