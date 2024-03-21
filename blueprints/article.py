from flask import *
from flask_login import login_required

article = Blueprint('article', __name__)


@article.route('/')
@article.route('/base')
@login_required
def base():
    return render_template('admin/base.html')
