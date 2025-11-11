from app.extensions import db
from datetime import datetime

class Label(db.Model):
    __tablename__ = "labels"
    __table_args__ = {"schema": "homework"}

    label_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("homework.users.user_id"), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    color = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="labels")
    tasks = db.relationship("Task", secondary="homework.task_labels", back_populates="labels")

    def __repr__(self):
        return f"<Label {self.name}>"
