from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, TextAreaField
from wtforms.validators import DataRequired, Email, Length, ValidationError


class UserLoginForm(FlaskForm):
    email_or_username = StringField('Email or Username', validators=[DataRequired(), Length(max=100)])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=8)])
    remember_me = BooleanField('Remember Me')


class CategoryForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired(), Length(max=50)])
    description = TextAreaField('Description', render_kw={"rows": 6})  # Set rows attribute to 4
