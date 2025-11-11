from app.extensions import db
from datetime import datetime

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
    education_level = db.Column(db.String(30))
    institution_name = db.Column(db.String(255))
    major = db.Column(db.String(100))
    bio = db.Column(db.Text)
    profile_image = db.Column(db.Text)

    role = db.Column(db.String(20), default="USER")
    theme_preference = db.Column(db.String(20), default="light")

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)

    # Relationships
    subjects = db.relationship("Subject", back_populates="user", cascade="all, delete")
    labels = db.relationship("Label", back_populates="user", cascade="all, delete")
    share_links = db.relationship("ShareLink", back_populates="user", cascade="all, delete")

    def __repr__(self):
        return f"<User {self.username}>"
