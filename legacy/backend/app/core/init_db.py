from app.core.database import Base, engine
from app.models.user import User
from app.models.item import Item

def init_db():
    Base.metadata.create_all(bind=engine)
