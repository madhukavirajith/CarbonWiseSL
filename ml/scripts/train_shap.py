# ml/scripts/train_shap.py
"""
Builds the SHAP TreeExplainer on top of the trained XGBoost model.
Saves shap_explainer.pkl to ml/models/.

MUST run train_xgboost.py first.

Run from ml/scripts/:
    python train_shap.py
"""

import os
import sys
import pickle
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

# Auto-install SHAP if missing (useful for Google Colab environments)
try:
    import shap
except ImportError:
    import subprocess
    print("SHAP package not found. Installing SHAP...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "shap"])
    import shap

# Resolve paths safely for local execution and Google Colab
if '__file__' in globals():
    base_dir = os.path.dirname(os.path.abspath(__file__))
else:
    base_dir = os.getcwd()

# Allow running from any working directory
sys.path.insert(0, base_dir)
from data_loader         import load_survey_data
from feature_engineering import engineer_features, FEATURE_COLUMNS

MODELS_DIR = os.path.join(base_dir, '..', 'models') if '__file__' in globals() else os.path.join(base_dir, 'models')


def _load(filename):
    path = os.path.join(MODELS_DIR, filename)
    if not os.path.exists(path):
        raise FileNotFoundError(
            f"{filename} not found in {MODELS_DIR}.\n"
            f"Run train_xgboost.py first."
        )
    with open(path, 'rb') as f:
        return pickle.load(f)


def build_shap_explainer():
    print("\n" + "=" * 60)
    print("SHAP Explainer Build - CarbonWise SL")
    print("=" * 60)

    # ── Load trained XGBoost model ────────────────────────────────────────
    print("\nStep 1 - Loading trained XGBoost model...")
    xgb_model    = _load('xgboost_model.pkl')
    city_encoder = _load('city_encoder.pkl')
    print(f"Model type : {type(xgb_model).__name__}")

    # ── Load data ─────────────────────────────────────────────────────────
    print("\nStep 2 - Loading survey data...")
    df = load_survey_data()
    X, y, _ = engineer_features(df, fit_encoder=False, city_encoder=city_encoder)
    print(f"Data shape : {X.shape}")

    # ── Build TreeExplainer ───────────────────────────────────────────────
    print("\nStep 3 - Building SHAP TreeExplainer...")
    # TreeExplainer is exact (not approximate) for XGBoost tree ensembles
    explainer = shap.TreeExplainer(xgb_model)
    expected_val = explainer.expected_value
    if isinstance(expected_val, (np.ndarray, list)):
        expected_val = float(expected_val[0])
    else:
        expected_val = float(expected_val)
    print(f"Base value (expected prediction): {expected_val:.4f} kg CO2/day")

    # ── Test on sample rows ───────────────────────────────────────────────
    print("\nStep 4 - Testing SHAP on 10 sample rows...")
    shap_values = explainer.shap_values(X.iloc[:10])
    print(f"SHAP values shape : {shap_values.shape}")

    # Mean absolute SHAP — shows which features matter most overall
    mean_abs = np.abs(shap_values).mean(axis=0)
    ranked = sorted(
        zip(FEATURE_COLUMNS, mean_abs),
        key=lambda x: x[1], reverse=True
    )
    print("\nTop 10 features by mean |SHAP| value:")
    for feat, val in ranked[:10]:
        print(f"  {feat:<30} {val:.5f}")

    # ── Generate summary plot ─────────────────────────────────────────────
    print("\nStep 5 - Generating SHAP summary plot...")
    shap_all = explainer.shap_values(X)

    plt.figure(figsize=(10, 7))
    shap.summary_plot(
        shap_all, X,
        feature_names=FEATURE_COLUMNS,
        show=False,
    )
    plt.title('SHAP Summary — CarbonWise SL XGBoost')
    plt.tight_layout()
    summary_path = os.path.join(MODELS_DIR, 'shap_summary.png')
    plt.savefig(summary_path, dpi=150, bbox_inches='tight')
    plt.close()
    print(f"SHAP summary plot saved: {summary_path}")

    # Waterfall for first sample
    explanation = explainer(X.iloc[:1])
    plt.figure(figsize=(10, 6))
    shap.plots.waterfall(explanation[0], show=False)
    plt.title('SHAP Waterfall — Sample Household')
    plt.tight_layout()
    waterfall_path = os.path.join(MODELS_DIR, 'shap_waterfall_sample.png')
    plt.savefig(waterfall_path, dpi=150, bbox_inches='tight')
    plt.close()
    print(f"SHAP waterfall sample saved: {waterfall_path}")

    # ── Save explainer ────────────────────────────────────────────────────
    print("\nStep 6 - Saving SHAP explainer...")
    save_path = os.path.join(MODELS_DIR, 'shap_explainer.pkl')
    with open(save_path, 'wb') as f:
        pickle.dump(explainer, f)
    print(f"Saved: {save_path}")

    # Verify it loads and runs
    with open(save_path, 'rb') as f:
        loaded = pickle.load(f)
    test_vals = loaded.shap_values(X.iloc[:1])
    print(f"\n[OK] Verification: explainer loads OK - SHAP values sum = {test_vals.sum():.4f}")

    return explainer


if __name__ == '__main__':
    build_shap_explainer()
    print("\nSHAP training complete!")