# backend/routers/solar.py
from fastapi import APIRouter
from schemas import SolarInput, SolarOutput
import models_loader as ml

router = APIRouter()

PANEL_EFFICIENCY = 0.18  # 18% — standard monocrystalline
PANEL_LIFE_YEARS = 25    # Standard panel lifetime
CEB_EXPORT_RATE = 22.0   # LKR per kWh exported back to grid

@router.post('/solar', response_model=SolarOutput)
def solar_roi(data: SolarInput):
    """
    Calculate solar panel ROI for a Sri Lankan household.
    Uses SLSEA city-level solar irradiance data.
    """
    city = data.city if data.city in ml.SOLAR_IRRADIANCE else 'Colombo'
    irradiance = ml.SOLAR_IRRADIANCE[city]  # kWh/m2/day
    
    # Annual generation
    daily_kwh = data.roof_area_sqm * PANEL_EFFICIENCY * irradiance
    annual_kwh = daily_kwh * 365
    
    # Annual bill saving
    annual_saving_lkr = annual_kwh * CEB_EXPORT_RATE
    
    # Lifetime CO2 saving (kg)
    lifetime_co2 = annual_kwh * PANEL_LIFE_YEARS * ml.SL_EMISSION_FACTOR
    
    # Payback period
    payback = data.installation_cost_lkr / (annual_saving_lkr + 0.001)
    
    return SolarOutput(
        annual_kwh_generated=round(annual_kwh, 1),
        annual_cost_saving_lkr=round(annual_saving_lkr, 2),
        lifetime_co2_saving_kg=round(lifetime_co2, 1),
        payback_years=round(payback, 1),
        city=city
    )

