from fastapi import APIRouter, HTTPException
from schemas.request_schemas import TextMatchRequest, ImageMatchRequest
from models.text_matcher import text_matcher
from models.image_matcher import image_matcher
import requests

router = APIRouter()

# In a real app, this would fetch from MongoDB
# For now, the backend will send the candidates list
@router.post("/text")
async def match_text(request: TextMatchRequest):
    try:
        query_text = f"{request.title} {request.description}"
        candidates_dict = [c.dict() for c in request.candidates]
        results = text_matcher.match(query_text, candidates_dict)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/image")
async def match_image(request: ImageMatchRequest):
    try:
        features = image_matcher.get_features(request.image_url)
        if features is None:
            raise HTTPException(status_code=400, detail="Could not process image")
        return {"features": features.tolist()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
