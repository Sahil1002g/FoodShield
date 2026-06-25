from pydantic import BaseModel, EmailStr, Field, constr
from typing import List, Optional


class SignupSchema(BaseModel):
    username: constr(strip_whitespace=True, min_length=3, max_length=100)
    email: EmailStr
    password: constr(strip_whitespace=True, min_length=6, max_length=128)
    allergens: List[str] = Field(default_factory=list)


class LoginSchema(BaseModel):
    email: constr(strip_whitespace=True, min_length=1, max_length=150)
    password: constr(strip_whitespace=True, min_length=1, max_length=128)

