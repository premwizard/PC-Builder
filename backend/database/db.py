from pymongo import MongoClient
from flask import g
import os

_client = None

def init_db(app):
    global _client
    if not _client:
        _client = MongoClient(app.config["MONGO_URI"])
        
        # Test connection
        try:
            _client.admin.command('ping')
            app.logger.info("Successfully connected to MongoDB!")
        except Exception as e:
            app.logger.error(f"MongoDB connection failed: {e}")

def get_db():
    if _client is None:
        raise Exception("Database client not initialized")
    # Parse DB name from URI or default to 'icpcs'
    db_name = os.getenv("MONGO_URI", "").split("/")[-1].split("?")[0]
    if not db_name or db_name == "mongodb:":
        db_name = "icpcs"
    return _client[db_name]

def close_db(e=None):
    # PyMongo handles connection pooling automatically, 
    # but we can implement cleanup if needed
    pass
