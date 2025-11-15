from app.extensions import db

class SubTask(db.Model):
    __tablename__ = "subtasks"
    __table_args__ = {"schema": "homework"}

    subtask_id = db.Column(db.Integer, primary_key=True)

    task_id = db.Column(
        db.Integer, db.ForeignKey("homework.tasks.task_id"), nullable=False
    )

    parent_subtask = db.Column(
        db.Integer, db.ForeignKey("homework.subtasks.subtask_id")
    )

    title = db.Column(db.String(200), nullable=False)
    due_date = db.Column(db.Date)
    priority = db.Column(db.String(10), default="MEDIUM")
    is_completed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    children = db.relationship(
        "SubTask",
        backref=db.backref("parent", remote_side=[subtask_id]),
        lazy=True
    )

    labels = db.relationship(
        "Label",
        secondary="homework.subtask_labels",
        back_populates="subtasks"
    )
