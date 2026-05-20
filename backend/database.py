# backend/database.py
import firebase_admin
from firebase_admin import credentials, firestore
import os
import logging

logger = logging.getLogger(__name__)

# Path to your service account key file
SERVICE_ACCOUNT_KEY = os.path.join(os.path.dirname(__file__), "serviceAccountKey.json")
RENDER_SECRET_KEY = "/etc/secrets/serviceAccountKey.json"

db = None

def init_firebase():
    global db
    try:
        if not firebase_admin._apps:
            # 1. Check local development path
            if os.path.exists(SERVICE_ACCOUNT_KEY):
                cred = credentials.Certificate(SERVICE_ACCOUNT_KEY)
                firebase_admin.initialize_app(cred)
                logger.info("Firebase initialized with local service account.")
            # 2. Check Render secret files path
            elif os.path.exists(RENDER_SECRET_KEY):
                cred = credentials.Certificate(RENDER_SECRET_KEY)
                firebase_admin.initialize_app(cred)
                logger.info("Firebase initialized with Render secret file.")
            # 3. Check environment variable containing JSON content
            elif os.getenv("FIREBASE_CREDENTIALS"):
                import json
                cred_dict = json.loads(os.getenv("FIREBASE_CREDENTIALS"))
                cred = credentials.Certificate(cred_dict)
                firebase_admin.initialize_app(cred)
                logger.info("Firebase initialized with environment credentials.")
            else:
                # If we are on Google Cloud Platform, default credentials can be used.
                # On Render/other hosting, default init will hang trying to query GCP metadata.
                if os.getenv("GOOGLE_APPLICATION_CREDENTIALS") or os.getenv("GAE_ENV"):
                    firebase_admin.initialize_app()
                    logger.info("Firebase initialized with GCP default credentials.")
                else:
                    logger.warning("No Firebase credentials found. Running in local DB/memory fallback mode.")
                    db = None
                    return
        
        db = firestore.client()
    except Exception as e:
        logger.error(f"Failed to initialize Firebase: {e}")
        db = None

# Initialize immediately on import
init_firebase()
