from pydantic import BaseModel
from typing import Optional, List

class CandidateReport(BaseModel):
    id: str
    title: str
    description: str
    reportedBy: str

class TextMatchRequest(BaseModel):
    title: str
    description: str
    type: str
    id: str
    candidates: List[CandidateReport]

class ImageMatchRequest(BaseModel):
    image_url: str
    type: str

class CategoryClassifyRequest(BaseModel):
    description: str

class OCRExtractRequest(BaseModel):
    image_url: str

class ClusterRequest(BaseModel):
    locations: List[dict]
