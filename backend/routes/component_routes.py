from flask import Blueprint
from controllers.component_controller import ComponentController
from middleware.auth import admin_required

component_bp = Blueprint("components", __name__)

# Public routes
component_bp.route("/", methods=["GET"])(ComponentController.get_all)
component_bp.route("/<comp_id>", methods=["GET"])(ComponentController.get_one)

# Admin routes
component_bp.route("/", methods=["POST"])(admin_required()(ComponentController.create))
component_bp.route("/<comp_id>", methods=["PUT"])(admin_required()(ComponentController.update))
component_bp.route("/<comp_id>", methods=["DELETE"])(admin_required()(ComponentController.delete))
