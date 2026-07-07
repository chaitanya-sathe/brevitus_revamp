"""JWT auth utilities for a single admin user (username/password)."""
import os
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
from fastapi import HTTPException, Header, Depends

JWT_ALGO = "HS256"
ACCESS_TTL_HOURS = 12


def _secret() -> str:
    return os.environ["JWT_SECRET"]


def hash_password(p: str) -> str:
    return bcrypt.hashpw(p.encode(), bcrypt.gensalt()).decode()


def verify_password(p: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(p.encode(), hashed.encode())
    except Exception:
        return False


def create_access_token(username: str) -> str:
    payload = {
        "sub": username,
        "role": "admin",
        "type": "access",
        "exp": datetime.now(timezone.utc) + timedelta(hours=ACCESS_TTL_HOURS),
    }
    return jwt.encode(payload, _secret(), algorithm=JWT_ALGO)


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, _secret(), algorithms=[JWT_ALGO])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


async def require_admin(authorization: str = Header(default="")) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization[7:]
    payload = decode_token(token)
    if payload.get("role") != "admin" or payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Not authorized")
    return payload


async def seed_admin(db) -> None:
    """Create or update the admin user (idempotent)."""
    username = os.environ["ADMIN_USERNAME"]
    password = os.environ["ADMIN_PASSWORD"]
    existing = await db.admins.find_one({"username": username}, {"_id": 0})
    if existing is None:
        await db.admins.insert_one({
            "username": username,
            "password_hash": hash_password(password),
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
    elif not verify_password(password, existing.get("password_hash", "")):
        await db.admins.update_one(
            {"username": username},
            {"$set": {"password_hash": hash_password(password)}},
        )
