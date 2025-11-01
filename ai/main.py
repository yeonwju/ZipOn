from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI(title="Zipon AI Service", version="0.1.0")

@app.get("/")
def root():
    return JSONResponse({"message": "AI service running!"})

@app.get("/health")
def health_check():
    return JSONResponse({"status": "ok"})