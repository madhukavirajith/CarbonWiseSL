# backend/routers/simulate.py
from fastapi import APIRouter
from schemas import SimulationInput, SimulationOutput
import models_loader as ml
import numpy as np
import copy

router = APIRouter()

SCENARIO_DESCRIPTIONS = {
    'ac_temp': 'Set AC temperature to {val}°C',
    'ac_hours': 'Reduce AC to {val} hours/day',
    'led': 'Replace all old bulbs with {val} LEDs',
    'washer_shift': 'Reduce washing to {val} loads/week',
    'standby': 'Eliminate standby — turn off {val} devices fully'
}

@router.post('/simulate', response_model=SimulationOutput)
def simulate(data: SimulationInput):
    """
    What-if simulation: predict CO2 change when user modifies
    one specific behaviour.
    """
    base = data.base
    modified = copy.deepcopy(base)
    
    # Apply the scenario change
    if data.scenario == 'ac_temp':
        modified.ac_temp = data.new_value
    elif data.scenario == 'ac_hours':
        modified.ac_hours = data.new_value
    elif data.scenario == 'led':
        modified.led_count = int(modified.led_count + modified.old_bulb_count)
        modified.old_bulb_count = 0
    elif data.scenario == 'washer_shift':
        modified.washer_loads = data.new_value
    elif data.scenario == 'standby':
        modified.computer_hours = max(0, modified.computer_hours - 2)
        modified.tv_hours = max(0, modified.tv_hours - 1)
        
    # Predict both
    X_orig = np.array([ml.input_to_features(base)])
    X_mod = np.array([ml.input_to_features(modified)])
    
    orig_co2 = float(ml.xgb_model.predict(X_orig)[0])
    new_co2 = float(ml.xgb_model.predict(X_mod)[0])
    
    co2_saving = orig_co2 - new_co2
    
    # Rough LKR saving: 1 kWh ~ LKR 10 at mid-tariff
    kwh_saving = co2_saving / ml.SL_EMISSION_FACTOR
    cost_saving = kwh_saving * 10.0
    
    desc = SCENARIO_DESCRIPTIONS.get(data.scenario, data.scenario)
    desc = desc.replace('{val}', str(data.new_value))
    
    return SimulationOutput(
        original_co2=round(orig_co2, 3),
        new_co2=round(new_co2, 3),
        co2_saving_kg=round(co2_saving, 3),
        cost_saving_lkr=round(cost_saving, 2),
        scenario_description=desc
    )
