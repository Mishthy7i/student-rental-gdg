from pydantic import BaseModel
from typing import List

class UserOnboard(BaseModel):
    user_id: str
    budget: int
    max_distance_km: float
    priorities: List[str]  # e.g. ["budget", "distance", "furnished"]
