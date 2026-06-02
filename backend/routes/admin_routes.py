from flask import Blueprint
from controllers.admin_controller import AdminController
from middleware.auth import admin_required

admin_bp = Blueprint("admin", __name__)

admin_bp.route("/stats", methods=["GET"])(admin_required()(AdminController.get_dashboard_stats))
admin_bp.route("/users", methods=["GET"])(admin_required()(AdminController.get_users))
admin_bp.route("/users/<user_id>", methods=["DELETE"])(admin_required()(AdminController.delete_user))
