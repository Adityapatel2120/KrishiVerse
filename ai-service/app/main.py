from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from app.predict import predict_disease
from utils.image_processing import preprocess_image

app = FastAPI(title="KrishiVerse Crop Disease Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "KrishiVerse AI service running"}


@app.post("/predict")
async def predict(file: UploadFile = File(...), crop: Optional[str] = Form(None)):
    image_bytes = await file.read()
    processed = preprocess_image(image_bytes)
    result = predict_disease(processed, crop_filter=crop)
    return result