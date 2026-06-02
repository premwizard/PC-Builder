from flask import request
from flask_jwt_extended import get_jwt_identity
from services.user_service import UserService
from utils.response import success_response, error_response

class UserController:
    @staticmethod
    def get_my_profile():
        user_id = get_jwt_identity()
        result = UserService.get_profile(user_id)
        
        if "error" in result:
            return error_response(result["error"], status_code=404)
            
        return success_response("Profile retrieved successfully", data=result)

    @staticmethod
    def update_my_profile():
        user_id = get_jwt_identity()
        data = request.get_json()
        result = UserService.update_profile(user_id, data)
        
        if "error" in result:
            return error_response(result["error"], status_code=400)
            
        return success_response("Profile updated successfully", data=result)
