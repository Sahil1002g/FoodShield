from fastapi import APIRouter, Depends
from pymongo.database import Database

from db.session import get_db
from services.auth_service import get_current_user

router = APIRouter(prefix="/history", tags=["History"])


@router.get("/")
def get_history(db: Database = Depends(get_db), user=Depends(get_current_user)):
    scans = list(db["scan_history"].find({"user_id": user.id}).sort("created_at", -1))

    return [
        {
            "id": str(scan.get("_id")),
            "product": scan.get("product_data"),
            "created_at": scan.get("created_at"),
        }
        for scan in scans
    ]
