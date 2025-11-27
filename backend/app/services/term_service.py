from app.extensions import db
from app.models.term import Term
from app.models.education_level import EducationLevel


class TermService:

    @staticmethod
    def create_term(user_id, data):
        level_id = data.get("level_id")
        name = data.get("name")
        start_date = data.get("start_date")
        end_date = data.get("end_date")

        if not level_id or not name:
            return {"message": "กรุณาระบุ level_id และ name"}, 400

        level = EducationLevel.query.filter_by(
            level_id=level_id, user_id=user_id
        ).first()

        if not level:
            return {"message": "ไม่พบระดับชั้นนี้"}, 404

        exists = Term.query.filter_by(
            user_id=user_id,
            level_id=level_id,
            name=name
        ).first()

        if exists:
            return {"message": "เทอมนี้ถูกสร้างแล้ว"}, 400

        term = Term(
            user_id=user_id,
            level_id=level_id,
            name=name,
            start_date=start_date,
            end_date=end_date
        )

        db.session.add(term)
        db.session.commit()

        return {"message": "สร้างเทอมสำเร็จ", "term_id": term.term_id}, 201

    @staticmethod
    def list_terms(user_id, level_id):
        query = Term.query.filter_by(user_id=user_id)

        if level_id:
            query = query.filter_by(level_id=level_id)

        terms = query.all()

        return {
            "terms": [
                {
                    "term_id": t.term_id,
                    "name": t.name,
                    "level_id": t.level_id,
                    "start_date": t.start_date,
                    "end_date": t.end_date
                }
                for t in terms
            ]
        }, 200
