from app.extensions import db

class ShareLink(db.Model):
    __tablename__ = "share_links"
    __table_args__ = {"schema": "homework"}

    share_id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer, db.ForeignKey("homework.users.user_id"), nullable=False
    )

    subject_id = db.Column(
        db.Integer, db.ForeignKey("homework.subjects.subject_id"), nullable=False
    )

    token = db.Column(db.String(100))
    is_active = db.Column(db.Boolean, default=True)
    expires_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
