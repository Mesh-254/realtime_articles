from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from app import db


class User(UserMixin, db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    is_admin = db.Column(db.Boolean, default=False)
    date_registered = db.Column(db.DateTime, default=datetime.utcnow)
    profile_picture = db.Column(db.String(100))  # Path to profile picture

    def __repr__(self):
        return '<User {} {}>'.format(self.username, self.email)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Category(db.Model):
    """
    Represents categories for articles.
    """
    __tablename__ = 'category'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.Text)

    def __repr__(self):
        return '<Category {}>'.format(self.name)


class Article(db.Model):
    """
    Represents main articles.
    """
    __tablename__ = 'article'

    id = db.Column(db.Integer, primary_key=True)
    main_title = db.Column(db.String(100), nullable=False)
    main_content = db.Column(db.Text, nullable=True)
    date_published = db.Column(db.DateTime, default=datetime.utcnow)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    main_image = db.Column(db.String(100), nullable=True)  # Path to main image
    subheadings = db.relationship('Subheading', backref='article', lazy=True)

    def __repr__(self):
        return '<Article {}>'.format(self.main_title)


class Subheading(db.Model):
    """
    Represents subheadings of main articles.
    """
    __tablename__ = 'subheading'

    id = db.Column(db.Integer, primary_key=True)
    sub_title = db.Column(db.String(100), nullable=True)
    sub_content = db.Column(db.Text, nullable=True)
    sub_image = db.Column(db.String(100))  # Path to subheading image
    article_id = db.Column(db.Integer, db.ForeignKey('article.id'), nullable=False)
    third_level_subheadings = db.relationship('ThirdLevelSubheading', backref='subheading', lazy=True)

    def __repr__(self):
        return '<Subheading {}>'.format(self.sub_title)


class ThirdLevelSubheading(db.Model):
    """
    Represents third-level subheadings.
    """
    __tablename__ = 'third_level_subheading'

    id = db.Column(db.Integer, primary_key=True)
    sub_title = db.Column(db.String(100), nullable=True)
    sub_content = db.Column(db.Text, nullable=True)
    sub_image = db.Column(db.String(100))  # Path to third level subheading image
    subheading_id = db.Column(db.Integer, db.ForeignKey('subheading.id'), nullable=False)

    def __repr__(self):
        return '<ThirdLevelSubheading {}>'.format(self.sub_title)
