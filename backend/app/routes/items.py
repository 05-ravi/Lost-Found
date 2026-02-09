"""Items routes placeholder"""
from fastapi import APIRouter

router = APIRouter(prefix="/items")

@router.get('/')
async def list_items():
    return []
