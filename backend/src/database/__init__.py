"""
AgriSmart AI - database package.

Groups everything MongoDB-related in one place:
    database/connection.py  - client/connection, is_configured(), collection handles
    database/models.py      - Pydantic document schemas

Re-exported here so existing call sites can keep doing:
    from src import database as db
    db.is_configured(), db.get_users(), db.init_db(), etc.
"""

from .connection import (
    is_configured,
    get_client,
    get_db,
    ping_db,
    close_db,
    get_users,
    get_predictions,
    get_feedback,
    get_crop_recommendations,
    get_irrigation_recommendations,
    get_weather_records,
    get_sustainability_scores,
    get_chat_history,
    init_db,
    collections,
)

__all__ = [
    "is_configured",
    "get_client",
    "get_db",
    "ping_db",
    "close_db",
    "get_users",
    "get_predictions",
    "get_feedback",
    "get_crop_recommendations",
    "get_irrigation_recommendations",
    "get_weather_records",
    "get_sustainability_scores",
    "get_chat_history",
    "init_db",
    "collections",
]
