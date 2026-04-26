from fastapi import APIRouter, HTTPException
from schemas.request_schemas import OCRExtractRequest
from models.ocr_extractor import ocr_extractor

router = APIRouter()

@router.post("/extract")
async def extract_ocr(request: OCRExtractRequest):
    try:
        results = ocr_extractor.extract(request.image_url)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
