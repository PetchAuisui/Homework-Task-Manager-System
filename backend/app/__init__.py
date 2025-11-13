from flask import Flask
from flask_cors import CORS
from .extensions import db, migrate
import os

def create_app():
    app = Flask(__name__)

    # Config
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-secret-key")

    # Register extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # 🔥 FIX CORS ให้ครบสมบูรณ์
    CORS(
        app,
        resources={r"/api/*": {"origins": "*"}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    )

    # Register blueprints
    from app.routes.ping_route import ping_bp
    from app.routes.auth_routes import auth_bp
    from app.routes.user_routes import user_bp

    app.register_blueprint(ping_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(user_bp, url_prefix="/api/users")

    return app


# Instance สำหรับ Docker
app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
