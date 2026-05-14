# backend/routers/predict.py
from fastapi import APIRouter, HTTPException
from schemas import ApplianceInput, PredictionOutput
import models_loader as ml
import numpy as np

router = APIRouter()

@router.post("/predict", response_model=PredictionOutput)
def predict_emissions(data: ApplianceInput):
    """
    Predict daily and monthly CO2 emissions from household appliance data.
    Uses the trained XGBoost regression model.
    """
    if ml.xgb_model is None:
        raise HTTPException(503, "XGBoost model not loaded. Check server logs.")

    row = ml.input_to_features(data)
    X   = np.array([row])

    daily_co2   = float(ml.xgb_model.predict(X)[0])
    daily_co2   = max(daily_co2, 0.1)
    weekly_co2  = round(daily_co2 * 7, 2)
    monthly_co2 = round(daily_co2 * 30, 2)
    annual_co2  = round(daily_co2 * 365, 2)
    monthly_kwh = round(monthly_co2 / ml.SL_EMISSION_FACTOR, 2)
    monthly_cost= ml.get_ceb_cost(data.ceb_units)

    SL_AVG = 5.5
    vs_avg  = round((daily_co2 - SL_AVG) / SL_AVG * 100, 1)

    if daily_co2 < 2.5:
        level = "Low"
    elif daily_co2 < 5.5:
        level = "Medium"
    else:
        level = "High"

    return PredictionOutput(
        daily_co2_kg     = round(daily_co2, 3),
        weekly_co2_kg    = weekly_co2,
        monthly_co2_kg   = monthly_co2,
        annual_co2_kg    = annual_co2,
        monthly_kwh      = monthly_kwh,
        monthly_cost_lkr = monthly_cost,
        emission_level   = level,
        sl_average_co2   = SL_AVG,
        vs_average_pct   = vs_avg,
    )