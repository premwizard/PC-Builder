from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from models.user import UserModel
import re

bcrypt = Bcrypt()

class AuthService:
    @staticmethod
    def register_user(data):
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        # Validation
        if not username or not email or not password:
            return {"error": "Username, email, and password are required"}
            
        if UserModel.find_by_email(email):
            return {"error": "Email already registered"}
            
        # Optional: Email format validation
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            return {"error": "Invalid email format"}

        # Hash password
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        
        user_data = {
            "username": username,
            "email": email,
            "password": hashed_password,
            "avatar": data.get("avatar", f"https://api.dicebear.com/7.x/avataaars/svg?seed={username}")
        }
        
        new_user = UserModel.create_user(user_data)
        
        # Create token
        access_token = create_access_token(identity=new_user["_id"], additional_claims={"role": new_user["role"]})
        
        return {
            "user": UserModel.format_user(new_user),
            "token": access_token
        }

    @staticmethod
    def login_user(data):
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return {"error": "Email and password are required"}

        user = UserModel.find_by_email(email)
        
        if not user or not bcrypt.check_password_hash(user["password"], password):
            return {"error": "Invalid email or password"}
            
        # Create token
        access_token = create_access_token(identity=str(user["_id"]), additional_claims={"role": user["role"]})
        
        return {
            "user": UserModel.format_user(user),
            "token": access_token
        }
