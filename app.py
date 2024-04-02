import os
from dotenv import load_dotenv
from flask import *
from werkzeug.utils import secure_filename

from config import Config
from flask_migrate import Migrate

from forms import ArticleForm
from models.database import db
from flask_login import LoginManager, login_required, current_user

from blueprints.user import user
from blueprints.article import article
from blueprints.home import home

from flask_ckeditor import CKEditor


app = Flask(__name__, static_url_path='/static')

# initialization of CKEDITOR
ckeditor = CKEditor(app)


app.url_map.strict_slashes = False

app.register_blueprint(home, url_prefix='/')
app.register_blueprint(user, url_prefix='/')
app.register_blueprint(article, url_prefix='/')

# Importing of config variables
app.config.from_object(Config)

# Initialize the SQLAlchemy instance with the Flask app
db.app = app
db.init_app(app)

migrate = Migrate(app, db)

login = LoginManager(app)
login.init_app(app)
login.login_view = 'user.login'
load_dotenv()

# Import User model after initializing SQLAlchemy
from models.models import User, Article


@login.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


if __name__ == '__main__':
    app.run()
