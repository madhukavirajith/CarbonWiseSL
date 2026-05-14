# backend/database.py
import firebase_admin
from firebase_admin import credentials, firestore
import os
import logging

logger = logging.getLogger(__name__)

# Path to your service account key file
# You should download this from Firebase Console: Project Settings > Service Accounts
SERVICE_ACCOUNT_KEY = os.path.join(os.path.dirname(__file__), "serviceAccountKey.json")

db = None

def init_firebase():
    global db
    try:
        if not firebase_admin._apps:
            if os.path.exists(SERVICE_ACCOUNT_KEY):
                cred = credentials.Certificate(SERVICE_ACCOUNT_KEY)
                firebase_admin.initialize_app(cred)
                logger.info("Firebase initialized with service account.")
            else:
                # Fallback to default credentials (useful for some environments)
                firebase_admin.initialize_app()
                logger.info("Firebase initialized with default credentials.")
        
        db = firestore.client()
    except Exception as e:
        logger.error(f"Failed to initialize Firebase: {e}")
        db = None

# Initialize immediately on import
init_firebase()
