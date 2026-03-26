from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.session import get_db
from models.user import User
from schemas.user_schema import AllergenUpdate

router = APIRouter(prefix="/user", tags=["User"])


# ✅ Update Allergens
@router.put("/allergens/{user_id}")
def update_allergens(
    user_id: int,
    data: AllergenUpdate,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.allergens = ",".join(data.allergens)
    db.commit()

    return {"message": "Allergens updated successfully"}


# ✅ Get Allergens
@router.get("/allergens/{user_id}")
def get_allergens(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    allergens = user.allergens.split(",") if user.allergens else []

    return {"allergens": allergens}
