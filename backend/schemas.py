# backend/schemas.py
from pydantic import BaseModel, Field
from typing import List, Optional

# ─── INPUT MODELS ───────────────────────────────────────────────────

class ApplianceInput(BaseModel):
    """Data the user enters about their household"""
    city: str = Field(default='Colombo', description='City name')
    occupants: int = Field(ge=1, le=20, description='Number of people')
    ceb_units: float = Field(ge=0, description='Last month CEB units')
    has_ac: int = Field(ge=0, le=1, description='Has AC: 1=yes, 0=no')
    ac_hours: float = Field(ge=0, le=24, default=0)
    ac_temp: float = Field(ge=16, le=30, default=24)
    has_fridge: int = Field(ge=0, le=1, default=1)
    has_heater: int = Field(ge=0, le=1, default=0)
    heater_hours: float = Field(ge=0, le=24, default=0)
    num_fans: int = Field(ge=0, le=20, default=2)
    fan_hours: float = Field(ge=0, le=24, default=6)
    num_tvs: int = Field(ge=0, le=10, default=1)
    tv_hours: float = Field(ge=0, le=24, default=4)
    has_washer: int = Field(ge=0, le=1, default=0)
    washer_loads: float = Field(ge=0, default=0)
    led_count: int = Field(ge=0, le=100, default=5)
    old_bulb_count: int = Field(ge=0, le=100, default=0)
    has_computer: int = Field(ge=0, le=1, default=0)
    computer_hours: float = Field(ge=0, le=24, default=0)

class SimulationInput(BaseModel):
    """For what-if simulation: base appliances + one change"""
    base: ApplianceInput
    scenario: str  # 'ac_temp', 'ac_hours', 'led', 'washer_shift', 'standby'
    new_value: float  # The new setting value

class SolarInput(BaseModel):
    """For solar ROI calculator"""
    city: str = Field(default='Colombo')
    roof_area_sqm: float = Field(ge=1, le=500)
    installation_cost_lkr: float = Field(ge=100000)

# ─── OUTPUT MODELS ──────────────────────────────────────────────────

class PredictionOutput(BaseModel):
    daily_co2_kg: float
    monthly_co2_kg: float
    monthly_kwh: float
    monthly_cost_lkr: float
    emission_level: str  # 'Low', 'Medium', 'High'

class ShapValue(BaseModel):
    feature: str
    shap_value: float
    contribution_percent: float

class ExplainOutput(BaseModel):
    shap_values: List[ShapValue]
    base_value: float
    predicted_co2: float

class ClusterOutput(BaseModel):
    cluster_id: int
    cluster_name: str
    recommendations: List[str]

class SimulationOutput(BaseModel):
    original_co2: float
    new_co2: float
    co2_saving_kg: float
    cost_saving_lkr: float
    scenario_description: str

class SolarOutput(BaseModel):
    annual_kwh_generated: float
    annual_cost_saving_lkr: float
    lifetime_co2_saving_kg: float
    payback_years: float
    city: str