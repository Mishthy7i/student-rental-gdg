from fastapi import APIRouter
from app.models.room import Room
from app.services.firebase import db

router = APIRouter(prefix="/rooms", tags=["Rooms"])

@router.post("/")
def add_room(room: Room):
    db.collection("rooms").document(room.room_id).set(room.dict())
    return {"message": "Room added successfully"}

@router.get("/")
def get_rooms():
    rooms = db.collection("rooms").stream()
    return [room.to_dict() for room in rooms]
