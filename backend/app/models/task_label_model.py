from app.extensions import db

class TaskLabel(db.Model):
    __tablename__ = "task_labels"
    __table_args__ = {"schema": "homework"}

    task_id = db.Column(db.Integer, db.ForeignKey("homework.tasks.task_id"), primary_key=True)
    label_id = db.Column(db.Integer, db.ForeignKey("homework.labels.label_id"), primary_key=True)
