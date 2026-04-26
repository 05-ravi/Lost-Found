from fastapi import APIRouter, HTTPException
from schemas.request_schemas import CategoryClassifyRequest
from models.category_classifier import category_classifier

router = APIRouter()

@router.post("/category")
async def classify_category(request: CategoryClassifyRequest):
    try:
        category = category_classifier.predict(request.description)
        return {"category": category}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
