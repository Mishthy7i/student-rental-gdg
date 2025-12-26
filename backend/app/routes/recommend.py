from fastapi import APIRouter
from app.services.firebase import db
from app.services.recommendation import score_room

router = APIRouter(prefix="/rooms", tags=["Recommendations"])


@router.get("/recommend/{user_id}")
def recommend_rooms(user_id: str):
    # 1️⃣ Fetch user
    user_doc = db.collection("users").document(user_id).get()
    if not user_doc.exists:
        return {"error": "User not found"}

    user = user_doc.to_dict()

    # 2️⃣ Fetch user swipes (disliked rooms)
    swipe_docs = db.collection("swipes").where("user_id", "==", user_id).stream()

    disliked_rooms = set()
    for swipe in swipe_docs:
        swipe_data = swipe.to_dict()
        if swipe_data.get("action") == "dislike":
            disliked_rooms.add(swipe_data.get("room_id"))

    # 3️⃣ Fetch rooms & score them
    rooms = db.collection("rooms").stream()
    scored_rooms = []

    for room in rooms:
        room_data = room.to_dict()

        # Skip disliked rooms
        if room_data.get("room_id") in disliked_rooms:
            continue

        score = score_room(room_data, user)
        room_data["score"] = score
        scored_rooms.append(room_data)

    # 4️⃣ Sort by score (best first)
    scored_rooms.sort(key=lambda x: x["score"], reverse=True)

    return scored_rooms
