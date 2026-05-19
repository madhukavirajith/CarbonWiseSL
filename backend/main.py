# backend/main.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
import time
import logging

from routers import predict, explain, cluster, simulate, solar, history, health, auth

# ── Logging ───────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)
logger = logging.getLogger(__name__)

# ── App ───────────────────────────────────────────────────────────────────
app = FastAPI(
    title="CarbonWise SL API",
    description=(
        "AI-Powered Household Electricity Carbon Prediction, "
        "Explainability, and Reduction Platform for Urban Sri Lankan Households.\n\n"
        "**Models:** XGBoost Regression + K-Means Clustering + SHAP Explainability\n\n"
        "**Stack:** FastAPI · scikit-learn · XGBoost · SHAP · Firebase · Docker"
    ),
    version="1.0.0",
    contact={"name": "Madhuka Virajith", "email": "st20311741@student.edu.lk"},
    license_info={"name": "MIT"},
)

# ── CORS ──────────────────────────────────────────────────────────────────
import os
ALLOWED_ORIGINS_STR = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173"
)
ALLOWED_ORIGINS = [o.strip() for o in ALLOWED_ORIGINS_STR.split(",") if o.strip()]

logger.info(f"CORS Allowed Origins: {ALLOWED_ORIGINS}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Request timing middleware ─────────────────────────────────────────────
@app.middleware("http")
async def add_process_time(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = round((time.time() - start) * 1000, 2)
    response.headers["X-Process-Time-Ms"] = str(duration)
    logger.info(f"{request.method} {request.url.path} → {response.status_code} ({duration}ms)")
    return response

# ── Global error handler ──────────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error. Please try again."}
    )

# ── Routers ───────────────────────────────────────────────────────────────
app.include_router(health.router,   prefix="/api", tags=["Health"])
app.include_router(predict.router,  prefix="/api", tags=["Prediction"])
app.include_router(explain.router,  prefix="/api", tags=["Explainability"])
app.include_router(cluster.router,  prefix="/api", tags=["Clustering"])
app.include_router(simulate.router, prefix="/api", tags=["Simulation"])
app.include_router(solar.router,    prefix="/api", tags=["Solar ROI"])
app.include_router(history.router,  prefix="/api", tags=["History"])
app.include_router(auth.router,     prefix="/api", tags=["Authentication"])

@app.get("/", tags=["Root"])
def root():
    return {
        "app": "CarbonWise SL",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "health": "/api/health"
    }