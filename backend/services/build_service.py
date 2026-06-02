from database.db import get_db
from bson.objectid import ObjectId
from datetime import datetime
from services.compatibility_engine import CompatibilityEngine
from services.fps_engine import FPSEngine
from models.user import UserModel

class BuildService:
    @staticmethod
    def get_collection():
        return get_db()["builds"]

    @staticmethod
    def create_build(user_id, data):
        collection = BuildService.get_collection()
        
        # Calculate compatibility and FPS
        parts = data.get("parts", {})
        compat_result = CompatibilityEngine.check_compatibility(parts)
        
        fps_result = None
        if parts.get("cpu") and parts.get("gpu"):
            fps_result = FPSEngine.calculate_fps(parts["cpu"], parts["gpu"])
            
        build_data = {
            "user_id": user_id,
            "name": data.get("name", "My Build"),
            "parts": parts,
            "total_price": data.get("total_price", 0),
            "compatibility": compat_result,
            "fps_estimates": fps_result,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = collection.insert_one(build_data)
        build_data["_id"] = str(result.inserted_id)
        
        # Add to user's saved builds
        UserModel.get_collection().update_one(
            {"_id": ObjectId(user_id)},
            {"$push": {"saved_builds": build_data["_id"]}}
        )
        
        return build_data

    @staticmethod
    def get_user_builds(user_id):
        collection = BuildService.get_collection()
        cursor = collection.find({"user_id": user_id}).sort("created_at", -1)
        builds = []
        for b in cursor:
            b["id"] = str(b.pop("_id"))
            builds.append(b)
        return builds

    @staticmethod
    def delete_build(user_id, build_id):
        collection = BuildService.get_collection()
        result = collection.delete_one({"_id": ObjectId(build_id), "user_id": user_id})
        
        if result.deleted_count > 0:
            UserModel.get_collection().update_one(
                {"_id": ObjectId(user_id)},
                {"$pull": {"saved_builds": build_id}}
            )
            return True
        return False
