from flask import request
from services.auth_service import AuthService
from utils.response import success_response, error_response

class AuthController:
    @staticmethod
    def register():
        data = request.get_json()
        result = AuthService.register_user(data)
        
        if "error" in result:
            return error_response(result["error"], status_code=400)
            
        return success_response("User registered successfully", data=result, status_code=201)

    @staticmethod
    def login():
        data = request.get_json()
        result = AuthService.login_user(data)
        
        if "error" in result:
            return error_response(result["error"], status_code=401)
            
        return success_response("Login successful", data=result)
