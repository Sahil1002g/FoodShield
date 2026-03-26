from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.session import get_db
from services.auth_service import get_current_user
from models.scan_history import ScanHistory

router = APIRouter(prefix="/history", tags=["History"])

@router.get("/")
def get_history(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    scans = db.query(ScanHistory).filter(
        ScanHistory.user_id == user.id
    ).order_by(ScanHistory.created_at.desc()).all()

    return [
        {
            "id": scan.id,
            "product": scan.product_data,
            "created_at": scan.created_at
        }
        for scan in scans
    ]
