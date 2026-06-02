from models.user import UserModel
from bson.objectid import ObjectId

class UserService:
    @staticmethod
    def get_profile(user_id):
        user = UserModel.find_by_id(user_id)
        if not user:
            return {"error": "User not found"}
        return UserModel.format_user(user)

    @staticmethod
    def update_profile(user_id, data):
        collection = UserModel.get_collection()
        update_data = {}
        if "username" in data: update_data["username"] = data["username"]
        if "avatar" in data: update_data["avatar"] = data["avatar"]
        
        if not update_data:
            return {"error": "No valid data provided"}
            
        result = collection.update_one({"_id": ObjectId(user_id)}, {"$set": update_data})
        if result.modified_count == 0:
            return {"error": "User not updated"}
            
        return UserService.get_profile(user_id)
