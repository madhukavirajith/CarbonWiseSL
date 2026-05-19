# backend/schemas.py
from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
from enum import Enum


class CityEnum(str, Enum):
    colombo = "Colombo"
    kandy   = "Kandy"
    galle   = "Galle"

class TVTypeEnum(str, Enum):
    led  = "LED/LCD"
    oled = "OLED"
    crt  = "Old CRT"

class FridgeSizeEnum(str, Enum):
    small  = "Small (under 200L)"
    medium = "Medium (200-350L)"
    large  = "Large (over 350L)"
    none   = "None"

class HeaterTypeEnum(str, Enum):
    instant  = "Instant (3kW)"
    storage  = "Storage (2kW)"
    solar    = "Solar-assisted (1kW)"
    none     = "None"

class ComputerTypeEnum(str, Enum):
    laptop  = "Laptop"
    desktop = "Desktop"
    both    = "Both"
    none    = "None"

class ScenarioEnum(str, Enum):
    ac_temp      = "ac_temp"
    ac_hours     = "ac_hours"
    led_upgrade  = "led_upgrade"
    washer_shift = "washer_shift"
    standby      = "standby"

class EmissionLevelEnum(str, Enum):
    low    = "Low"
    medium = "Medium"
    high   = "High"


# ── INPUT ─────────────────────────────────────────────────────────────────
class ApplianceInput(BaseModel):
    city:              CityEnum   = Field(CityEnum.colombo, description="User's city")
    occupants:         int        = Field(3,   ge=1, le=20,  description="Number of occupants")
    ceb_units:         float      = Field(150, ge=0, le=600, description="Last month CEB units consumed")

    # Air Conditioner
    has_ac:            int        = Field(0, ge=0, le=1)
    ac_rooms:          int        = Field(0, ge=0, le=5)
    ac_hours:          float      = Field(0, ge=0, le=24)
    ac_temp:           int        = Field(24, ge=16, le=30)

    # Refrigerator
    has_fridge:        int        = Field(1, ge=0, le=1)
    fridge_size:       FridgeSizeEnum = Field(FridgeSizeEnum.medium)

    # Water Heater
    has_heater:        int        = Field(0, ge=0, le=1)
    heater_type:       HeaterTypeEnum = Field(HeaterTypeEnum.none)
    heater_hours:      float      = Field(0, ge=0, le=24)

    # Fans
    num_fans:          int        = Field(2, ge=0, le=20)
    fan_hours:         float      = Field(8, ge=0, le=24)

    # TV
    num_tvs:           int        = Field(1, ge=0, le=10)
    tv_type:           TVTypeEnum = Field(TVTypeEnum.led)
    tv_hours:          float      = Field(4, ge=0, le=24)

    # Washing Machine
    has_washer:        int        = Field(0, ge=0, le=1)
    washer_loads:      float      = Field(0, ge=0, le=30)

    # Lighting
    led_count:         int        = Field(6, ge=0, le=100)
    old_bulb_count:    int        = Field(0, ge=0, le=100)
    tube_light_count:  int        = Field(0, ge=0, le=20)
    light_hours:       float      = Field(6, ge=0, le=24)

    # Computer
    has_computer:      int        = Field(0, ge=0, le=1)
    computer_type:     ComputerTypeEnum = Field(ComputerTypeEnum.none)
    computer_hours:    float      = Field(0, ge=0, le=24)

    # Kitchen
    has_rice_cooker:   int        = Field(1, ge=0, le=1)
    rice_cooker_uses:  int        = Field(2, ge=0, le=5)
    has_microwave:     int        = Field(0, ge=0, le=1)
    microwave_hours:   float      = Field(0, ge=0, le=24)
    has_iron:          int        = Field(0, ge=0, le=1)
    iron_hours_week:   float      = Field(0, ge=0, le=20)

    # Solar
    has_solar:         int        = Field(0, ge=0, le=1)
    solar_kw:          float      = Field(0, ge=0, le=20)

    class Config:
        use_enum_values = True


class SimulationInput(BaseModel):
    base:      ApplianceInput
    scenario:  ScenarioEnum
    new_value: float = Field(..., description="New value for the scenario variable")

    class Config:
        use_enum_values = True


class SolarInput(BaseModel):
    city:                  CityEnum = Field(CityEnum.colombo)
    roof_area_sqm:         float    = Field(..., ge=1, le=500)
    installation_cost_lkr: float    = Field(..., ge=50000)
    monthly_ceb_units:     float    = Field(150, ge=0)

    class Config:
        use_enum_values = True


class HistorySaveInput(BaseModel):
    user_id:    str
    prediction: Dict[str, Any]
    appliances: Dict[str, Any]


# ── OUTPUT ────────────────────────────────────────────────────────────────
class PredictionOutput(BaseModel):
    daily_co2_kg:      float
    weekly_co2_kg:     float
    monthly_co2_kg:    float
    annual_co2_kg:     float
    monthly_kwh:       float
    monthly_cost_lkr:  float
    emission_level:    EmissionLevelEnum
    sl_average_co2:    float = 5.5   # SL urban average baseline
    vs_average_pct:    float         # % above/below average

class ShapValue(BaseModel):
    feature:             str
    label:               str          # human-readable label
    shap_value:          float
    contribution_pct:    float
    direction:           str          # "increases" or "decreases"

class ExplainOutput(BaseModel):
    shap_values:   List[ShapValue]
    base_value:    float
    predicted_co2: float
    top_culprit:   str

class ClusterOutput(BaseModel):
    cluster_id:      int
    cluster_name:    str
    cluster_icon:    str
    recommendations: List[str]
    cluster_size_pct: float

class SimulationOutput(BaseModel):
    scenario:           str
    original_co2:       float
    new_co2:            float
    co2_saving_kg_day:  float
    co2_saving_kg_month:float
    cost_saving_lkr_month: float
    co2_saving_pct:     float
    description:        str
    impact_label:       str

class SolarOutput(BaseModel):
    annual_kwh_generated:     float
    annual_cost_saving_lkr:   float
    monthly_cost_saving_lkr:  float
    lifetime_co2_saving_kg:   float
    payback_years:             float
    system_size_kw:            float
    city:                      str
    irradiance_used:           float

class HealthOutput(BaseModel):
    status:  str
    models:  Dict[str, bool]
    version: str

# ── AUTHENTICATION SCHEMAS ────────────────────────────────────────────────
class UserSignupInput(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email:    str = Field(...)
    password: str = Field(..., min_length=6)

class UserLoginInput(BaseModel):
    email:    str = Field(...)
    password: str = Field(...)

class AuthResponse(BaseModel):
    user_id:  str
    username: str
    email:    str
    token:    str