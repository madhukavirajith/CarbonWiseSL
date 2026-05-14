import pickle
import os

MODELS_DIR = r"c:\Users\madvi\OneDrive\Desktop\CarbonWiseSL\backend\models"

def check_model(filename):
    path = os.path.join(MODELS_DIR, filename)
    if not os.path.exists(path):
        print(f"{filename} not found")
        return
    with open(path, "rb") as f:
        obj = pickle.load(f)
        print(f"--- {filename} ---")
        print(f"Type: {type(obj)}")
        if hasattr(obj, "n_features_in_"):
            print(f"n_features_in_: {obj.n_features_in_}")
        if hasattr(obj, "feature_names_in_"):
            print(f"feature_names_in_: {obj.feature_names_in_}")
        if isinstance(obj, dict):
            print(f"Keys: {obj.keys()}")

check_model("kmeans_scaler.pkl")
check_model("kmeans_model.pkl")
check_model("cluster_config.pkl")
