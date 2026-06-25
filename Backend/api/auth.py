from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pymongo.database import Database

from core.security import ALGORITHM, SECRET_KEY, create_access_token, hash_password, verify_password
from db.session import get_db
from models.user import User
from schemas.auth_schema import LoginSchema, SignupSchema

router = APIRouter(prefix="/auth", tags=["Authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


@router.post("/signup")
def signup(data: SignupSchema, db: Database = Depends(get_db)):
    email = str(data.email).lower()

    existing_user = db["users"].find_one({"$or": [{"email": email}, {"username": data.username}]})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    result = db["users"].insert_one({
        "username": data.username,
        "email": email,
        "password": hash_password(data.password),
        "allergens": data.allergens or [],
    })

    return {
        "message": "User created successfully",
        "user_id": str(result.inserted_id),
    }


@router.post("/login")
def login(data: LoginSchema, db: Database = Depends(get_db)):
    login_id = data.email.strip()
    login_email = login_id.lower()

    user_doc = db["users"].find_one({"$or": [{"email": login_email}, {"email": login_id}, {"username": login_id}]})
    if not user_doc:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    user = User.from_doc(user_doc)
    if not verify_password(data.password, user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token({"user_id": str(user.id)})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "username": user.username,
    }


@router.get("/me")
def get_current_user(token: str = Depends(oauth2_scheme), db: Database = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_doc = db["users"].find_one({"_id": ObjectId(user_id)})
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")

    user = User.from_doc(user_doc)
    allergens = user.allergens or []
    if isinstance(allergens, str):
        allergens = [item.strip() for item in allergens.split(",") if item.strip()]

    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "allergens": allergens,
    }

