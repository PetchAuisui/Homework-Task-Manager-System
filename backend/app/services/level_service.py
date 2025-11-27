from app.extensions import db
from app.models.education_level import EducationLevel


class LevelService:

    @staticmethod
    def create_level(user_id, data):
        name = data.get("name")

        if not name:
            return {"message": "กรุณาระบุชื่อระดับชั้น"}, 400

        # ตรวจสอบชื่อซ้ำ
        if EducationLevel.query.filter_by(user_id=user_id, name=name).first():
            return {"message": "ระดับชั้นนี้ถูกสร้างแล้ว"}, 400

        new_level = EducationLevel(
            user_id=user_id,
            name=name
        )

        db.session.add(new_level)
        db.session.commit()

        return {
            "message": "สร้างระดับชั้นสำเร็จ",
            "level": {
                "level_id": new_level.level_id,
                "name": new_level.name
            }
        }, 201

    @staticmethod
    def get_levels(user_id):
        levels = EducationLevel.query.filter_by(user_id=user_id).all()

        return {
            "levels": [
                {
                    "level_id": lv.level_id,
                    "name": lv.name
                }
                for lv in levels
            ]
        }, 200
