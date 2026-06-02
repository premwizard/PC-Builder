from database.db import get_db
from models.user import UserModel
from models.component import ComponentModel
from models.post import PostModel
from utils.response import success_response, error_response
from bson.objectid import ObjectId

class AdminController:
    @staticmethod
    def get_dashboard_stats():
        db = get_db()
        stats = {
            "total_users": db.users.count_documents({}),
            "total_components": db.components.count_documents({}),
            "total_builds": db.builds.count_documents({}),
            "total_posts": db.posts.count_documents({})
        }
        return success_response("Admin stats retrieved", data=stats)

    @staticmethod
    def get_users():
        db = get_db()
        users = []
        for user in db.users.find().sort("created_at", -1):
            users.append(UserModel.format_user(user))
        return success_response("Users retrieved", data=users)

    @staticmethod
    def delete_user(user_id):
        db = get_db()
        result = db.users.delete_one({"_id": ObjectId(user_id)})
        if result.deleted_count > 0:
            return success_response("User deleted successfully")
        return error_response("User not found", status_code=404)
