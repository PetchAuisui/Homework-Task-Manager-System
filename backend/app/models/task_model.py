from app.extensions import db
from datetime import datetime

class Task(db.Model):
    __tablename__ = "tasks"
    __table_args__ = {"schema": "homework"}

    task_id = db.Column(db.Integer, primary_key=True)
    subject_id = db.Column(db.Integer, db.ForeignKey("homework.subjects.subject_id"), nullable=False)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text)
    due_date = db.Column(db.Date)
    is_completed = db.Column(db.Boolean, default=False)
    priority = db.Column(db.String(10), default="MEDIUM")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    subject = db.relationship("Subject", back_populates="tasks")
    reminders = db.relationship("Reminder", back_populates="task", cascade="all, delete")
    labels = db.relationship("Label", secondary="homework.task_labels", back_populates="tasks")

    def __repr__(self):
        return f"<Task {self.title}>"
