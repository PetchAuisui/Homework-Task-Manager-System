from app.extensions import db

class Subject(db.Model):
    __tablename__ = "subjects"
    __table_args__ = {"schema": "homework"}

    subject_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("homework.users.user_id", ondelete="CASCADE"),
        nullable=False
    )
    level_id = db.Column(
        db.Integer,
        db.ForeignKey("homework.education_levels.level_id", ondelete="SET NULL")
    )
    name = db.Column(db.String(120), nullable=False)
    code = db.Column(db.String(50))
    description = db.Column(db.Text)
    color_tag = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
