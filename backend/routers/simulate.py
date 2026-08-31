# backend/routers/simulate.py
import copy
from fastapi import APIRouter, HTTPException
from schemas import SimulationInput, SimulationOutput
import models_loader as ml
import numpy as np

router = APIRouter()

SCENARIO_META = {
    # Bug 14 fix: description now reflects that nv is actually used
    "ac_temp":      ("Set AC thermostat to {val}°C",                           "Cooling"),
    "ac_hours":     ("Reduce AC to {val} hrs/day",                              "Cooling"),
    "led_upgrade":  ("Replace {val} old/tube bulbs with 9W LEDs",               "Lighting"),
    "washer_shift": ("Reduce washing to {val} loads/week",                       "Appliances"),
    "standby":      ("Fully turn off {val} devices instead of leaving on standby", "Standby"),
}


@router.post("/simulate", response_model=SimulationOutput)
def simulate(data: SimulationInput):
    """
    What-if simulation: predict CO2 and cost delta when the user
    makes one specific behavioural change.
    Negative co2_saving values indicate the change would *increase* emissions.
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
        # Bug 3 fix: use nv (the slider value) as the number of bulbs to replace,
        # not "replace everything". Replace old incandescent bulbs first, then tube lights.
        to_replace = int(nv)
        from_old   = min(to_replace, modified.old_bulb_count)
        modified.old_bulb_count -= from_old
        remaining  = to_replace - from_old
        from_tube  = min(remaining, modified.tube_light_count)
        modified.tube_light_count -= from_tube
        # Each replaced bulb becomes a 9W LED
        modified.led_count += (from_old + from_tube)

    elif sc == "washer_shift":
        modified.washer_loads = max(0.0, float(nv))

    elif sc == "standby":
        # Bug 2 fix: use nv (number of devices) and scale the effective usage-hour
        # reduction proportionally.  Each device taken fully off standby is modelled
        # as ≈ 1.0 h less computer usage + 0.5 h less TV usage per device, which is
        # the closest approximation the current feature set allows.
        devices        = int(nv)
        comp_reduction = min(modified.computer_hours, 1.0 * devices)
        tv_reduction   = min(modified.tv_hours,       0.5 * devices)
        modified.computer_hours = max(0.0, modified.computer_hours - comp_reduction)
        modified.tv_hours       = max(0.0, modified.tv_hours       - tv_reduction)

    X_orig = np.array([ml.input_to_features(base)])
    X_mod  = np.array([ml.input_to_features(modified)])

    raw_orig_co2 = float(ml.xgb_model.predict(X_orig)[0])
    raw_new_co2  = float(ml.xgb_model.predict(X_mod)[0])

    orig_co2 = max(0.1, raw_orig_co2)
    new_co2  = max(0.1, raw_new_co2)

    # If the relevant appliance is absent, the scenario has no effect
    if sc in ["ac_temp", "ac_hours"] and (
        base.has_ac == 0 or base.ac_hours == 0 or base.ac_rooms == 0
    ):
        saving_day   = 0.0
        saving_month = 0.0
        cost_saving  = 0.0
        saving_pct   = 0.0
        new_co2      = orig_co2

    else:
        # Bug 13 fix: allow negative savings so the UI can warn the user that
        # the chosen change would actually *increase* their emissions.
        actual_saving = orig_co2 - new_co2       # positive = reduction, negative = increase

        saving_day   = round(actual_saving, 3)
        saving_month = round(actual_saving * 30, 2)

        kwh_saving   = actual_saving / ml.SL_EMISSION_FACTOR
        orig_cost    = ml.get_ceb_cost(base.ceb_units)
        new_cost     = ml.get_ceb_cost(max(0.0, base.ceb_units - kwh_saving * 30))
        cost_saving  = round(orig_cost - new_cost, 2)   # can be negative (cost increase)

        saving_pct   = round((actual_saving / orig_co2) * 100, 1)

    # Bug 13 fix: add a label for scenarios that increase emissions
    if saving_pct > 20:
        impact = "High Impact"
    elif saving_pct > 8:
        impact = "Medium Impact"
    elif saving_pct >= 0:
        impact = "Low Impact"
    else:
        impact = "Increases Emissions"

    meta = SCENARIO_META.get(sc, ("{val}", "General"))
    desc = meta[0].replace("{val}", str(nv))

    return SimulationOutput(
        scenario              = sc,
        original_co2          = round(orig_co2, 3),
        new_co2               = round(new_co2, 3),
        co2_saving_kg_day     = saving_day,
        co2_saving_kg_month   = saving_month,
        cost_saving_lkr_month = cost_saving,
        co2_saving_pct        = saving_pct,
        description           = desc,
        impact_label          = impact,
    )