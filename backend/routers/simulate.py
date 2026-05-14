# backend/routers/simulate.py
import copy
from fastapi import APIRouter, HTTPException
from schemas import SimulationInput, SimulationOutput
import models_loader as ml
import numpy as np

router = APIRouter()

SCENARIO_META = {
    "ac_temp":      ("Set AC to {val}°C",           "Cooling"),
    "ac_hours":     ("Reduce AC to {val} hrs/day",  "Cooling"),
    "led_upgrade":  ("Replace all old bulbs with LED", "Lighting"),
    "washer_shift": ("Reduce washing to {val} loads/week", "Appliances"),
    "standby":      ("Eliminate standby power from {val} devices", "Standby"),
}

@router.post("/simulate", response_model=SimulationOutput)
def simulate(data: SimulationInput):
    """
    What-if simulation: predict CO2 and cost delta when the user
    makes one specific behavioural change.
    """
    if ml.xgb_model is None:
        raise HTTPException(503, "XGBoost model not loaded.")

    base     = data.base
    modified = copy.deepcopy(base)

    sc = data.scenario
    nv = data.new_value

    if sc == "ac_temp":
        modified.ac_temp = int(nv)
    elif sc == "ac_hours":
        modified.ac_hours = max(0.0, float(nv))
    elif sc == "led_upgrade":
        total = modified.led_count + modified.old_bulb_count + modified.tube_light_count
        modified.led_count       = total
        modified.old_bulb_count  = 0
        modified.tube_light_count= 0
    elif sc == "washer_shift":
        modified.washer_loads = max(0.0, float(nv))
    elif sc == "standby":
        # Eliminating standby — reduce computer and TV hours slightly
        modified.computer_hours = max(0.0, modified.computer_hours - 1.0)
        modified.tv_hours       = max(0.0, modified.tv_hours - 0.5)

    X_orig = np.array([ml.input_to_features(base)])
    X_mod  = np.array([ml.input_to_features(modified)])

    orig_co2 = float(ml.xgb_model.predict(X_orig)[0])
    new_co2  = float(ml.xgb_model.predict(X_mod)[0])

    saving_day   = orig_co2 - new_co2
    saving_month = saving_day * 30
    kwh_saving   = saving_day / ml.SL_EMISSION_FACTOR
    cost_saving  = kwh_saving * 10.0 * 30   # LKR per month approx
    saving_pct   = round(saving_day / (orig_co2 + 1e-9) * 100, 1)

    if saving_pct > 20:
        impact = "High Impact"
    elif saving_pct > 8:
        impact = "Medium Impact"
    else:
        impact = "Low Impact"

    meta  = SCENARIO_META.get(sc, ("{val}", "General"))
    desc  = meta[0].replace("{val}", str(nv))

    return SimulationOutput(
        scenario             = sc,
        original_co2         = round(orig_co2, 3),
        new_co2              = round(new_co2, 3),
        co2_saving_kg_day    = round(saving_day, 3),
        co2_saving_kg_month  = round(saving_month, 2),
        cost_saving_lkr_month= round(cost_saving, 2),
        co2_saving_pct       = saving_pct,
        description          = desc,
        impact_label         = impact,
    )