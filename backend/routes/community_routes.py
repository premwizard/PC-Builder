from flask import Blueprint
from flask_jwt_extended import jwt_required
from controllers.community_controller import CommunityController

community_bp = Blueprint("community", __name__)

community_bp.route("/posts", methods=["GET"])(CommunityController.get_posts)
community_bp.route("/posts", methods=["POST"])(jwt_required()(CommunityController.create_post))
community_bp.route("/posts/<post_id>/like", methods=["POST"])(jwt_required()(CommunityController.toggle_like))
