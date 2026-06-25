from bson import ObjectId
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pymongo.database import Database

from core.security import ALGORITHM, SECRET_KEY
from db.session import get_db
from models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def get_current_user(token: str = Depends(oauth2_scheme), db: Database = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_doc = db["users"].find_one({"_id": ObjectId(user_id)})
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")

    return User.from_doc(user_doc)
