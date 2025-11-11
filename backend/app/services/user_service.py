from app.models import User
from app.extensions import db
from datetime import datetime

class UserService:
    @staticmethod
    def get_user_profile(user_id):
        user = User.query.get(user_id)
        if not user:
            return {"message": "ไม่พบผู้ใช้"}, 404

        return {
            "user_id": user.user_id,
            "username": user.username,
            "full_name": user.full_name,
            "email": user.email,
            "date_of_birth": user.date_of_birth.isoformat() if user.date_of_birth else None,
            "gender": user.gender,
            "education_level": user.education_level,
            "institution_name": user.institution_name,
            "major": user.major,
            "bio": user.bio,
            "profile_image": user.profile_image,
            "role": user.role,
            "theme_preference": user.theme_preference,
        }, 200


    @staticmethod
    def update_user_profile(user_id, data):
        user = User.query.get(user_id)
        if not user:
            return {"message": "ไม่พบผู้ใช้"}, 404

        for field in [
            "full_name", "date_of_birth", "gender", "education_level",
            "institution_name", "major", "bio", "profile_image", "theme_preference"
        ]:
            if field in data:
                setattr(user, field, data[field])

        db.session.commit()
        return {"message": "อัปเดตข้อมูลโปรไฟล์สำเร็จ"}, 200
