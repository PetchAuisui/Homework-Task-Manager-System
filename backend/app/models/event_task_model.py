from app.extensions import db

class EventTask(db.Model):
    __tablename__ = "event_tasks"
    __table_args__ = {"schema": "homework"}

    event_task_id = db.Column(db.Integer, primary_key=True)

    event_id = db.Column(
        db.Integer, db.ForeignKey("homework.events.event_id"), nullable=False
    )

    parent_event_task = db.Column(
        db.Integer, db.ForeignKey("homework.event_tasks.event_task_id")
    )

    title = db.Column(db.String(200), nullable=False)
    due_date = db.Column(db.Date)
    priority = db.Column(db.String(10), default="MEDIUM")
    is_completed = db.Column(db.Boolean, default=False)

    created_at = db.Column(db.DateTime, server_default=db.func.now())

    children = db.relationship(
        "EventTask",
        backref=db.backref("parent", remote_side=[event_task_id]),
        lazy=True
    )

    reminders = db.relationship("Reminder", backref="event_task", lazy=True)
