from app.models import User
from app.extensions import db
from werkzeug.security import generate_password_hash , check_password_hash
from datetime import datetime

class AuthService:
    @staticmethod
    def register_user(data):
        username = data.get("username")
        full_name = data.get("full_name")
        email = data.get("email")
        password = data.get("password")
        date_of_birth = data.get("date_of_birth")
        gender = data.get("gender")
        education_level = data.get("education_level")
        institution_name = data.get("institution_name")
        major = data.get("major")
        bio = data.get("bio")
        profile_image = data.get("profile_image")

        # ตรวจสอบข้อมูลสำคัญ
        if not all([username, full_name, email, password]):
            return {"message": "กรอกข้อมูลไม่ครบ"}, 400

        # ตรวจสอบซ้ำ
        if User.query.filter((User.email == email) | (User.username == username)).first():
            return {"message": "ชื่อผู้ใช้หรืออีเมลถูกใช้แล้ว"}, 400

        new_user = User(
            username=username,
            full_name=full_name,
            email=email,
            password_hash=generate_password_hash(password),
            date_of_birth=date_of_birth,
            gender=gender,
            education_level=education_level,
            institution_name=institution_name,
            major=major,
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
                "email": new_user.email,
                "education_level": new_user.education_level,
                "institution_name": new_user.institution_name,
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

        return {
            "message": "เข้าสู่ระบบสำเร็จ",
            "user": {
                "user_id": user.user_id,
                "username": user.username,
                "full_name": user.full_name,
                "email": user.email,
                "role": user.role
            }
        }, 200