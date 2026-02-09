from fastapi import FastAPI
from app.routes import auth
from app.core.database import Base, engine
from app.models import user

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Lost & Found API")

app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "Lost & Found API is running"}
