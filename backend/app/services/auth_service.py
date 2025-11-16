import os
from datetime import datetime
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash

from app.models import User
from app.extensions import db
from flask_jwt_extended import create_access_token

UPLOAD_FOLDER = "uploads"

class AuthService:

    @staticmethod
    def register_user(data, file):
        # ข้อมูลจาก request.form
        username = data.get("username")
        full_name = data.get("full_name")
        email = data.get("email")
        password = data.get("password")
        date_of_birth = data.get("date_of_birth")
        gender = data.get("gender")
        bio = data.get("bio")

        # ตรวจข้อมูล
        if not all([username, full_name, email, password]):
            return {"message": "กรอกข้อมูลไม่ครบ"}, 400

        # ตรวจซ้ำ username หรือ email
        if User.query.filter(
            (User.email == email) | (User.username == username)
        ).first():
            return {"message": "ชื่อผู้ใช้หรืออีเมลถูกใช้แล้ว"}, 400

        # ---- อัปโหลดรูปโปรไฟล์ ----
        profile_image = None

        if file:
            if not os.path.exists(UPLOAD_FOLDER):
                os.makedirs(UPLOAD_FOLDER)

            filename = secure_filename(file.filename)
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            file.save(filepath)
            profile_image = filename

        # ---- สร้าง user ----
        new_user = User(
            username=username,
            full_name=full_name,
            email=email,
            password_hash=generate_password_hash(password),
            date_of_birth=date_of_birth,
            gender=gender,
            bio=bio,
            profile_image=profile_image
        )

        db.session.add(new_user)
        db.session.commit()

        return {
            "message": "สมัครสมาชิกสำเร็จ",
            "user": {
                "user_id": new_user.user_id,
                "username": new_user.username,
                "full_name": new_user.full_name,
                "email": new_user.email,
                "date_of_birth": new_user.date_of_birth,
                "gender": new_user.gender,
                "bio": new_user.bio,
                "profile_image": new_user.profile_image,
                "created_at": new_user.created_at
            }
        }, 201

    # ---------------------
    # LOGIN
    # ---------------------
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

        token = create_access_token(identity=user.user_id)

        return {
            "message": "เข้าสู่ระบบสำเร็จ",
            "token": token,
            "user": {
                "user_id": user.user_id,
                "username": user.username,
                "full_name": user.full_name,
                "email": user.email,
                "role": user.role
            }
        }, 200
