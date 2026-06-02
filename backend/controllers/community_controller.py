from flask import request
from flask_jwt_extended import get_jwt_identity
from models.post import PostModel
from utils.response import success_response, error_response

class CommunityController:
    @staticmethod
    def create_post():
        user_id = get_jwt_identity()
        data = request.get_json()
        
        result = PostModel.create(user_id, data)
        if "error" in result:
            return error_response(result["error"], status_code=400)
            
        return success_response("Post created successfully", data=result, status_code=201)

    @staticmethod
    def get_posts():
        sort_by = request.args.get("sort", "latest")
        posts = PostModel.get_all(sort_by)
        return success_response("Posts retrieved", data=posts)

    @staticmethod
    def toggle_like(post_id):
        user_id = get_jwt_identity()
        success = PostModel.like_post(post_id, user_id)
        if success:
            return success_response("Like toggled")
        return error_response("Post not found", status_code=404)
