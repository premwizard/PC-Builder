from flask import Blueprint
from flask_jwt_extended import jwt_required
from controllers.builder_controller import BuilderController

builder_bp = Blueprint("builder", __name__)

# Protected endpoints for saving/retrieving builds
builder_bp.route("/", methods=["POST"])(jwt_required()(BuilderController.save_build))
builder_bp.route("/", methods=["GET"])(jwt_required()(BuilderController.get_my_builds))
builder_bp.route("/<build_id>", methods=["DELETE"])(jwt_required()(BuilderController.delete_build))

# Public utility endpoints
builder_bp.route("/fps-estimate", methods=["POST"])(BuilderController.estimate_fps)
builder_bp.route("/compatibility", methods=["POST"])(BuilderController.check_compatibility)
