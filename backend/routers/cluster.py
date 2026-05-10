# backend/routers/cluster.py
from fastapi import APIRouter
from schemas import ApplianceInput, ClusterOutput
import models_loader as ml
import numpy as np

router = APIRouter()

@router.post('/cluster', response_model=ClusterOutput)
def get_cluster(data: ApplianceInput):
    """
    Identify which household behaviour profile the user belongs to,
    and return personalised recommendations for that profile.
    """
    # Build cluster feature vector
    # Calculate daily_kwh estimate from appliances
    daily_kwh = (
        data.has_ac * data.ac_hours * 1.5 +
        data.has_fridge * 24 * 0.15 +
        data.has_heater * data.heater_hours * 2.0 +
        data.num_fans * data.fan_hours * 0.075 +
        data.num_tvs * data.tv_hours * 0.1 +
        data.has_washer * data.washer_loads * 0.5 / 7 +
        data.has_computer * data.computer_hours * 0.065
    )
    X_cluster = np.array([[
        daily_kwh, data.has_ac, data.ac_hours,
        data.has_heater, data.heater_hours,
        data.num_fans, data.occupants
    ]])
    
    # Scale and predict cluster
    X_scaled = ml.kmeans_scaler.transform(X_cluster)
    cluster_id = int(ml.kmeans_model.predict(X_scaled)[0])
    
    return ClusterOutput(
        cluster_id=cluster_id,
        cluster_name=ml.CLUSTER_NAMES.get(cluster_id, 'General User'),
        recommendations=ml.CLUSTER_RECS.get(cluster_id, [])
    )