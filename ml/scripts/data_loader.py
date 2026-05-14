# ml/scripts/data_loader.py
"""
Loads and cleans the Sri Lankan appliance survey CSV and
(optionally) the UCI Household Electric Power Consumption dataset.
"""

import os
import pandas as pd
import numpy as np

SL_EMISSION_FACTOR = 0.52   # kg CO2 per kWh — SLSEA 2024
DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')


def load_survey_data(filepath=None):
    """
    Load and clean the Sri Lankan appliance survey CSV.
    Works with both the synthetic dataset and real Google Form exports.
    """
    if filepath is None:
        filepath = os.path.join(
            DATA_DIR, 'SL_Appliance_Survey_Synthetic_200.csv'
        )

    df = pd.read_csv(filepath)

    # ── Rename columns ────────────────────────────────────────────────────
    rename_map = {
        'Timestamp':                        'timestamp',
        'Respondent_ID':                    'respondent_id',
        'City':                             'city',
        'Number_of_Occupants':              'occupants',
        'Has_Air_Conditioner':              'has_ac',
        'AC_Number_of_Rooms':               'ac_rooms',
        'AC_Daily_Usage_Hours':             'ac_hours',
        'AC_Temperature_Setting_Celsius':   'ac_temp',
        'Has_Refrigerator':                 'has_fridge',
        'Refrigerator_Size':                'fridge_size',
        'Has_Water_Heater':                 'has_heater',
        'Water_Heater_Type':                'heater_type',
        'Water_Heater_Daily_Usage_Hours':   'heater_hours',
        'Number_of_Ceiling_Fans':           'num_fans',
        'Fan_Daily_Usage_Hours':            'fan_hours',
        'Number_of_Televisions':            'num_tvs',
        'TV_Type':                          'tv_type',
        'TV_Daily_Usage_Hours':             'tv_hours',
        'Has_Washing_Machine':              'has_washer',
        'Washing_Machine_Type':             'washer_type',
        'Washing_Machine_Loads_Per_Week':   'washer_loads',
        'Number_of_LED_Bulbs':              'led_count',
        'Number_of_Old_Fluorescent_Bulbs':  'old_bulb_count',
        'Number_of_Tube_Lights':            'tube_light_count',
        'Lighting_Daily_Usage_Hours':       'light_hours',
        'Has_Computer_or_Laptop':           'has_computer',
        'Computer_Type':                    'computer_type',
        'Computer_Daily_Usage_Hours':       'computer_hours',
        'Has_Rice_Cooker':                  'has_rice_cooker',
        'Rice_Cooker_Uses_Per_Day':         'rice_cooker_uses',
        'Has_Microwave':                    'has_microwave',
        'Microwave_Daily_Usage_Hours':      'microwave_hours',
        'Has_Electric_Iron':                'has_iron',
        'Iron_Usage_Hours_Per_Week':        'iron_hours_week',
        'Primary_Peak_Usage_Time':          'peak_usage_time',
        'Has_Solar_Panels':                 'has_solar',
        'Solar_Panel_Capacity_kW':          'solar_kw',
        'Last_Month_CEB_Units_Consumed':    'ceb_units',
        'Estimated_Monthly_CEB_Bill_LKR':   'ceb_bill_lkr',
        'Estimated_Daily_kWh':              'daily_kwh_raw',
        'Daily_CO2_Emissions_kg':           'daily_co2_kg',
        'Monthly_CO2_Emissions_kg':         'monthly_co2_kg',
        'Emission_Level':                   'emission_level',
    }
    # Only rename columns that actually exist
    df = df.rename(columns={k: v for k, v in rename_map.items() if k in df.columns})

    # ── Convert Yes/No to 1/0 ─────────────────────────────────────────────
    yes_no_cols = [
        'has_ac', 'has_fridge', 'has_heater', 'has_washer',
        'has_computer', 'has_rice_cooker', 'has_microwave',
        'has_iron', 'has_solar',
    ]
    for col in yes_no_cols:
        if col in df.columns:
            df[col] = (
                df[col].astype(str).str.strip().str.lower() == 'yes'
            ).astype(int)

    # ── Fill missing numeric values only ─────────────────────────────────
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    df[numeric_cols] = df[numeric_cols].fillna(0)

    print(f"Survey loaded: {len(df)} rows, {len(df.columns)} columns")
    return df


def load_uci_data(filepath=None):
    """
    Load the UCI Household Electric Power Consumption dataset.
    Download from: archive.ics.uci.edu/dataset/235
    Aggregates minute-level readings to daily totals.
    Returns None if the file is not found (dataset is optional).
    """
    if filepath is None:
        filepath = os.path.join(DATA_DIR, 'household_power_consumption.txt')

    if not os.path.exists(filepath):
        print("UCI dataset not found — using survey data only.")
        print(f"Expected at: {filepath}")
        return None

    print("Loading UCI dataset (~30 seconds)…")
    df = pd.read_csv(
        filepath,
        sep=';',
        parse_dates={'datetime': ['Date', 'Time']},
        dayfirst=True,
        low_memory=False,
        na_values=['?'],
    )
    df.dropna(inplace=True)
    df['Global_active_power'] = pd.to_numeric(df['Global_active_power'])
    df['hour']      = df['datetime'].dt.hour
    df['date']      = df['datetime'].dt.date
    df['month']     = df['datetime'].dt.month
    df['dayofweek'] = df['datetime'].dt.dayofweek

    daily = df.groupby('date').agg(
        daily_kwh     = ('Global_active_power', lambda x: x.sum() / 60),
        peak_ratio    = ('Global_active_power',
                         lambda x: x[df.loc[x.index, 'hour'].between(18, 22)].sum()
                         / (x.sum() + 1e-9)),
        month         = ('month',     'first'),
        dayofweek     = ('dayofweek', 'first'),
    ).reset_index()

    daily['daily_co2_kg'] = (daily['daily_kwh'] * SL_EMISSION_FACTOR).round(3)
    print(f"UCI loaded: {len(daily)} daily records")
    return daily