from fastapi import APIRouter
from app.models.swipe import Swipe
from app.services.firebase import db

router = APIRouter(prefix="/swipe", tags=["Swipe"])

@router.post("/")
def swipe_room(data: Swipe):
    db.collection("swipes").add(data.dict())
    return {"message": "Swipe recorded"}
