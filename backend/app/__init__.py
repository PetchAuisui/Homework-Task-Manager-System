from flask import Flask
from flask_cors import CORS
from .extensions import db, migrate
import os

def create_app():
    app = Flask(__name__)

    # โหลด config จาก environment variables
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-secret-key")

    # Register extensions
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)

    # Register blueprints
    from app.routes.ping_route import ping_bp
    app.register_blueprint(ping_bp, url_prefix="/api")

    return app


# สร้าง instance สำหรับ Docker entrypoint
app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
