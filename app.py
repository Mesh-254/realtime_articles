from flask import *
from config import Config
from flask_migrate import Migrate
from models.database import db
from flask_login import LoginManager, login_required, current_user

from blueprints.user import user
from blueprints.article import article

app = Flask(__name__)

app.url_map.strict_slashes = False

app.register_blueprint(user, url_prefix='/')
app.register_blueprint(article, url_prefix='/')

app.config.from_object(Config)

# Initialize the SQLAlchemy instance with the Flask app
db.app = app
db.init_app(app)

migrate = Migrate(app, db)

login = LoginManager(app)
login.init_app(app)
login.login_view = 'user.login'

# Import User model after initializing SQLAlchemy
from models.models import User


@login.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))



if __name__ == '__main__':
    app.run()
