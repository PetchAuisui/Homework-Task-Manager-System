from app.models.term import Term
from app.extensions import db


class TermService:

    @staticmethod
    def create_term(user_id, data):
        level_id = data.get("level_id")
        name = data.get("name")

        if not level_id or not name:
            return {"message": "ข้อมูลไม่ครบ"}, 400

        # ป้องกันสร้างซ้ำ
        exists = Term.query.filter_by(
            user_id=user_id,
            level_id=level_id,
            name=name
        ).first()

        if exists:
            return {"message": "เทอมนี้ถูกสร้างแล้ว"}, 400

        # สร้างใหม่
        new_term = Term(
            user_id=user_id,
            level_id=level_id,
            name=name
        )
        db.session.add(new_term)
        db.session.commit()

        # >>> แก้: serialize datetime เป็น string ป้องกัน React crash
        return {
            "message": "สร้างเทอมสำเร็จ",
            "term": {
                "term_id": new_term.term_id,
                "level_id": new_term.level_id,
                "name": new_term.name,
                "start_date": new_term.start_date.isoformat() if new_term.start_date else None,
                "end_date": new_term.end_date.isoformat() if new_term.end_date else None,
                "created_at": new_term.created_at.isoformat() if new_term.created_at else None
            }
        }, 201

    @staticmethod
    def list_terms(user_id, level_id):
        if not level_id:
            return {"message": "ต้องมี level_id"}, 400

        terms = Term.query.filter_by(
            user_id=user_id,
            level_id=level_id
        ).order_by(Term.term_id.asc()).all()

        # >>> แก้: serialize datetime ทั้งหมด
        return {
            "terms": [
                {
                    "term_id": t.term_id,
                    "level_id": t.level_id,
                    "name": t.name,
                    "start_date": t.start_date.isoformat() if t.start_date else None,
                    "end_date": t.end_date.isoformat() if t.end_date else None,
                    "created_at": t.created_at.isoformat() if t.created_at else None
                }
                for t in terms
            ]
        }, 200
