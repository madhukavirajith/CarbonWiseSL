# ml/scripts/train_xgboost.py
"""
Trains the XGBoost regression model on the Sri Lankan appliance survey data.
Saves xgboost_model.pkl, city_encoder.pkl, and features.pkl to ml/models/.

Run from ml/scripts/:
    python train_xgboost.py
"""

import os
import sys
import pickle
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')   # non-interactive backend for Colab / headless
import matplotlib.pyplot as plt

import xgboost as xgb
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

# Allow running from any working directory
sys.path.insert(0, os.path.dirname(__file__))
from data_loader         import load_survey_data
from feature_engineering import engineer_features, FEATURE_COLUMNS

MODELS_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')
os.makedirs(MODELS_DIR, exist_ok=True)


# ─────────────────────────────────────────────────────────────────────────────
def train(df):
    print("\n" + "=" * 60)
    print("XGBoost Training — CarbonWise SL")
    print("=" * 60)

    # Feature engineering
    X, y, city_encoder = engineer_features(df, fit_encoder=True)

    # Train / test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42
    )
    print(f"\nTrain: {len(X_train)} rows | Test: {len(X_test)} rows")

    # Hyperparameter grid
    param_grid = {
        'n_estimators':     [100, 200, 300],
        'max_depth':        [3, 5, 7],
        'learning_rate':    [0.05, 0.1, 0.2],
        'subsample':        [0.8, 1.0],
        'colsample_bytree': [0.8, 1.0],
    }

    base_model = xgb.XGBRegressor(
        objective='reg:squarederror',
        random_state=42,
        verbosity=0,
        n_jobs=-1,
    )

    print("\nRunning GridSearchCV (this takes 1–3 minutes)…")
    grid_search = GridSearchCV(
        estimator=base_model,
        param_grid=param_grid,
        cv=5,
        scoring='r2',
        n_jobs=-1,
        verbose=1,
    )
    grid_search.fit(X_train, y_train)
    best_model = grid_search.best_estimator_

    print(f"\nBest params: {grid_search.best_params_}")

    # Evaluation
    y_pred = best_model.predict(X_test)
    r2   = r2_score(y_test, y_pred)
    mae  = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    mape = np.mean(np.abs((y_test - y_pred) / (y_test + 1e-9))) * 100

    print("\n--- Test Set Metrics ---")
    print(f"R²   : {r2:.4f}   (target ≥ 0.85)")
    print(f"MAE  : {mae:.4f}  kg CO₂/day  (target ≤ 0.10)")
    print(f"RMSE : {rmse:.4f} kg CO₂/day")
    print(f"MAPE : {mape:.2f}%")

    if r2 >= 0.85:
        print("\n✅ R² target MET")
    else:
        print("\n❌ R² below target — collect more survey responses and retrain")

    # 5-fold CV on full dataset
    cv_scores = cross_val_score(best_model, X, y, cv=5, scoring='r2')
    print(f"\n5-Fold CV R²: {[round(s,4) for s in cv_scores]}")
    print(f"Mean CV R²  : {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")

    # Feature importance chart
    importances = pd.Series(
        best_model.feature_importances_, index=FEATURE_COLUMNS
    ).sort_values(ascending=True).tail(15)

    plt.figure(figsize=(9, 6))
    importances.plot(kind='barh', color='#0D7680')
    plt.xlabel('Importance Score')
    plt.title('XGBoost Feature Importance — CarbonWise SL')
    plt.tight_layout()
    chart_path = os.path.join(MODELS_DIR, 'feature_importance.png')
    plt.savefig(chart_path, dpi=150)
    plt.close()
    print(f"\nFeature importance chart saved: {chart_path}")

    # Actual vs predicted scatter
    plt.figure(figsize=(6, 6))
    plt.scatter(y_test, y_pred, alpha=0.6, color='#0D7680', s=40)
    lim = [min(y_test.min(), y_pred.min()) * 0.95,
           max(y_test.max(), y_pred.max()) * 1.05]
    plt.plot(lim, lim, 'r--', lw=1.5)
    plt.xlabel('Actual CO₂ (kg/day)')
    plt.ylabel('Predicted CO₂ (kg/day)')
    plt.title(f'Actual vs Predicted  —  R² = {r2:.4f}')
    plt.tight_layout()
    scatter_path = os.path.join(MODELS_DIR, 'actual_vs_predicted.png')
    plt.savefig(scatter_path, dpi=150)
    plt.close()
    print(f"Scatter chart saved: {scatter_path}")

    return best_model, city_encoder, {
        'r2': r2, 'mae': mae, 'rmse': rmse,
        'cv_mean': float(cv_scores.mean()),
        'cv_std':  float(cv_scores.std()),
        'best_params': grid_search.best_params_,
    }


def save_models(model, city_encoder):
    files = {
        'xgboost_model.pkl': model,
        'city_encoder.pkl':  city_encoder,
        'features.pkl':      FEATURE_COLUMNS,
    }
    for name, obj in files.items():
        path = os.path.join(MODELS_DIR, name)
        with open(path, 'wb') as f:
            pickle.dump(obj, f)
        print(f"Saved: {path}")

    # Quick load verification
    with open(os.path.join(MODELS_DIR, 'xgboost_model.pkl'), 'rb') as f:
        loaded = pickle.load(f)
    print(f"\n✅ Verification: model loaded OK — type = {type(loaded).__name__}")


if __name__ == '__main__':
    df = load_survey_data()
    model, encoder, metrics = train(df)
    save_models(model, encoder)
    print(f"\nFinal: R²={metrics['r2']:.4f}  MAE={metrics['mae']:.4f}")
    print("XGBoost training complete!")