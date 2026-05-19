# backend/routers/auth.py
import os
import json
import uuid
import hashlib
import logging
from datetime import datetime
from fastapi import APIRouter, HTTPException, status
from schemas import UserSignupInput, UserLoginInput, AuthResponse
from database import db

logger = logging.getLogger(__name__)
router = APIRouter()

# Local JSON database configuration (fallback when Firestore is unavailable)
LOCAL_DB_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
LOCAL_DB_PATH = os.path.join(LOCAL_DB_DIR, "users.json")

def hash_password(password: str, salt: str) -> str:
    """Hash password with salt using SHA-256."""
    return hashlib.sha256((password + salt).encode("utf-8")).hexdigest()

def load_local_users() -> dict:
    """Load users from the local JSON database file."""
    if not os.path.exists(LOCAL_DB_PATH):
        return {}
    try:
        with open(LOCAL_DB_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error loading local users: {e}")
        return {}

def save_local_users(users: dict):
    """Save users to the local JSON database file."""
    try:
        os.makedirs(LOCAL_DB_DIR, exist_ok=True)
        with open(LOCAL_DB_PATH, "w", encoding="utf-8") as f:
            json.dump(users, f, indent=4)
    except Exception as e:
        logger.error(f"Error saving local users: {e}")

@router.post("/auth/signup", response_model=AuthResponse)
def signup(data: UserSignupInput):
    """Register a new user account."""
    email = data.email.strip().lower()
    username = data.username.strip()
    
    # 1. Check if user already exists
    if db:
        try:
            # Check by email
            email_query = db.collection("users").where("email", "==", email).limit(1).get()
            if len(email_query) > 0:
                raise HTTPException(status_code=400, detail="An account with this email already exists.")
                
            # Check by username
            username_query = db.collection("users").where("username", "==", username).limit(1).get()
            if len(username_query) > 0:
                raise HTTPException(status_code=400, detail="This username is already taken.")
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Firestore signup lookup error: {e}. Falling back to local check.")
            # Fallback to local if Firestore fails mid-operation
            db_local = load_local_users()
            if email in db_local:
                raise HTTPException(status_code=400, detail="An account with this email already exists.")
            if any(u["username"].lower() == username.lower() for u in db_local.values()):
                raise HTTPException(status_code=400, detail="This username is already taken.")
    else:
        db_local = load_local_users()
        if email in db_local:
            raise HTTPException(status_code=400, detail="An account with this email already exists.")
        if any(u["username"].lower() == username.lower() for u in db_local.values()):
            raise HTTPException(status_code=400, detail="This username is already taken.")

    # 2. Create user record
    user_id = f"usr_{uuid.uuid4().hex[:12]}"
    salt = uuid.uuid4().hex
    password_hash = hash_password(data.password, salt)
    
    user_record = {
        "user_id": user_id,
        "username": username,
        "email": email,
        "password_hash": password_hash,
        "salt": salt,
        "created_at": datetime.utcnow().isoformat()
    }
    
    # 3. Save to database
    saved_in_firestore = False
    if db:
        try:
            db.collection("users").document(user_id).set(user_record)
            saved_in_firestore = True
            logger.info(f"User {username} successfully signed up in Firestore.")
        except Exception as e:
            logger.error(f"Failed to save user in Firestore: {e}. Falling back to local.")
            
    if not saved_in_firestore:
        db_local = load_local_users()
        db_local[email] = user_record
        save_local_users(db_local)
        logger.info(f"User {username} signed up locally.")

    mock_token = f"jwt_{user_id}_{uuid.uuid4().hex[:8]}"
    return AuthResponse(
        user_id=user_id,
        username=username,
        email=email,
        token=mock_token
    )

@router.post("/auth/login", response_model=AuthResponse)
def login(data: UserLoginInput):
    """Authenticate a user and return a token."""
    email = data.email.strip().lower()
    user_record = None

    # 1. Retrieve user record
    if db:
        try:
            # Query by email
            docs = db.collection("users").where("email", "==", email).limit(1).get()
            if len(docs) > 0:
                user_record = docs[0].to_dict()
        except Exception as e:
            logger.error(f"Firestore login retrieval error: {e}. Falling back to local check.")

    if not user_record:
        # Fallback to local DB
        db_local = load_local_users()
        # Direct lookup by email
        user_record = db_local.get(email)
        
        # Also check by username if not found by email
        if not user_record:
            for rec in db_local.values():
                if rec["username"].lower() == email:
                    user_record = rec
                    break

    # 2. Check credentials
    if not user_record:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email/username or password."
        )
        
    hashed_input = hash_password(data.password, user_record["salt"])
    if hashed_input != user_record["password_hash"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email/username or password."
        )

    mock_token = f"jwt_{user_id}_{uuid.uuid4().hex[:8]}" if (user_id := user_record.get("user_id")) else f"jwt_usr_{uuid.uuid4().hex[:8]}"
    return AuthResponse(
        user_id=user_record["user_id"],
        username=user_record["username"],
        email=user_record["email"],
        token=mock_token
    )
