from sqlalchemy import Column, Integer, String, JSON
from db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True)
    email = Column(String(150), unique=True, index=True)
    password = Column(String(255))
    allergens = Column(JSON)
