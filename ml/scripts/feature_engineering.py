# ml/scripts/feature_engineering.py
"""
Converts cleaned survey data into the feature matrix used by XGBoost.
The FEATURE_COLUMNS list here must exactly match what models_loader.py
uses in the backend — same order, same names.
"""

import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder


# ── Feature column order — must match backend/models_loader.py ────────────
FEATURE_COLUMNS = [
    'occupants',
    'ceb_units',
    'has_ac',
    'ac_rooms',
    'ac_hours',
    'ac_temp',
    'has_fridge',
    'fridge_kwh_day',
    'has_heater',
    'heater_kw',
    'heater_hours',
    'num_fans',
    'fan_hours',
    'num_tvs',
    'tv_kw',
    'tv_hours',
    'has_washer',
    'washer_loads',
    'led_count',
    'old_bulb_count',
    'tube_light_count',
    'light_hours',
    'has_computer',
    'pc_kw',
    'computer_hours',
    'has_rice_cooker',
    'rice_cooker_uses',
    'has_microwave',
    'microwave_hours',
    'has_iron',
    'iron_hours_week',
    'has_solar',
    'solar_kw',
    'city_encoded',
]

TARGET_COLUMN = 'daily_co2_kg'

# ── Wattage / energy lookup tables ───────────────────────────────────────
FRIDGE_KWH_DAY = {
    'Small (under 200L)': 0.08 * 24,
    'Medium (200-350L)':  0.12 * 24,
    'Large (over 350L)':  0.18 * 24,
    'None':               0.0,
}

HEATER_KW = {
    'Instant (3kW)':        3.0,
    'Storage (2kW)':        2.0,
    'Solar-assisted (1kW)': 1.0,
    'None':                 0.0,
}

TV_KW = {
    'LED/LCD': 0.070,
    'OLED':    0.090,
    'Old CRT': 0.120,
}

PC_KW = {
    'Laptop':  0.045,
    'Desktop': 0.120,
    'Both':    0.080,
    'None':    0.000,
}


def engineer_features(df, fit_encoder=True, city_encoder=None):
    """
    Takes a cleaned survey DataFrame and returns:
        X             — feature matrix (DataFrame with FEATURE_COLUMNS)
        y             — target series (daily_co2_kg), or None if not present
        city_encoder  — fitted LabelEncoder for the city column

    Parameters
    ----------
    df            : cleaned survey DataFrame from data_loader.load_survey_data()
    fit_encoder   : True  → fit a new LabelEncoder on df['city']
                    False → transform with the provided city_encoder
    city_encoder  : pre-fitted LabelEncoder (required when fit_encoder=False)
    """
    df = df.copy()

    # ── Map variable-wattage columns ──────────────────────────────────────
    df['fridge_kwh_day'] = df['fridge_size'].map(FRIDGE_KWH_DAY).fillna(2.88)
    df['heater_kw']      = df['heater_type'].map(HEATER_KW).fillna(0.0)
    df['tv_kw']          = df['tv_type'].map(TV_KW).fillna(0.070)
    df['pc_kw']          = df['computer_type'].map(PC_KW).fillna(0.045)

    # ── City encoding ─────────────────────────────────────────────────────
    if fit_encoder:
        city_encoder = LabelEncoder()
        df['city_encoded'] = city_encoder.fit_transform(
            df['city'].fillna('Colombo')
        )
    else:
        if city_encoder is None:
            raise ValueError("city_encoder must be provided when fit_encoder=False")
        df['city_encoded'] = city_encoder.transform(
            df['city'].fillna('Colombo')
        )

    # ── Build feature matrix ──────────────────────────────────────────────
    missing = [c for c in FEATURE_COLUMNS if c not in df.columns]
    if missing:
        print(f"Warning: missing columns filled with 0: {missing}")
        for col in missing:
            df[col] = 0

    X = df[FEATURE_COLUMNS].fillna(0).astype(float)
    y = df[TARGET_COLUMN] if TARGET_COLUMN in df.columns else None

    print(f"Feature matrix: {X.shape}  |  "
          f"Target range: {y.min():.3f} - {y.max():.3f} kg CO2/day"
          if y is not None else f"Feature matrix: {X.shape}")

    return X, y, city_encoder