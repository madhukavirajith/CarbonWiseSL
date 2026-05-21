import os
import pandas as pd
import numpy as np

SL_EMISSION_FACTOR = 0.52   # kg CO2 per kWh — SLSEA 2024


if '__file__' in globals():
    DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
else:
    DATA_DIR = 'data'


def load_survey_data(filepath=None):
   
    if filepath is None:
        
        local_path = os.path.join(DATA_DIR, 'SL_Appliance_Survey_1.csv')
        if not os.path.exists(local_path):
            local_path = os.path.join(DATA_DIR, 'SL_Appliance_Survey_Synthetic_200.csv')
            
        if os.path.exists(local_path):
            filepath = local_path
        else:
            filepath = "https://drive.google.com/uc?export=download&id=15usm0BgFCfkOGYyPlk76OnECWvrSwbY5"

    df = pd.read_csv(filepath)

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

    numeric_cols = df.select_dtypes(include=[np.number]).columns
    df[numeric_cols] = df[numeric_cols].fillna(0)

    print(f"Survey loaded: {len(df)} rows, {len(df.columns)} columns")
    return df