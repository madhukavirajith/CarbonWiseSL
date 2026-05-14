# ml/scripts/evaluate.py
"""
Loads all saved .pkl model files and runs a full end-to-end
evaluation to verify the complete pipeline works exactly as it
will in the FastAPI backend.

Run from ml/scripts/:
    python evaluate.py
"""

import os
import sys
import pickle
import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
from data_loader         import load_survey_data
from feature_engineering import engineer_features, FEATURE_COLUMNS

MODELS_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')

REQUIRED_FILES = [
    'xgboost_model.pkl',
    'kmeans_model.pkl',
    'kmeans_scaler.pkl',
    'shap_explainer.pkl',
    'features.pkl',
    'city_encoder.pkl',
    'cluster_config.pkl',
]


def load_all():
    print("\n" + "=" * 60)
    print("Loading all model files…")
    print("=" * 60)
    models  = {}
    missing = []
    for fname in REQUIRED_FILES:
        path = os.path.join(MODELS_DIR, fname)
        if os.path.exists(path):
            with open(path, 'rb') as f:
                models[fname] = pickle.load(f)
            size = os.path.getsize(path) / 1024
            print(f"  ✅  {fname:<32} ({size:.1f} KB)")
        else:
            print(f"  ❌  {fname:<32} MISSING")
            missing.append(fname)

    if missing:
        print(f"\nERROR: {len(missing)} file(s) missing.")
        print("Run training scripts in this order:")
        print("  1. python train_xgboost.py")
        print("  2. python train_kmeans.py")
        print("  3. python train_shap.py")
        sys.exit(1)

    print(f"\nAll {len(REQUIRED_FILES)} model files loaded ✅")
    return models


