from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from config.settings import get_config
from database.db import init_db, close_db
from utils.response import error_response
from services.auth_service import bcrypt

# Import Blueprints
from routes.auth_routes import auth_bp
from routes.user_routes import user_bp
from routes.component_routes import component_bp
from routes.builder_routes import builder_bp
from routes.community_routes import community_bp
from routes.admin_routes import admin_bp

def create_app(config_class=None):
    app = Flask(__name__)
    
    # Load configuration
    if config_class is None:
        config_class = get_config()
    app.config.from_object(config_class)

    # Initialize Plugins
    CORS(app, origins=app.config.get("CORS_ORIGINS", "*"))
    jwt = JWTManager(app)
    bcrypt.init_app(app)
    limiter = Limiter(
        get_remote_address,
        app=app,
        default_limits=["200 per day", "50 per hour"],
        storage_uri="memory://"
    )

    # Initialize Database
    init_db(app)
    app.teardown_appcontext(close_db)

    # Register Error Handlers
    @app.errorhandler(404)
    def not_found(e):
        return error_response("Resource not found", status_code=404)

    @app.errorhandler(429)
    def ratelimit_handler(e):
        return error_response("Rate limit exceeded", str(e.description), status_code=429)

    @app.errorhandler(500)
    def internal_error(e):
        return error_response("Internal server error", str(e), status_code=500)

    # JWT Error handlers
    @jwt.unauthorized_loader
    def unauthorized_response(callback):
        return error_response("Missing Authorization Header", status_code=401)
        
    @jwt.invalid_token_loader
    def invalid_token_response(callback):
        return error_response("Invalid Token", status_code=401)
        
    @jwt.expired_token_loader
    def expired_token_response(jwt_header, jwt_payload):
        return error_response("Token has expired", status_code=401)

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(component_bp, url_prefix='/api/components')
    app.register_blueprint(builder_bp, url_prefix='/api/builder')
    app.register_blueprint(community_bp, url_prefix='/api/community')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    @app.route("/api/health")
    def health_check():
        return jsonify({"status": "ok", "message": "IC PC's API is running"})

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=int(app.config.get("PORT", 5000)))
