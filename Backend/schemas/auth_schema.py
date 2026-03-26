from pydantic import BaseModel, EmailStr
from typing import List, Optional


class SignupSchema(BaseModel):
    username: str
    email: EmailStr
    password: str
    allergens: List[str] = []


class LoginSchema(BaseModel):
    email: str
    password: str

