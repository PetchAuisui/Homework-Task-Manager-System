from app.extensions import db

class SubjectTeacher(db.Model):
    __tablename__ = "subject_teachers"
    __table_args__ = {"schema": "homework"}

    subject_id = db.Column(db.Integer, db.ForeignKey("homework.subjects.subject_id", ondelete="CASCADE"), primary_key=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey("homework.teachers.teacher_id", ondelete="CASCADE"), primary_key=True)
