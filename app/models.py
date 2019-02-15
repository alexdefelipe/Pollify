from app import db
from datetime import datetime


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # username = db.Column(db.String(80), unique=True, nullable=False)
    username = db.Column(db.String(80), nullable=False, unique=True)
    password = db.Column(db.String(120), nullable=False)
    questions = db.relationship('Question', backref='user', lazy=True)

    def __repr__(self):
        return '<User %r>' % self

    def serialize(self):
        return {"id": self.id,
                "username": self.username,
                "password": self.password}


class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    body = db.Column(db.String(120), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'),
                        nullable=False)

    def __repr__(self):
        return '<Question %r>' % self.question

    def serialize(self):
        user = User.query.filter_by(id=self.user_id).first_or_404()
        return {"id": self.id,
                "title": self.title,
                "body": self.body,
                "author": user.username,
                "timestamp": str(self.timestamp)}
