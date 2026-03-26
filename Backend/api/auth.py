from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.session import get_db
from models.user import User
from schemas.auth_schema import SignupSchema, LoginSchema
from core.security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])


# 🟢 SIGNUP
@router.post("/signup")
def signup(data: SignupSchema, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(
        (User.email == data.email) | (User.username == data.username)
    ).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    # Convert allergen list to comma separated string
    allergens_string = ",".join(data.allergens) if data.allergens else ""

    new_user = User(
        username=data.username,
        email=data.email,
        password=hash_password(data.password),
        allergens=data.allergens
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User created successfully",
        "user_id": new_user.id
    }




# 🔵 LOGIN
@router.post("/login")
def login(data: LoginSchema, db: Session = Depends(get_db)):

    user = db.query(User).filter(
        (User.email == data.email) | (User.username == data.email)
    ).first()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not verify_password(data.password, user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token({"user_id": user.id})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "username": user.username
    }


from fastapi import Depends
from jose import jwt
from core.security import SECRET_KEY, ALGORITHM
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

@router.get("/me")
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "allergens": user.allergens
    }

