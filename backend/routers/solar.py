# backend/routers/solar.py
from fastapi import APIRouter
from schemas import SolarInput, SolarOutput
import models_loader as ml

router = APIRouter()

PANEL_EFFICIENCY = 0.18    # 18% monocrystalline panels
PANEL_LIFE_YEARS = 25
CEB_EXPORT_RATE  = 22.0    # LKR per kWh (net metering 2024)

@router.post("/solar", response_model=SolarOutput)
def solar_roi(data: SolarInput):
    """
    Calculate Solar ROI for a Sri Lankan household.
    Uses SLSEA city-level solar irradiance data.
    """
    city       = data.city if data.city in ml.SOLAR_IRRADIANCE else "Colombo"
    irradiance = ml.SOLAR_IRRADIANCE[city]

    daily_kwh  = data.roof_area_sqm * PANEL_EFFICIENCY * irradiance
    annual_kwh = daily_kwh * 365
    system_kw  = round(data.roof_area_sqm * PANEL_EFFICIENCY, 2)

    annual_saving     = annual_kwh * CEB_EXPORT_RATE
    monthly_saving    = annual_saving / 12
    lifetime_co2      = annual_kwh * PANEL_LIFE_YEARS * ml.SL_EMISSION_FACTOR
    payback           = data.installation_cost_lkr / (annual_saving + 0.01)

    return SolarOutput(
        annual_kwh_generated    = round(annual_kwh, 1),
        annual_cost_saving_lkr  = round(annual_saving, 2),
        monthly_cost_saving_lkr = round(monthly_saving, 2),
        lifetime_co2_saving_kg  = round(lifetime_co2, 1),
        payback_years           = round(payback, 1),
        system_size_kw          = system_kw,
        city                    = city,
        irradiance_used         = irradiance,
    )