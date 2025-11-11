from app.extensions import db
from datetime import datetime

class Subject(db.Model):
    __tablename__ = "subjects"
    __table_args__ = {"schema": "homework"}

    subject_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("homework.users.user_id"), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    code = db.Column(db.String(50))
    description = db.Column(db.Text)
    color_tag = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    user = db.relationship("User", back_populates="subjects")
    tasks = db.relationship("Task", back_populates="subject", cascade="all, delete")
    share_links = db.relationship("ShareLink", back_populates="subject", cascade="all, delete")

    def __repr__(self):
        return f"<Subject {self.name}>"
