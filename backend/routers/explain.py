# backend/routers/explain.py
from fastapi import APIRouter
from schemas import ApplianceInput, ExplainOutput, ShapValue
import models_loader as ml
import numpy as np

router = APIRouter()

@router.post('/explain', response_model=ExplainOutput)
def explain_prediction(data: ApplianceInput):
    """
    Return SHAP values showing each appliance's contribution
    to the total CO2 prediction.
    """
    row = ml.input_to_features(data)
    X = np.array([row])
    
    # Compute SHAP values
    shap_vals = ml.shap_explainer.shap_values(X)[0]
    base_value = float(ml.shap_explainer.expected_value)
    predicted_co2 = float(ml.xgb_model.predict(X)[0])
    
    # Pair features with their SHAP values
    total_abs = sum(abs(v) for v in shap_vals) + 0.001
    results = []
    for feat, val in zip(ml.features, shap_vals):
        results.append(ShapValue(
            feature=feat,
            shap_value=round(float(val), 4),
            contribution_percent=round(abs(val) / total_abs * 100, 1)
        ))
    
    # Sort by absolute contribution, highest first
    results.sort(key=lambda x: abs(x.shap_value), reverse=True)
    
    return ExplainOutput(
        shap_values=results,
        base_value=round(base_value, 4),
        predicted_co2=round(predicted_co2, 3)
    )

