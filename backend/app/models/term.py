from app.extensions import db

class Term(db.Model):
    __tablename__ = "terms"
    __table_args__ = {"schema": "homework"}

    term_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("homework.users.user_id", ondelete="CASCADE"), nullable=False)
    level_id = db.Column(db.Integer, db.ForeignKey("homework.education_levels.level_id", ondelete="CASCADE"), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    subjects = db.relationship("Subject", backref="term", cascade="all, delete")
    events = db.relationship("Event", backref="term", cascade="all, delete")
