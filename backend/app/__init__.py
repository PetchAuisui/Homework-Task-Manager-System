import os
from flask import Flask, send_from_directory
from flask_cors import CORS

from app.extensions import db, migrate, jwt


def create_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-secret-key")
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-secret-key")

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    CORS(
        app,
        resources={r"/api/*": {"origins": "*"}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    )

    from app.routes.ping_route import ping_bp
    from app.routes.auth_routes import auth_bp
    from app.routes.user_routes import user_bp

    app.register_blueprint(ping_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(user_bp, url_prefix="/api/users")

    @app.route('/profile_image/<filename>')
    def serve_profile_image(filename):

        # ตำแหน่งจริงของโฟลเดอร์ upload/image
        upload_dir = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "..", "upload", "image")
        )

        return send_from_directory(upload_dir, filename)

    return app


# Instance สำหรับ Docker / Gunicorn
app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
