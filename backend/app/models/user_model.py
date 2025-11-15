from app.extensions import db

class User(db.Model):
    __tablename__ = "users"
    __table_args__ = {"schema": "homework"}

    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)

    date_of_birth = db.Column(db.Date)
    gender = db.Column(db.String(10))
    bio = db.Column(db.Text)
    profile_image = db.Column(db.Text)

    role = db.Column(db.String(20), default="USER")
    theme_preference = db.Column(db.String(20), default="light")

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    last_login = db.Column(db.DateTime)

    education_levels = db.relationship("EducationLevel", backref="user", lazy=True)
    subjects = db.relationship("Subject", backref="user", lazy=True)
    events = db.relationship("Event", backref="user", lazy=True)
    labels = db.relationship("Label", backref="user", lazy=True)
