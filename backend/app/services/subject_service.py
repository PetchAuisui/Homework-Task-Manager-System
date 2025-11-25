from app.models.subject_model import Subject
from app.models.education_level_model import EducationLevel
from app.extensions import db

class SubjectService:

    @staticmethod
    def list_subjects(user_id: int, level_id=None):
        query = Subject.query.filter_by(user_id=user_id)
        if level_id:
            query = query.filter_by(level_id=level_id)

        subjects = query.all()

        return [
            {
                "subject_id": s.subject_id,
                "name": s.name,
                "code": s.code,
                "description": s.description,
                "color_tag": s.color_tag,
                "level_id": s.level_id,
            }
            for s in subjects
        ]

    @staticmethod
    def create_subject(user_id: int, data: dict):
        name = data.get("name")
        level_id = data.get("level_id")
        code = data.get("code")
        description = data.get("description")
        color_tag = data.get("color_tag")

        # ถ้ามี level_id เช็คว่าเป็นของ user นี้จริงไหม
        if level_id:
            level = EducationLevel.query.filter_by(
                level_id=level_id,
                user_id=user_id
            ).first()
            if not level:
                return None, "ไม่พบระดับชั้นที่เลือก"

        subject = Subject(
            user_id=user_id,
            level_id=level_id,
            name=name,
            code=code,
            description=description,
            color_tag=color_tag
        )

        db.session.add(subject)
        db.session.commit()

        return subject, None
