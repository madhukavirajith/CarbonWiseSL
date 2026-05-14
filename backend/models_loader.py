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
SL_EMISSION_FACTOR = 0.52   # kg CO2 per kWh — SLSEA 2024

SOLAR_IRRADIANCE = {
    "Colombo": 4.5,
    "Kandy":   4.2,
    "Galle":   4.6,
}

CEB_TARIFF_BANDS = [
    (0,   60,  2.50),
    (60,  90,  4.85),
    (90,  120, 7.85),
    (120, 180, 10.00),
    (180, 9999,12.00),
]

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
    cost = 0.0
    prev = 0.0
    for low, high, rate in CEB_TARIFF_BANDS:
        if units <= low:
            break
        applicable = min(units, high) - low
        cost += applicable * rate
        prev = low
    return round(cost, 2)


def input_to_features(data) -> list:
    """Convert ApplianceInput Pydantic model to ordered feature list (19 features)."""
    city_enc = 0
    if city_encoder is not None:
        try:
            city_enc = int(city_encoder.transform([data.city])[0])
        except Exception:
            city_enc = 0

    row = [
        data.occupants,
        data.ceb_units,
        data.has_ac,
        data.ac_hours,
        data.ac_temp,
        data.has_fridge,
        data.has_heater,
        data.heater_hours,
        data.num_fans,
        data.fan_hours,
        data.num_tvs,
        data.tv_hours,
        data.has_washer,
        data.washer_loads,
        data.led_count,
        data.old_bulb_count,
        data.has_computer,
        data.computer_hours,
        city_enc,
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