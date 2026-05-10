# backend/routers/predict.py
from fastapi import APIRouter
from schemas import ApplianceInput, PredictionOutput
import models_loader as ml
import numpy as np

router = APIRouter()

@router.post('/predict', response_model=PredictionOutput)
def predict_emissions(data: ApplianceInput):
    """
    Predict daily and monthly CO2 emissions from appliance data.
    Returns CO2 in kg and estimated CEB cost in LKR.
    """
    # Convert input to feature array
    row = ml.input_to_features(data)
    X = np.array([row])

    # XGBoost prediction
    daily_co2 = float(ml.xgb_model.predict(X)[0])
    monthly_co2 = daily_co2 * 30
    
    # Estimate monthly kWh from CO2
    monthly_kwh = monthly_co2 / ml.SL_EMISSION_FACTOR
    
    # CEB cost from units
    monthly_cost = ml.get_ceb_cost(data.ceb_units)
    
    # Classify emission level
    if daily_co2 < 2.0:
        level = 'Low'
    elif daily_co2 < 4.0:
        level = 'Medium'
    else:
        level = 'High'
        
    return PredictionOutput(
        daily_co2_kg=round(daily_co2, 3),
        monthly_co2_kg=round(monthly_co2, 3),
        monthly_kwh=round(monthly_kwh, 2),
        monthly_cost_lkr=round(monthly_cost, 2),
        emission_level=level
    )

