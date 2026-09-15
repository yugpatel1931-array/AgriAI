"""
AgriSmart AI - MongoDB connection and collections.

This file follows the MongoDB approach used by the team's original
database.py. It exposes the database and collection handles so existing
Flask routes can use them directly.

Environment variables:
    MONGODB_URI  - MongoDB connection string
    MONGODB_DB   - database name (default: agrismart_ai)
"""

import os
from typing import Optional

from pymongo import ASCENDING, DESCENDING, MongoClient
from pymongo.collection import Collection
from pymongo.database import Database


MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
MONGODB_DB_NAME = os.getenv("MONGODB_DB", "agrismart_ai")

_client: Optional[MongoClient] = None
_db: Optional[Database] = None


def get_client() -> MongoClient:
    """Return a shared MongoDB client."""
    global _client
    if _client is None:
        _client = MongoClient(
            MONGODB_URI,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=5000,
        )
    return _client


def get_db() -> Database:
    """Return the configured AgriSmart AI database."""
    global _db
    if _db is None:
        _db = get_client()[MONGODB_DB_NAME]
    return _db


def ping_db() -> bool:
    """Return True when MongoDB is reachable."""
    try:
        get_client().admin.command("ping")
        return True
    except Exception:
        return False


def close_db() -> None:
    """Close the shared MongoDB client."""
    global _client, _db
    if _client is not None:
        _client.close()
    _client = None
    _db = None


# Collection names. MongoDB calls these collections rather than tables.
def get_users() -> Collection:
    return get_db()["users"]


def get_predictions() -> Collection:
    return get_db()["predictions"]


def get_feedback() -> Collection:
    return get_db()["feedback"]


def get_crop_recommendations() -> Collection:
    return get_db()["crop_recommendations"]


def get_irrigation_recommendations() -> Collection:
    return get_db()["irrigation_recommendations"]


def get_weather_records() -> Collection:
    return get_db()["weather_records"]


def get_sustainability_scores() -> Collection:
    return get_db()["sustainability_scores"]


def get_chat_history() -> Collection:
    return get_db()["chat_history"]


def init_db() -> None:
    """
    Create the eight application collections (MongoDB creates collections
    lazily) and useful indexes. Safe to call repeatedly.
    """
    db = get_db()

    # Explicitly create collections when they do not exist.
    collection_names = {
        "users",
        "predictions",
        "feedback",
        "crop_recommendations",
        "irrigation_recommendations",
        "weather_records",
        "sustainability_scores",
        "chat_history",
    }

    existing = set(db.list_collection_names())
    for name in collection_names - existing:
        db.create_collection(name)

    # Authentication / user lookup.
    db["users"].create_index([("email", ASCENDING)], unique=True)

    # Prediction/history lookups.
    db["predictions"].create_index(
        [("user_id", ASCENDING), ("created_at", DESCENDING)]
    )
    db["predictions"].create_index(
        [("crop", ASCENDING), ("disease", ASCENDING)]
    )

    # Feedback.
    db["feedback"].create_index([("prediction_id", ASCENDING)])
    db["feedback"].create_index([("user_id", ASCENDING)])

    # Recommendation history.
    db["crop_recommendations"].create_index(
        [("user_id", ASCENDING), ("created_at", DESCENDING)]
    )
    db["irrigation_recommendations"].create_index(
        [("user_id", ASCENDING), ("created_at", DESCENDING)]
    )
    db["weather_records"].create_index(
        [("user_id", ASCENDING), ("fetched_at", DESCENDING)]
    )
    db["sustainability_scores"].create_index(
        [("user_id", ASCENDING), ("created_at", DESCENDING)]
    )

    # Khedut Mitr conversation history.
    db["chat_history"].create_index(
        [("user_id", ASCENDING), ("created_at", DESCENDING)]
    )


# Convenient collection handles for code that prefers:
#     from database import users, predictions, ...
# They are created lazily only after get_db() is called.
def collections() -> dict[str, Collection]:
    return {
        "users": get_users(),
        "predictions": get_predictions(),
        "feedback": get_feedback(),
        "crop_recommendations": get_crop_recommendations(),
        "irrigation_recommendations": get_irrigation_recommendations(),
        "weather_records": get_weather_records(),
        "sustainability_scores": get_sustainability_scores(),
        "chat_history": get_chat_history(),
    }
