# backend/models_loader.py
import pickle
import os

# Path to models folder
MODELS_DIR = os.path.join(os.path.dirname(__file__), 'models')

def load_pickle(filename):
    """Load a single pickle file"""
    path = os.path.join(MODELS_DIR, filename)
    with open(path, 'rb') as f:
        return pickle.load(f)

# Load all models at module import time
# This happens once when FastAPI starts — not on every request
print('Loading ML models...')
xgb_model = load_pickle('xgboost_model.pkl')
kmeans_model = load_pickle('kmeans_model.pkl')
kmeans_scaler = load_pickle('kmeans_scaler.pkl')
shap_explainer = load_pickle('shap_explainer.pkl')
features = load_pickle('features.pkl')
city_encoder = load_pickle('city_encoder.pkl')
cluster_config = load_pickle('cluster_config.pkl')

CLUSTER_NAMES = cluster_config['names']
CLUSTER_RECS = cluster_config['recs']

# CEB tariff: LKR per unit (2024 rates)
CEB_TARIFF = {
    (0, 60): 2.50,
    (60, 90): 4.85,
    (90, 120): 7.85,
    (120, 180): 10.00,
    (180, 9999): 12.00
}

# Sri Lanka grid emission factor (kg CO2 per kWh)
SL_EMISSION_FACTOR = 0.52

# Solar irradiance (kWh/m2/day) per city — from SLSEA
SOLAR_IRRADIANCE = {
    'Colombo': 4.5,
    'Kandy': 4.2,
    'Galle': 4.6
}

def get_ceb_cost(units: float) -> float:
    """Calculate CEB bill in LKR from units consumed"""
    for (low, high), rate in CEB_TARIFF.items():
        if low <= units < high:
            return units * rate
    return units * 12.00  # highest tariff

def input_to_features(data) -> list:
    """Convert ApplianceInput to ordered feature array for XGBoost"""
    city_enc = city_encoder.transform([data.city])[0] \
        if data.city in city_encoder.classes_ else 0
    row = [
        data.occupants, data.ceb_units,
        data.has_ac, data.ac_hours, data.ac_temp,
        data.has_fridge, data.has_heater, data.heater_hours,
        data.num_fans, data.fan_hours,
        data.num_tvs, data.tv_hours,
        data.has_washer, data.washer_loads,
        data.led_count, data.old_bulb_count,
        data.has_computer, data.computer_hours,
        city_enc
    ]
    return row

print('All models loaded successfully!')

