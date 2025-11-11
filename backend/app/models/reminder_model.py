from app.extensions import db

class Reminder(db.Model):
    __tablename__ = "reminders"
    __table_args__ = {"schema": "homework"}

    reminder_id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey("homework.tasks.task_id"), nullable=False)
    message = db.Column(db.Text)
    notify_at = db.Column(db.DateTime)
    is_sent = db.Column(db.Boolean, default=False)

    task = db.relationship("Task", back_populates="reminders")

    def __repr__(self):
        return f"<Reminder for Task {self.task_id}>"
