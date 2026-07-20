# backend/models_loader.py
import pickle
import os
import logging
import numpy as np

logger = logging.getLogger(__name__)

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")

# ── Load all models at startup ─────────────────────────────────────────────
def _load(filename):
    path = os.path.join(MODELS_DIR, filename)
    if not os.path.exists(path):
        logger.warning(f"Model file not found: {path}")
        return None
    with open(path, "rb") as f:
        return pickle.load(f)

logger.info("Loading CarbonWise SL ML models...")

xgb_model      = _load("xgboost_model.pkl")
kmeans_model   = _load("kmeans_model.pkl")
kmeans_scaler  = _load("kmeans_scaler.pkl")
shap_explainer = _load("shap_explainer.pkl")
features       = _load("features.pkl")
city_encoder   = _load("city_encoder.pkl")
cluster_config = _load("cluster_config.pkl")

CLUSTER_NAMES = cluster_config["names"]   if cluster_config else {}
CLUSTER_RECS  = cluster_config["recs"]    if cluster_config else {}
CLUSTER_ICONS = cluster_config.get("icons", {0:"❄️", 1:"🌿", 2:"👨‍👩‍👧‍👦"})

MODEL_STATUS = {
    "xgboost":      xgb_model      is not None,
    "kmeans":       kmeans_model   is not None,
    "shap":         shap_explainer is not None,
    "city_encoder": city_encoder   is not None,
}
logger.info(f"Model status: {MODEL_STATUS}")

# ── Constants ──────────────────────────────────────────────────────────────
SL_EMISSION_FACTOR = 0.52   # kg CO2 per kWh - SLSEA 2024

SOLAR_IRRADIANCE = {
    "Colombo": 4.5,
    "Kandy":   4.2,
    "Galle":   4.6,
}

# Outdated 2014 tariff bands, replaced by May 2026 tariff structures

FRIDGE_KWH = {
    "Small (under 200L)": 0.08 * 24,
    "Medium (200-350L)":  0.12 * 24,
    "Large (over 350L)":  0.18 * 24,
    "None":               0.0,
}

HEATER_KW = {
    "Instant (3kW)":        3.0,
    "Storage (2kW)":        2.0,
    "Solar-assisted (1kW)": 1.0,
    "None":                 0.0,
}

TV_KW = {
    "LED/LCD": 0.070,
    "OLED":    0.090,
    "Old CRT": 0.120,
}

PC_KW = {
    "Laptop":  0.045,
    "Desktop": 0.120,
    "Both":    0.080,
    "None":    0.000,
}

FEATURE_LABELS = {
    "has_ac":            "Air Conditioner",
    "ac_hours":          "AC Usage Hours",
    "ac_temp":           "AC Temperature",
    "ac_rooms":          "AC Rooms",
    "has_fridge":        "Refrigerator",
    "fridge_kwh_day":    "Fridge Energy",
    "has_heater":        "Water Heater",
    "heater_kw":         "Heater Power",
    "heater_hours":      "Heater Hours",
    "num_fans":          "Ceiling Fans",
    "fan_hours":         "Fan Hours",
    "num_tvs":           "Televisions",
    "tv_kw":             "TV Power",
    "tv_hours":          "TV Hours",
    "has_washer":        "Washing Machine",
    "washer_loads":      "Washer Loads",
    "led_count":         "LED Bulbs",
    "old_bulb_count":    "Old Bulbs",
    "tube_light_count":  "Tube Lights",
    "light_hours":       "Lighting Hours",
    "has_computer":      "Computer/Laptop",
    "pc_kw":             "Computer Power",
    "computer_hours":    "Computer Hours",
    "has_rice_cooker":   "Rice Cooker",
    "rice_cooker_uses":  "Rice Cooker Uses",
    "has_microwave":     "Microwave",
    "microwave_hours":   "Microwave Hours",
    "has_iron":          "Electric Iron",
    "iron_hours_week":   "Iron Hours/Week",
    "has_solar":         "Solar Panels",
    "solar_kw":          "Solar Capacity",
    "occupants":         "Occupants",
    "ceb_units":         "CEB Units",
    "city_encoded":      "City",
}

# ── Helpers ────────────────────────────────────────────────────────────────
def get_ceb_cost(units: float) -> float:
    """
    Calculate domestic CEB bill based on the newly approved May 11, 2026 tariff.
    Handles three consumption categories:
    1. 0-60 kWh
    2. Above 60-180 kWh
    3. Above 180 kWh
    Applies 2.5% SSCL (using effective rate 2.5/97.5), 18% VAT, and 10.00 LKR meter rent.
    """
    if units <= 0:
        return 0.0

    base_bill = 0.0
    fixed_charge = 0.0

    if units <= 60:
        # Consumption 0-60 kWh per month
        if units <= 30:
            base_bill = units * 5.00
            fixed_charge = 80.00
        else:
            base_bill = (30 * 5.00) + ((units - 30) * 9.00)
            fixed_charge = 210.00
    elif units <= 180:
        # Consumption above 60-180 kWh per month
        # Energy charge is cumulative block-wise
        rem = units
        # Block 1: 0-60
        b1 = min(rem, 60.0)
        base_bill += b1 * 14.00
        rem -= b1
        
        # Block 2: 61-90
        if rem > 0:
            b2 = min(rem, 30.0)
            base_bill += b2 * 20.00
            rem -= b2
            
        # Block 3: 91-120
        if rem > 0:
            b3 = min(rem, 30.0)
            base_bill += b3 * 28.00
            rem -= b3
            
        # Block 4: 121-180
        if rem > 0:
            b4 = min(rem, 60.0)
            base_bill += b4 * 44.00
            rem -= b4
            
        # Determine fixed charge based on total consumption
        if units <= 90:
            fixed_charge = 400.00
        elif units <= 120:
            fixed_charge = 1000.00
        else:
            fixed_charge = 1500.00
            
    else:
        # Consumption above 180 kWh per month
        # Block 1: 0-180 @ 32.50
        # Block 2: Above 180 @ 100.00
        base_bill += 180.0 * 32.50
        base_bill += (units - 180.0) * 100.00
        fixed_charge = 2500.00

    subtotal = base_bill + fixed_charge

    # Apply 2.5% SSCL on turnover (taxable base grossed up by 2.5/97.5)
    sscl = subtotal * (2.5 / 97.5)
    # Apply 18% VAT on top of (Subtotal + SSCL)
    vat = (subtotal + sscl) * 0.18
    # Standard 10.00 LKR meter rent
    meter_rent = 10.00

    total_bill = subtotal + sscl + vat + meter_rent
    return round(total_bill, 2)


