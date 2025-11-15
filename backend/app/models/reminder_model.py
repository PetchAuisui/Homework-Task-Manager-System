from app.extensions import db

class Reminder(db.Model):
    __tablename__ = "reminders"
    __table_args__ = {"schema": "homework"}

    reminder_id = db.Column(db.Integer, primary_key=True)

    task_id = db.Column(db.Integer, db.ForeignKey("homework.tasks.task_id"))
    subtask_id = db.Column(db.Integer, db.ForeignKey("homework.subtasks.subtask_id"))
    event_task_id = db.Column(db.Integer, db.ForeignKey("homework.event_tasks.event_task_id"))

    message = db.Column(db.Text)
    notify_at = db.Column(db.DateTime)
    is_sent = db.Column(db.Boolean, default=False)
