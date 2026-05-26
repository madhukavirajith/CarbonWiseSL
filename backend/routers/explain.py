# backend/routers/explain.py
from fastapi import APIRouter, HTTPException
from schemas import ApplianceInput, ExplainOutput, ShapValue
import models_loader as ml
import numpy as np

router = APIRouter()

@router.post("/explain", response_model=ExplainOutput)
def explain_prediction(data: ApplianceInput):
    """
    Return SHAP Shapley values for each appliance's contribution
    to the total CO2 prediction. Powers the waterfall chart.
    """
    if ml.xgb_model is None or ml.shap_explainer is None:
        raise HTTPException(503, "Models not loaded.")

    row  = ml.input_to_features(data)
    X    = np.array([row])
    feat = ml.features or []

    shap_vals  = ml.shap_explainer.shap_values(X)[0]
    base_value = float(ml.shap_explainer.expected_value)
    predicted  = float(ml.xgb_model.predict(X)[0])

    total_abs = sum(abs(v) for v in shap_vals) + 1e-9

    results = []
    for f, v in zip(feat, shap_vals):
        fv = float(v)
        results.append(ShapValue(
            feature          = f,
            label            = ml.FEATURE_LABELS.get(f, f.replace("_", " ").title()),
            shap_value       = round(fv, 5),
            contribution_pct = round(abs(fv) / total_abs * 100, 1),
            direction        = "increases" if fv > 0 else "decreases",
        ))

    results.sort(key=lambda x: abs(x.shap_value), reverse=True)

    # Filter out non-appliance inputs for the "Biggest Culprit" card
    exclude_culprits = {"ceb_units", "occupants", "city_encoded"}
    appliance_results = [r for r in results if r.feature not in exclude_culprits]
    top_culprit = appliance_results[0].label if appliance_results else "Unknown"

    return ExplainOutput(
        shap_values   = results[:12],   # top 12 for display
        base_value    = round(base_value, 4),
        predicted_co2 = round(predicted, 3),
        top_culprit   = top_culprit,
    )