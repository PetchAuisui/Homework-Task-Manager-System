from app.extensions import db
from app.models.subject_model import Subject
from app.models.education_level_model import EducationLevel


class SubjectService:

    @staticmethod
    def create_subject(user_id, data):
        level_id = data.get("level_id")
        name = data.get("name")
        code = data.get("code")
        description = data.get("description")
        color_tag = data.get("color_tag")

        if not name:
            return {"message": "กรุณาระบุชื่อวิชา"}, 400

        # ถ้า user ส่ง level_id → ต้องตรวจว่ามีอยู่จริงและเป็นของ user นี้
        if level_id:
            level = EducationLevel.query.filter_by(
                level_id=level_id,
                user_id=user_id
            ).first()

            if not level:
                return {"message": "ไม่พบระดับชั้นนี้ หรือไม่มีสิทธิ์"}, 403

        # สร้างวิชาใหม่
        new_subject = Subject(
            user_id=user_id,
            level_id=level_id,
            name=name,
            code=code,
            description=description,
            color_tag=color_tag
        )

        db.session.add(new_subject)
        db.session.commit()

        return {
            "message": "สร้างวิชาสำเร็จ",
            "subject": {
                "subject_id": new_subject.subject_id,
                "name": new_subject.name,
                "code": new_subject.code,
                "description": new_subject.description,
                "color_tag": new_subject.color_tag,
                "level_id": new_subject.level_id
            }
        }, 201

    @staticmethod
    def get_subjects(user_id):
        subjects = Subject.query.filter_by(user_id=user_id).all()
        return {
            "subjects": [
                {
                    "subject_id": s.subject_id,
                    "name": s.name,
                    "code": s.code,
                    "description": s.description,
                    "color_tag": s.color_tag,
                    "level_id": s.level_id
                } for s in subjects
            ]
        }, 200
