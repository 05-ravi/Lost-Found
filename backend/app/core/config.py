"""Configuration placeholders"""
from pydantic import BaseSettings


class Settings(BaseSettings):
    app_name: str = "lost-and-found-backend"
    database_url: str = "sqlite:///./test.db"


settings = Settings()