def test_full_pipeline(models):
    """
    Simulates exactly what the FastAPI backend does
    for a POST /api/predict → /api/explain → /api/cluster request.
    """
    print("\n" + "=" * 60)
    print("END-TO-END PIPELINE TEST")
    print("=" * 60)

    xgb_model    = models['xgboost_model.pkl']
    kmeans       = models['kmeans_model.pkl']
    scaler       = models['kmeans_scaler.pkl']
    explainer    = models['shap_explainer.pkl']
    features     = models['features.pkl']
    city_encoder = models['city_encoder.pkl']
    config       = models['cluster_config.pkl']

    # ── Simulated user input ──────────────────────────────────────────────
    # Matches ApplianceInput schema in backend/schemas.py
    city       = 'Colombo'
    city_enc   = int(city_encoder.transform([city])[0])

    feature_values = {
        'occupants':       4,
        'ceb_units':       280.0,
        'has_ac':          1,
        'ac_rooms':        1,
        'ac_hours':        7.0,
        'ac_temp':         24,
        'has_fridge':      1,
        'fridge_kwh_day':  2.88,    # Medium fridge
        'has_heater':      0,
        'heater_kw':       0.0,
        'heater_hours':    0.0,
        'num_fans':        3,
        'fan_hours':       10.0,
        'num_tvs':         2,
        'tv_kw':           0.07,    # LED/LCD
        'tv_hours':        5.0,
        'has_washer':      1,
        'washer_loads':    7.0,
        'led_count':       8,
        'old_bulb_count':  0,
        'tube_light_count':2,
        'light_hours':     6.0,
        'has_computer':    1,
        'pc_kw':           0.045,   # Laptop
        'computer_hours':  6.0,
        'has_rice_cooker': 1,
        'rice_cooker_uses':2,
        'has_microwave':   0,
        'microwave_hours': 0.0,
        'has_iron':        1,
        'iron_hours_week': 1.5,
        'has_solar':       0,
        'solar_kw':        0.0,
        'city_encoded':    city_enc,
    }

    # Build feature vector in the exact column order
    X = np.array([[feature_values[f] for f in features]])

    print(f"\nTest household: {city}, 4 occupants, AC {feature_values['ac_hours']} hrs/day")
    print(f"CEB units: {feature_values['ceb_units']}  |  Feature vector length: {len(X[0])}")

    # ── 1. XGBoost prediction ─────────────────────────────────────────────
    print("\n--- Module 1: XGBoost Prediction ---")
    daily_co2   = float(xgb_model.predict(X)[0])
    monthly_co2 = daily_co2 * 30
    annual_co2  = daily_co2 * 365
    SL_EF = 0.52
    monthly_kwh = monthly_co2 / SL_EF

    level = 'Low' if daily_co2 < 2.5 else ('Medium' if daily_co2 < 5.5 else 'High')
    print(f"  Daily CO₂   : {daily_co2:.3f} kg")
    print(f"  Monthly CO₂ : {monthly_co2:.2f} kg")
    print(f"  Annual CO₂  : {annual_co2:.1f} kg")
    print(f"  Monthly kWh : {monthly_kwh:.1f} kWh")
    print(f"  Level       : {level}")

    # ── 2. SHAP explanation ───────────────────────────────────────────────
    print("\n--- Module 2: SHAP Explanation ---")
    shap_vals  = explainer.shap_values(X)[0]
    base_value = float(explainer.expected_value)
    total_abs  = np.abs(shap_vals).sum() + 1e-9

    ranked = sorted(
        zip(features, shap_vals),
        key=lambda x: abs(x[1]), reverse=True
    )
    print(f"  Base value (expected): {base_value:.4f} kg CO₂/day")
    print(f"  Top 5 SHAP contributions:")
    for feat, val in ranked[:5]:
        direction = '↑ increases' if val > 0 else '↓ decreases'
        pct = abs(val) / total_abs * 100
        print(f"    {feat:<25} {direction} by {abs(val):.4f} kg/day  ({pct:.1f}%)")

    top_culprit = ranked[0][0].replace('_', ' ').title()
    print(f"  Top culprit: {top_culprit}")

    # ── 3. K-Means clustering ─────────────────────────────────────────────
    print("\n--- Module 3: K-Means Cluster ---")
    daily_kwh_est = daily_co2 / SL_EF
    cluster_vec = np.array([[
        daily_kwh_est,
        feature_values['has_ac'],    feature_values['ac_hours'],
        feature_values['ac_rooms'],  feature_values['has_heater'],
        feature_values['heater_hours'], feature_values['num_fans'],
        feature_values['fan_hours'], feature_values['has_washer'],
        feature_values['washer_loads'], feature_values['occupants'],
        feature_values['has_solar'],
    ]])
    cluster_scaled = scaler.transform(cluster_vec)
    cluster_id     = int(kmeans.predict(cluster_scaled)[0])
    cluster_name   = config['names'].get(cluster_id, f'Cluster {cluster_id}')
    recs           = config['recs'].get(cluster_id, [])

    print(f"  Cluster ID   : {cluster_id}")
    print(f"  Profile name : {cluster_name}")
    print(f"  Recommendations ({len(recs)}):")
    for i, rec in enumerate(recs, 1):
        print(f"    {i}. {rec[:80]}…" if len(rec) > 80 else f"    {i}. {rec}")

    # ── Summary ───────────────────────────────────────────────────────────
    print("\n" + "=" * 60)
    print("ALL PIPELINE TESTS PASSED ✅")
    print("=" * 60)
    print("\nNext step — copy .pkl files to backend/models/:")
    print(f"  Source : {MODELS_DIR}/")
    print("  Dest   : carbonwise-sl/backend/models/")
    print("\nCommand (run from ml/):")
    print("  cp models/*.pkl ../backend/models/")


def test_model_consistency(models):
    """
    Verify the feature list saved in features.pkl matches
    FEATURE_COLUMNS in feature_engineering.py.
    """
    print("\n" + "=" * 60)
    print("Feature Consistency Check")
    print("=" * 60)
    saved_features = models['features.pkl']
    if saved_features == FEATURE_COLUMNS:
        print(f"✅ features.pkl matches FEATURE_COLUMNS ({len(saved_features)} features)")
    else:
        print("❌ MISMATCH between features.pkl and FEATURE_COLUMNS!")
        print("   Retrain all models after editing feature_engineering.py")
        extra_saved = set(saved_features) - set(FEATURE_COLUMNS)
        extra_code  = set(FEATURE_COLUMNS) - set(saved_features)
        if extra_saved: print(f"   In pkl but not in code: {extra_saved}")
        if extra_code:  print(f"   In code but not in pkl: {extra_code}")


if __name__ == '__main__':
    models = load_all()
    test_model_consistency(models)
    test_full_pipeline(models)