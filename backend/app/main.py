from fastapi import FastAPI
from app.services.firebase import db

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Student Rental Backend Running"}

@app.get("/test-db")
def test_db():
    doc_ref = db.collection("test").document("hello")
    doc_ref.set({"msg": "Firestore connected"})
    return {"status": "success"}
