from app.models.education_level_model import EducationLevel
from app.extensions import db

class EducationService:

    @staticmethod
    def list_levels(user_id: int):
        levels = EducationLevel.query.filter_by(user_id=user_id).all()
        return [
            {
                "level_id": l.level_id,
                "name": l.name,
                "institution_name": l.institution_name
            }
            for l in levels
        ]

    @staticmethod
    def create_level(user_id: int, name: str, institution_name: str = None):
        exists = EducationLevel.query.filter_by(user_id=user_id, name=name).first()
        if exists:
            return None, "ระดับชั้นนี้มีอยู่แล้ว"

        new_level = EducationLevel(
            user_id=user_id,
            name=name,
            institution_name=institution_name
        )

        db.session.add(new_level)
        db.session.commit()

        return new_level, None
