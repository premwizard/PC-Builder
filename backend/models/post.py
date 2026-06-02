from database.db import get_db
from bson.objectid import ObjectId
from datetime import datetime
from models.user import UserModel

class PostModel:
    @staticmethod
    def get_collection():
        return get_db()["posts"]
        
    @staticmethod
    def create(user_id, data):
        collection = PostModel.get_collection()
        user = UserModel.find_by_id(user_id)
        if not user:
            return {"error": "User not found"}
            
        post_data = {
            "user_id": user_id,
            "author": user.get("username", "Anonymous"),
            "avatar": user.get("avatar", ""),
            "title": data.get("title", "My Build"),
            "build_id": data.get("build_id"),
            "description": data.get("description", ""),
            "likes": 0,
            "liked_by": [],
            "comments": 0,
            "created_at": datetime.utcnow()
        }
        
        result = collection.insert_one(post_data)
        post_data["_id"] = str(result.inserted_id)
        return post_data

    @staticmethod
    def get_all(sort_by="latest"):
        collection = PostModel.get_collection()
        
        sort_query = ("created_at", -1)
        if sort_by == "trending":
            sort_query = ("likes", -1)
            
        cursor = collection.find().sort(sort_query[0], sort_query[1]).limit(50)
        posts = []
        for p in cursor:
            p["id"] = str(p.pop("_id"))
            posts.append(p)
        return posts

    @staticmethod
    def like_post(post_id, user_id):
        collection = PostModel.get_collection()
        post = collection.find_one({"_id": ObjectId(post_id)})
        if not post:
            return False
            
        if user_id in post.get("liked_by", []):
            # Unlike
            collection.update_one(
                {"_id": ObjectId(post_id)},
                {"$inc": {"likes": -1}, "$pull": {"liked_by": user_id}}
            )
        else:
            # Like
            collection.update_one(
                {"_id": ObjectId(post_id)},
                {"$inc": {"likes": 1}, "$push": {"liked_by": user_id}}
            )
        return True
