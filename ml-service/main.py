import os
# Fix for segmentation fault on Mac M1/M2/M3 due to duplicate OpenMP libraries
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

# Crucial: Import easyocr (OpenCV) before torch on Mac to prevent segfaults
import easyocr
import torch

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import match_routes, classify_routes, ocr_routes, cluster_routes
import uvicorn
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Lost & Found ML Service",
    description="Microservice for item matching, OCR, and classification",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to backend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(match_routes.router, prefix="/ml/match", tags=["Matching"])
app.include_router(classify_routes.router, prefix="/ml/classify", tags=["Classification"])
app.include_router(ocr_routes.router, prefix="/ml/ocr", tags=["OCR"])
app.include_router(cluster_routes.router, prefix="/ml/cluster", tags=["Clustering"])

@app.get("/")
async def root():
    return {"message": "Lost & Found ML Service is operational"}

if __name__ == "__main__":
    # Fix for segmentation fault on Mac M1/M2/M3 due to duplicate OpenMP libraries
    os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
    
    port = int(os.getenv("PORT", 8001))
    # Disabling reload can help stabilize heavy ML model loading on some Mac systems
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
