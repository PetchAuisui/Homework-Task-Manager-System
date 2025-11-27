from app.extensions import db

class EventTask(db.Model):
    __tablename__ = "event_tasks"
    __table_args__ = {"schema": "homework"}

    event_task_id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey("homework.events.event_id", ondelete="CASCADE"), nullable=False)
    parent_event_task = db.Column(db.Integer, db.ForeignKey("homework.event_tasks.event_task_id", ondelete="CASCADE"))

    title = db.Column(db.String(200), nullable=False)
    due_date = db.Column(db.Date)
    priority = db.Column(db.String(10), default="MEDIUM")
    is_completed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    children = db.relationship("EventTask", cascade="all, delete")
