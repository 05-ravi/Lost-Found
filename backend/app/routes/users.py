"""Users routes placeholder"""
from fastapi import APIRouter

router = APIRouter(prefix="/users")

@router.get('/')
async def list_users():
    return []
