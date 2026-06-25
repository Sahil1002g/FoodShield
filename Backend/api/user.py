from bson import ObjectId
from fastapi import APIRouter, Depends
from pymongo.database import Database

from db.session import get_db
from models.user import User
from schemas.user_schema import AllergenUpdate
from services.auth_service import get_current_user

router = APIRouter(prefix="/user", tags=["User"])


@router.put("/allergens")
def update_allergens(
    data: AllergenUpdate,
    db: Database = Depends(get_db),
    user: User = Depends(get_current_user),
):
    cleaned = []
    seen = set()
    for allergen in data.allergens:
        value = allergen.strip()
        key = value.casefold()
        if value and key not in seen:
            cleaned.append(value)
            seen.add(key)

    db["users"].update_one({"_id": ObjectId(user.id)}, {"$set": {"allergens": cleaned}})
    user.allergens = cleaned

    return {
        "message": "Allergens updated successfully",
        "allergens": user.allergens,
    }


@router.get("/allergens")
def get_allergens(user: User = Depends(get_current_user)):
    allergens = user.allergens or []
    if isinstance(allergens, str):
        allergens = [item.strip() for item in allergens.split(",") if item.strip()]

    return {"allergens": allergens}
