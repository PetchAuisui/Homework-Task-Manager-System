from app.extensions import db

class SubTaskLabel(db.Model):
    __tablename__ = "subtask_labels"
    __table_args__ = {"schema": "homework"}

    subtask_id = db.Column(
        db.Integer, db.ForeignKey("homework.subtasks.subtask_id"), primary_key=True
    )

    label_id = db.Column(
        db.Integer, db.ForeignKey("homework.labels.label_id"), primary_key=True
    )
