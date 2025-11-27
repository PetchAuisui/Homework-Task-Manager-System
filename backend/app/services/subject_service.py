from app.extensions import db
from app.models.subject import Subject
from app.models.education_level import EducationLevel
from app.models.term import Term
from app.models.teacher import Teacher
from app.models.subject_teacher import SubjectTeacher


class SubjectService:

    @staticmethod
    def list_subjects(user_id, level_id=None, term_id=None):
        query = Subject.query.filter_by(user_id=user_id)

        if level_id:
            query = query.filter_by(level_id=level_id)

        if term_id:
            query = query.filter_by(term_id=term_id)

        subjects = query.all()

        return [
            {
                "subject_id": s.subject_id,
                "name": s.name,
                "code": s.code,
                "description": s.description,
                "color_tag": s.color_tag,
                "level_id": s.level_id,
                "term_id": s.term_id,
                "teachers": [
                    st.teacher.full_name
                    for st in s.teachers
                ]
            }
            for s in subjects
        ]

    @staticmethod
    def create_subject(user_id, data):
        name = data.get("name")
        level_id = data.get("level_id")
        term_id = data.get("term_id")
        teacher_ids = data.get("teacher_ids", [])
        code = data.get("code")
        description = data.get("description")
        color_tag = data.get("color_tag")

        # ตรวจสอบ level
        if level_id:
            level = EducationLevel.query.filter_by(
                level_id=level_id,
                user_id=user_id
            ).first()
            if not level:
                return {"message": "ไม่พบระดับชั้น"}, 404

        # ตรวจสอบ term
        if term_id:
            term = Term.query.filter_by(
                term_id=term_id,
                user_id=user_id
            ).first()
            if not term:
                return {"message": "ไม่พบเทอม"}, 404

        # สร้าง subject
        subject = Subject(
            user_id=user_id,
            level_id=level_id,
            term_id=term_id,
            name=name,
            code=code,
            description=description,
            color_tag=color_tag
        )

        db.session.add(subject)
        db.session.commit()

        # ผูกอาจารย์ (ถ้ามี)
        for tid in teacher_ids:
            teacher = Teacher.query.filter_by(
                teacher_id=tid,
                user_id=user_id
            ).first()

            if teacher:
                db.session.add(SubjectTeacher(
                    subject_id=subject.subject_id,
                    teacher_id=tid
                ))

        db.session.commit()

        return {
            "message": "สร้างวิชาสำเร็จ",
            "subject_id": subject.subject_id
        }, 201
