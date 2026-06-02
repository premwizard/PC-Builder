from datetime import datetime
from bson.objectid import ObjectId
from database.db import get_db

class UserModel:
    @staticmethod
    def get_collection():
        return get_db()["users"]

    @staticmethod
    def create_user(user_data):
        collection = UserModel.get_collection()
        user_data["created_at"] = datetime.utcnow()
        user_data["saved_builds"] = []
        user_data["wishlist"] = []
        # Role is USER by default unless explicitly set to ADMIN in DB
        user_data["role"] = user_data.get("role", "USER")
        
        result = collection.insert_one(user_data)
        user_data["_id"] = str(result.inserted_id)
        return user_data

    @staticmethod
    def find_by_email(email):
        collection = UserModel.get_collection()
        return collection.find_one({"email": email})

    @staticmethod
    def find_by_id(user_id):
        collection = UserModel.get_collection()
        try:
            return collection.find_one({"_id": ObjectId(user_id)})
        except:
            return None

    @staticmethod
    def format_user(user):
        """Removes password and formats _id to string for JSON serialization"""
        if not user: return None
        user["id"] = str(user.pop("_id"))
        user.pop("password", None)
        return user