def get_ceb_cost_july2024(units: float) -> float:
    """
    Calculate domestic CEB bill based on the July 16, 2024 to May 10, 2026 tariff.
    Provided for reference and validation.
    """
    if units <= 0:
        return 0.0

    base_bill = 0.0
    fixed_charge = 0.0

    if units <= 60:
        if units <= 30:
            base_bill = units * 6.00
            fixed_charge = 100.00
        else:
            base_bill = (30 * 6.00) + ((units - 30) * 9.00)
            fixed_charge = 250.00
    else:
        rem = units
        # Block 1: 0-60
        b1 = min(rem, 60.0)
        base_bill += b1 * 15.00
        rem -= b1
        # Block 2: 61-90
        if rem > 0:
            b2 = min(rem, 30.0)
            base_bill += b2 * 18.00
            rem -= b2
        # Block 3: 91-120
        if rem > 0:
            b3 = min(rem, 30.0)
            base_bill += b3 * 30.00
            rem -= b3
        # Block 4: 121-180
        if rem > 0:
            b4 = min(rem, 60.0)
            base_bill += b4 * 42.00
            rem -= b4
        # Block 5: Above 180
        if rem > 0:
            base_bill += rem * 65.00

        # Fixed charges
        if units <= 90:
            fixed_charge = 400.00
        elif units <= 120:
            fixed_charge = 1000.00
        elif units <= 180:
            fixed_charge = 1500.00
        else:
            fixed_charge = 2000.00

    subtotal = base_bill + fixed_charge
    sscl = subtotal * (2.5 / 97.5)
    vat = (subtotal + sscl) * 0.18
    meter_rent = 10.00
    total_bill = subtotal + sscl + vat + meter_rent
    return round(total_bill, 2)


def input_to_features(data) -> list:
    """Convert ApplianceInput Pydantic model to ordered feature list (33 features)."""
    city_enc = 0
    if city_encoder is not None:
        try:
            city_enc = int(city_encoder.transform([data.city])[0])
        except Exception:
            city_enc = 0

    row = [
        float(data.occupants),
        float(data.has_ac),
        float(data.ac_rooms),
        float(data.ac_hours),
        float(data.ac_temp),
        float(data.has_fridge),
        float(FRIDGE_KWH.get(data.fridge_size, 2.88)),
        float(data.has_heater),
        float(HEATER_KW.get(data.heater_type, 0.0)),
        float(data.heater_hours),
        float(data.num_fans),
        float(data.fan_hours),
        float(data.num_tvs),
        float(TV_KW.get(data.tv_type, 0.070)),
        float(data.tv_hours),
        float(data.has_washer),
        float(data.washer_loads),
        float(data.led_count),
        float(data.old_bulb_count),
        float(data.tube_light_count),
        float(data.light_hours),
        float(data.has_computer),
        float(PC_KW.get(data.computer_type, 0.045)),
        float(data.computer_hours),
        float(data.has_rice_cooker),
        float(data.rice_cooker_uses),
        float(data.has_microwave),
        float(data.microwave_hours),
        float(data.has_iron),
        float(data.iron_hours_week),
        float(data.has_solar),
        float(data.solar_kw),
        float(city_enc),
    ]
    return row


def estimate_daily_kwh(data) -> float:
    """Estimate daily kWh from appliance data (used for clustering)."""
    fridge_kwh = FRIDGE_KWH.get(data.fridge_size, 2.88)
    heater_kw  = HEATER_KW.get(data.heater_type, 0.0)
    tv_kw      = TV_KW.get(data.tv_type, 0.07)
    pc_kw      = PC_KW.get(data.computer_type, 0.045)

    kwh = (
        data.has_ac * data.ac_hours * 1.0 * data.ac_rooms +
        data.has_fridge * fridge_kwh +
        data.has_heater * data.heater_hours * heater_kw +
        data.num_fans * data.fan_hours * 0.060 +
        data.num_tvs * data.tv_hours * tv_kw +
        data.has_washer * data.washer_loads / 7 * 0.40 +
        data.led_count * data.light_hours * 0.009 +
        data.old_bulb_count * data.light_hours * 0.055 +
        data.tube_light_count * data.light_hours * 0.036 +
        data.has_computer * data.computer_hours * pc_kw +
        data.has_rice_cooker * data.rice_cooker_uses * 0.20 +
        data.has_microwave * data.microwave_hours * 1.0 +
        data.has_iron * data.iron_hours_week / 7 * 0.75
    )

    kwh = max(kwh - data.has_solar * data.solar_kw * 3.8, 0.3)
    return round(float(kwh), 3)