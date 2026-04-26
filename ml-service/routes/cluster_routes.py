from fastapi import APIRouter, HTTPException
from schemas.request_schemas import ClusterRequest
from sklearn.cluster import DBSCAN
import numpy as np

router = APIRouter()

@router.post("/")
async def cluster_locations(request: ClusterRequest):
    try:
        if not request.locations:
            return {"clusters": []}
            
        coords = np.array([[loc['lat'], loc['lng']] for loc in request.locations])
        
        # DBSCAN clustering (eps=0.001 is about 100 meters)
        db = DBSCAN(eps=0.001, min_samples=2).fit(coords)
        labels = db.labels_
        
        clusters = []
        for i in range(max(labels) + 1):
            cluster_points = coords[labels == i]
            clusters.append({
                "center": {
                    "lat": float(np.mean(cluster_points[:, 0])),
                    "lng": float(np.mean(cluster_points[:, 1]))
                },
                "count": len(cluster_points)
            })
            
        return {"clusters": clusters, "noise_count": int(np.sum(labels == -1))}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
