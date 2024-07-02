from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class ReferenceImage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(64), nullable=False)
    s3_url = db.Column(db.String(256), nullable=False)

class UserImage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    s3_url = db.Column(db.String(256), nullable=False)
    label = db.Column(db.String(64))
    reference_id = db.Column(db.Integer, db.ForeignKey('reference_image.id'))
