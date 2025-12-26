from fastapi import APIRouter
from app.models.user import UserOnboard
from app.services.firebase import db

router = APIRouter(prefix="/onboard", tags=["Onboarding"])

@router.post("/")
def onboard_user(data: UserOnboard):
    db.collection("users").document(data.user_id).set(data.dict())
    return {"message": "User onboarded successfully"}
