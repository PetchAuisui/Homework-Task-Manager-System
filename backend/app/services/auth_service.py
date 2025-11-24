import os
from datetime import datetime
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash

from flask import request
from app.models.user_model import User
from app.extensions import db
from flask_jwt_extended import create_access_token

# upload/image อยู่ภายใน backend
UPLOAD_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "upload", "image"))


class AuthService:

    @staticmethod
    def register_user(data, file):
        username = data.get("username")
        full_name = data.get("full_name")
        email = data.get("email")
        password = data.get("password")
        date_of_birth = data.get("date_of_birth")
        gender = data.get("gender")
        bio = data.get("bio")

        if not all([username, full_name, email, password]):
            return {"message": "กรอกข้อมูลไม่ครบ"}, 400

        if User.query.filter(
            (User.email == email) | (User.username == username)
        ).first():
            return {"message": "ชื่อผู้ใช้หรืออีเมลถูกใช้แล้ว"}, 400

        profile_filename = None

        if file:
            os.makedirs(UPLOAD_FOLDER, exist_ok=True)

            filename = secure_filename(file.filename)
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            file.save(filepath)
            profile_filename = filename

        new_user = User(
            username=username,
            full_name=full_name,
            email=email,
            password_hash=generate_password_hash(password),
            date_of_birth=date_of_birth,
            gender=gender,
            bio=bio,
            profile_image=profile_filename
        )

        db.session.add(new_user)
        db.session.commit()

        image_url = (
            f"{request.host_url}profile_image/{profile_filename}"
            if profile_filename else None
        )

        return {
            "message": "สมัครสมาชิกสำเร็จ",
            "user": {
                "user_id": new_user.user_id,
                "username": new_user.username,
                "full_name": new_user.full_name,
                "email": new_user.email,
                "profile_image": image_url
            }
        }, 201


    @staticmethod
    def login_user(data):
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return {"message": "กรุณากรอกอีเมลและรหัสผ่าน"}, 400

        user = User.query.filter_by(email=email).first()
        if not user:
            return {"message": "ไม่พบผู้ใช้งานนี้"}, 404

        if not check_password_hash(user.password_hash, password):
            return {"message": "รหัสผ่านไม่ถูกต้อง"}, 401

        user.last_login = datetime.utcnow()
        db.session.commit()

        token = create_access_token(identity=str(user.user_id))

        image_url = (
            f"{request.host_url}profile_image/{user.profile_image}"
            if user.profile_image else None
        )

        return {
            "message": "เข้าสู่ระบบสำเร็จ",
            "token": token,
            "user": {
                "user_id": user.user_id,
                "username": user.username,
                "full_name": user.full_name,
                "email": user.email,
                "role": user.role,
                "profile_image": image_url
            }
        }, 200
