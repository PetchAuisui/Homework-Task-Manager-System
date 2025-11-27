from app.extensions import db

class Event(db.Model):
    __tablename__ = "events"
    __table_args__ = {"schema": "homework"}

    event_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("homework.users.user_id", ondelete="CASCADE"), nullable=False)
    level_id = db.Column(db.Integer, db.ForeignKey("homework.education_levels.level_id", ondelete="SET NULL"))
    term_id = db.Column(db.Integer, db.ForeignKey("homework.terms.term_id", ondelete="SET NULL"))

    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text)
    date = db.Column(db.Date)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    event_tasks = db.relationship("EventTask", backref="event", cascade="all, delete")
