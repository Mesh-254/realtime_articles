from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, TextAreaField, SelectField, FileField
from wtforms.validators import DataRequired, Length
from models.models import User, Category, Article,Subheading


class UserLoginForm(FlaskForm):
    email_or_username = StringField('Email or Username', validators=[DataRequired(), Length(max=100)])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=8)])
    remember_me = BooleanField('Remember Me')


class CategoryForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired(), Length(max=50)])
    description = TextAreaField('Description', render_kw={"rows": 6})  # Set rows attribute to 4


class ArticleForm(FlaskForm):
    main_title = StringField('Main Title', validators=[DataRequired()])
    main_content = TextAreaField('Main Content', render_kw={"rows": 10})
    author_id = SelectField('Author', coerce=int, validators=[DataRequired()])
    category_id = SelectField('Category', coerce=int, validators=[DataRequired()])
    main_image = FileField('Main Image', render_kw={"class": "form-control"})

    def __init__(self, *args, **kwargs):
        super(ArticleForm, self).__init__(*args, **kwargs)
        self.author_id.choices = [(author.id, author.username) for author in User.query.all()]
        self.category_id.choices = [(category.id, category.name) for category in Category.query.all()]


class SubheadingForm(FlaskForm):
    sub_title = StringField('Subheading Title', validators=[DataRequired()])
    sub_content = TextAreaField('Subheading Content', validators=[DataRequired()], render_kw={"rows": 7})
    sub_image = FileField('Subheading Image')  # Assuming it's a path
    article_id = SelectField('Article', coerce=int)  # Select field for article

    def __init__(self, *args, **kwargs):
        super(SubheadingForm, self).__init__(*args, **kwargs)
        self.article_id.choices = [(article.id, article.main_title) for article in Article.query.all()]


class ThirdLevelSubheadingForm(FlaskForm):
    sub_title = StringField('Subheading Title')
    sub_content = TextAreaField('Subheading Content', render_kw={"rows": 6})
    sub_image = FileField('Subheading Image')
    subheading_id = SelectField('Subheading', coerce=int, validators=[DataRequired()])

    def __init__(self, *args, **kwargs):
        super(ThirdLevelSubheadingForm, self).__init__(*args, **kwargs)
        self.subheading_id.choices = [(subheading.id, subheading.sub_title) for subheading in Subheading.query.all()]
