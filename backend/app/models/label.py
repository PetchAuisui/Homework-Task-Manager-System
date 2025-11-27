from app.extensions import db

class Label(db.Model):
    __tablename__ = "labels"
    __table_args__ = {"schema": "homework"}

    label_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("homework.users.user_id", ondelete="CASCADE"), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    color = db.Column(db.String(20))
    priority = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    tasks = db.relationship("TaskLabel", backref="label", cascade="all, delete")
    subtasks = db.relationship("SubtaskLabel", backref="label", cascade="all, delete")
