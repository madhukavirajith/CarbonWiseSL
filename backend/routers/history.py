# backend/routers/history.py
from fastapi import APIRouter, HTTPException
from schemas import HistorySaveInput
from typing import List, Dict, Any
from database import db
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

# In-memory fallback (only if Firebase fails)
_fallback_history: Dict[str, List[Dict]] = {}

@router.post("/history/save")
def save_history(data: HistorySaveInput):
    """Save a prediction to the user's emission history in Firestore."""
    uid = data.user_id
    record = {
        "prediction": data.prediction,
        "appliances": data.appliances,
        "timestamp": data.prediction.get("timestamp") or ""
    }

    if db:
        try:
            # We store records in a sub-collection 'records' under the user document
            # This makes it easy to query and scale
            db.collection("history").document(uid).collection("records").add(record)
            return {"saved": True, "provider": "firestore"}
        except Exception as e:
            logger.error(f"Firestore save error: {e}")
            # Fallback to in-memory
            if uid not in _fallback_history: _fallback_history[uid] = []
            _fallback_history[uid].append(record)
            return {"saved": True, "provider": "memory_fallback", "error": str(e)}
    else:
        if uid not in _fallback_history: _fallback_history[uid] = []
        _fallback_history[uid].append(record)
        return {"saved": True, "provider": "memory"}

@router.get("/history/{user_id}")
def get_history(user_id: str):
    """Retrieve emission history for a user from Firestore."""
    records = []
    provider = "memory"

    if db:
        try:
            docs = db.collection("history").document(user_id).collection("records") \
                     .order_by("timestamp", direction="ASCENDING").stream()
            records = [doc.to_dict() for doc in docs]
            provider = "firestore"
        except Exception as e:
            logger.error(f"Firestore fetch error: {e}")
            records = _fallback_history.get(user_id, [])
            provider = "memory_fallback"
    else:
        records = _fallback_history.get(user_id, [])

    return {
        "user_id": user_id, 
        "records": records, 
        "count": len(records),
        "provider": provider
    }

@router.delete("/history/{user_id}")
def clear_history(user_id: str):
    """Clear all history for a user."""
    if db:
        try:
            # Deleting collections in Firestore requires deleting documents individually
            docs = db.collection("history").document(user_id).collection("records").stream()
            for doc in docs:
                doc.reference.delete()
            return {"cleared": True, "provider": "firestore"}
        except Exception as e:
            logger.error(f"Firestore clear error: {e}")
            
    _fallback_history.pop(user_id, None)
    return {"cleared": True, "provider": "memory"}