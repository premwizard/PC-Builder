from flask import Blueprint
from flask_jwt_extended import jwt_required
from controllers.user_controller import UserController

user_bp = Blueprint("users", __name__)

user_bp.route("/me", methods=["GET"])(jwt_required()(UserController.get_my_profile))
user_bp.route("/me", methods=["PUT"])(jwt_required()(UserController.update_my_profile))
