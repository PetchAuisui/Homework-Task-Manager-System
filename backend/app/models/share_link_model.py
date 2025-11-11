from app.extensions import db
from datetime import datetime
import uuid

class ShareLink(db.Model):
    __tablename__ = "share_links"
    __table_args__ = {"schema": "homework"}

    share_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("homework.users.user_id"), nullable=False)
    subject_id = db.Column(db.Integer, db.ForeignKey("homework.subjects.subject_id"), nullable=False)
    token = db.Column(db.String(36), default=lambda: str(uuid.uuid4()))
    is_active = db.Column(db.Boolean, default=True)
    expires_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="share_links")
    subject = db.relationship("Subject", back_populates="share_links")

    def __repr__(self):
        return f"<ShareLink {self.token}>"
