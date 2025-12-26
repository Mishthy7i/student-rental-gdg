from pydantic import BaseModel

class Swipe(BaseModel):
    user_id: str
    room_id: str
    action: str  # "like" or "dislike"
