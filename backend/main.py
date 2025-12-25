from fastapi import FastAPI

app = FastAPI(title="Student Rental API")

@app.get("/")
def root():
    return {"message": "API running"}
