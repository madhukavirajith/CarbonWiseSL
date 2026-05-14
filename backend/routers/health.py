# backend/routers/health.py
from fastapi import APIRouter
from schemas import HealthOutput
import models_loader as ml

router = APIRouter()

@router.get("/health", response_model=HealthOutput)
def health_check():
    return HealthOutput(
        status="healthy" if all(ml.MODEL_STATUS.values()) else "degraded",
        models=ml.MODEL_STATUS,
        version="1.0.0"
    )