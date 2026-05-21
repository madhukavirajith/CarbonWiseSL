# ml/scripts/train_kmeans.py
"""
Trains the K-Means clustering model for household behaviour profiling.
Saves kmeans_model.pkl, kmeans_scaler.pkl, and cluster_config.pkl to ml/models/.

Run from ml/scripts/:
    python train_kmeans.py
"""

import os
import sys
import pickle
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score

# Resolve paths safely for local execution and Google Colab
if '__file__' in globals():
    base_dir = os.path.dirname(os.path.abspath(__file__))
else:
    base_dir = os.getcwd()

# Allow running from any working directory
sys.path.insert(0, base_dir)
from data_loader import load_survey_data

MODELS_DIR = os.path.join(base_dir, '..', 'models') if '__file__' in globals() else os.path.join(base_dir, 'models')
os.makedirs(MODELS_DIR, exist_ok=True)

# ── Features used for clustering ──────────────────────────────────────────
CLUSTER_FEATURES = [
    'daily_kwh_raw', 'has_ac', 'ac_hours', 'ac_rooms',
    'has_heater', 'heater_hours', 'num_fans', 'fan_hours',
    'has_washer', 'washer_loads', 'occupants', 'has_solar',
]

# ── Cluster names and recommendations ─────────────────────────────────────
# Update these after reading the cluster_summary printout below
CLUSTER_NAMES = {
    0: 'Heavy AC User',
    1: 'Energy Efficient Household',
    2: 'High Occupancy Household',
}

CLUSTER_ICONS = {
    0: '❄️',
    1: '🌿',
    2: '👨‍👩‍👧‍👦',
}

CLUSTER_RECOMMENDATIONS = {
    0: [
        'Your AC is your biggest emission source — setting it to 26°C instead of 22°C cuts AC emissions by up to 30%.',
        'Use a sleep timer so your AC turns off automatically 30 minutes after you sleep.',
        'Consider upgrading to an inverter AC — it uses 40% less electricity than a non-inverter model.',
    ],
    1: [
        'Your household is already energy-efficient. Focus on replacing any remaining old bulbs with LED.',
        'Check your refrigerator door seals — worn seals waste up to 15% more electricity continuously.',
        'Shift your washing machine to off-peak hours (before 6 PM or after 10 PM) to benefit from lower CEB tariff rates.',
    ],
    2: [
        'With more occupants, standby power from multiple devices adds up — unplug chargers when not in use.',
        'A rooftop solar installation would give your household strong financial returns given your high consumption level.',
        'Coordinate heavy appliance use — avoid running the washing machine and water heater at the same time.',
    ],
}


def find_best_k(X_scaled, k_range=range(2, 9)):
    """Elbow method + silhouette analysis to find optimal K."""
    inertias    = []
    silhouettes = []

    for k in k_range:
        km = KMeans(n_clusters=k, random_state=42, n_init=10)
        km.fit(X_scaled)
        inertias.append(km.inertia_)
        silhouettes.append(silhouette_score(X_scaled, km.labels_))

    # Plot
    fig, axes = plt.subplots(1, 2, figsize=(12, 4))
    axes[0].plot(list(k_range), inertias, 'bo-', lw=2, ms=7)
    axes[0].set_xlabel('K'); axes[0].set_ylabel('Inertia')
    axes[0].set_title('Elbow Method'); axes[0].grid(alpha=0.3)

    axes[1].plot(list(k_range), silhouettes, 'ro-', lw=2, ms=7)
    axes[1].set_xlabel('K'); axes[1].set_ylabel('Silhouette Score')
    axes[1].set_title('Silhouette Analysis'); axes[1].grid(alpha=0.3)

    plt.tight_layout()
    path = os.path.join(MODELS_DIR, 'kmeans_elbow.png')
    plt.savefig(path, dpi=150); plt.close()
    print(f"Elbow chart saved: {path}")

    best_k = list(k_range)[silhouettes.index(max(silhouettes))]
    print(f"\nSilhouette scores: {[round(s, 3) for s in silhouettes]}")
    print(f"Best K (highest silhouette): {best_k}")
    return best_k


