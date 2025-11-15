
from app.extensions import db

class EducationLevel(db.Model):
    __tablename__ = "education_levels"
    __table_args__ = {"schema": "homework"}

    level_id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer, db.ForeignKey("homework.users.user_id"), nullable=False
    )

    name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    subjects = db.relationship("Subject", backref="level", lazy=True)
    events = db.relationship("Event", backref="level", lazy=True)
