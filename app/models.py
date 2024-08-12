from app.config import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(500), nullable=False)
    is_active = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f'<User {self.username}>'