def train(df, best_k=None):
    print("\n" + "=" * 60)
    print("K-Means Training — CarbonWise SL")
    print("=" * 60)

    # Build feature matrix for clustering
    available = [c for c in CLUSTER_FEATURES if c in df.columns]
    missing   = [c for c in CLUSTER_FEATURES if c not in df.columns]
    if missing:
        print(f"Warning — filling missing columns with 0: {missing}")
        for col in missing:
            df[col] = 0

    X = df[CLUSTER_FEATURES].fillna(0).values
    print(f"\nCluster feature matrix: {X.shape}")

    # Scale
    scaler   = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    print("StandardScaler applied.")

    # Find best K if not provided
    if best_k is None:
        best_k = find_best_k(X_scaled)
    print(f"\nUsing K = {best_k}")

    # Train final model
    kmeans = KMeans(n_clusters=best_k, random_state=42, n_init=10)
    kmeans.fit(X_scaled)

    final_sil = silhouette_score(X_scaled, kmeans.labels_)
    print(f"Final silhouette score: {final_sil:.4f}  (target > 0.30)")

    df = df.copy()
    df['cluster'] = kmeans.labels_

    # Cluster summary — read this to verify/rename cluster labels
    summary_cols = [c for c in ['daily_kwh_raw', 'has_ac', 'ac_hours',
                                 'heater_hours', 'occupants',
                                 'ceb_units', 'daily_co2_kg'] if c in df.columns]
    summary = df.groupby('cluster')[summary_cols].mean().round(2)
    summary['count'] = df.groupby('cluster').size()
    print("\n--- Cluster Summary (use this to name each cluster) ---")
    print(summary.to_string())
    print("\nCurrent cluster names:")
    for k, v in CLUSTER_NAMES.items():
        print(f"  Cluster {k}: {v}")
    print("\nUpdate CLUSTER_NAMES in this file if needed, then rerun.")

    # Scatter visualisation
    if 'daily_kwh_raw' in df.columns and 'daily_co2_kg' in df.columns:
        plt.figure(figsize=(8, 5))
        colors = ['#0D7680', '#1A7A4A', '#7B3F9E', '#C8932A', '#C0392B']
        for cid in range(best_k):
            mask = df['cluster'] == cid
            label = CLUSTER_NAMES.get(cid, f'Cluster {cid}')
            plt.scatter(
                df.loc[mask, 'daily_kwh_raw'],
                df.loc[mask, 'daily_co2_kg'],
                label=label, alpha=0.7, s=50,
                color=colors[cid % len(colors)],
            )
        plt.xlabel('Daily kWh'); plt.ylabel('Daily CO2 (kg)')
        plt.title('K-Means Clusters - CarbonWise SL')
        plt.legend(); plt.grid(alpha=0.3); plt.tight_layout()
        cluster_path = os.path.join(MODELS_DIR, 'kmeans_clusters.png')
        plt.savefig(cluster_path, dpi=150); plt.close()
        print(f"\nCluster chart saved: {cluster_path}")

    return kmeans, scaler, summary


def save_models(kmeans, scaler):
    cluster_config = {
        'names':    CLUSTER_NAMES,
        'icons':    CLUSTER_ICONS,
        'recs':     CLUSTER_RECOMMENDATIONS,
        'features': CLUSTER_FEATURES,
    }
    files = {
        'kmeans_model.pkl':   kmeans,
        'kmeans_scaler.pkl':  scaler,
        'cluster_config.pkl': cluster_config,
    }
    for name, obj in files.items():
        path = os.path.join(MODELS_DIR, name)
        with open(path, 'wb') as f:
            pickle.dump(obj, f)
        print(f"Saved: {path}")

    print("\n[OK] K-Means models saved.")


if __name__ == '__main__':
    df = load_survey_data()
    kmeans, scaler, summary = train(df)
    save_models(kmeans, scaler)
    print("K-Means training complete!")