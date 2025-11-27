from app.extensions import db

class Teacher(db.Model):
    __tablename__ = "teachers"
    __table_args__ = {"schema": "homework"}

    teacher_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("homework.users.user_id", ondelete="CASCADE"), nullable=False)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120))
    phone = db.Column(db.String(50))
    note = db.Column(db.Text)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    subjects = db.relationship("SubjectTeacher", backref="teacher", cascade="all, delete")
