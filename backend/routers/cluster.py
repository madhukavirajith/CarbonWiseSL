# backend/routers/cluster.py
from fastapi import APIRouter, HTTPException
from schemas import ApplianceInput, ClusterOutput
import models_loader as ml
import numpy as np

router = APIRouter()

CLUSTER_FEATURES_ORDER = [
    "daily_kwh", "has_ac", "ac_hours",
    "has_heater", "heater_hours", "num_fans", "occupants"
]

@router.post("/cluster", response_model=ClusterOutput)
def get_cluster(data: ApplianceInput):
    """
    Identify the user's household behaviour profile using K-Means clustering.
    Returns the cluster name and personalised recommendations.
    """
    if ml.kmeans_model is None or ml.kmeans_scaler is None:
        raise HTTPException(503, "K-Means model not loaded.")

    daily_kwh = ml.estimate_daily_kwh(data)

    X_raw = np.array([[
        daily_kwh,
        data.has_ac,
        data.ac_hours,
        data.has_heater,
        data.heater_hours,
        data.num_fans,
        data.occupants,
    ]])

    X_scaled   = ml.kmeans_scaler.transform(X_raw)
    cluster_id = int(ml.kmeans_model.predict(X_scaled)[0])

    # Estimate cluster size as % (approximate)
    n_clusters = ml.kmeans_model.n_clusters
    cluster_size_pct = round(100 / n_clusters, 0)

    return ClusterOutput(
        cluster_id       = cluster_id,
        cluster_name     = ml.CLUSTER_NAMES.get(cluster_id, f"Cluster {cluster_id}"),
        cluster_icon     = ml.CLUSTER_ICONS.get(cluster_id, "🏠"),
        recommendations  = ml.CLUSTER_RECS.get(cluster_id, [
            "Review your appliance usage patterns to identify savings.",
            "Consider switching all bulbs to LED for immediate savings.",
        ]),
        cluster_size_pct = cluster_size_pct,
    )