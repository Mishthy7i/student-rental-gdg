from fastapi import FastAPI
from app.services.firebase import db
from app.routes.onboard import router as onboard_router
from app.routes.rooms import router as rooms_router
from app.routes.recommend import router as recommend_router
from app.routes.swipe import router as swipe_router
app = FastAPI()

@app.get("/")
def root():
    return {"message": "Student Rental Backend Running"}

@app.get("/test-db")
def test_db():
    doc_ref = db.collection("test").document("hello")
    doc_ref.set({"msg": "Firestore connected"})
    return {"status": "success"}

app.include_router(onboard_router)
app.include_router(rooms_router)
app.include_router(recommend_router)
app.include_router(swipe_router)