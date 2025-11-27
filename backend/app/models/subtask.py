from app.extensions import db

class Subtask(db.Model):
    __tablename__ = "subtasks"
    __table_args__ = {"schema": "homework"}

    subtask_id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey("homework.tasks.task_id", ondelete="CASCADE"))
    parent_subtask = db.Column(db.Integer, db.ForeignKey("homework.subtasks.subtask_id", ondelete="CASCADE"))

    title = db.Column(db.String(200), nullable=False)
    due_date = db.Column(db.Date)
    priority = db.Column(db.String(10), default="MEDIUM")
    is_completed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    # children subtasks (recursive)
    children = db.relationship(
        "Subtask",
        cascade="all, delete",
        backref=db.backref("parent", remote_side=[subtask_id])
    )

    # Labels
    labels = db.relationship(
        "SubtaskLabel",
        backref="subtask",
        cascade="all, delete"
    )
