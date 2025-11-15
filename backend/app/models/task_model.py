from app.extensions import db

class Task(db.Model):
    __tablename__ = "tasks"
    __table_args__ = {"schema": "homework"}

    task_id = db.Column(db.Integer, primary_key=True)
    subject_id = db.Column(
        db.Integer, db.ForeignKey("homework.subjects.subject_id"), nullable=False
    )

    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text)
    due_date = db.Column(db.Date)
    priority = db.Column(db.String(10), default="MEDIUM")
    is_completed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    subtasks = db.relationship("SubTask", backref="task", lazy=True)
    reminders = db.relationship("Reminder", backref="task", lazy=True)

    labels = db.relationship(
        "Label",
        secondary="homework.task_labels",
        back_populates="tasks"
    )
