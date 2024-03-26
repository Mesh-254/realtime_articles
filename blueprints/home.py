from flask import *
from models.models import Article

home = Blueprint('home', __name__)


@home.route('/')
@home.route('/index')
def index():
    title = 'Realtime Articles'
    articles = Article.query.order_by(Article.date_published.desc()).all()
    return render_template('home/blog_list.html', articles=articles, title=title)


@home.route('/uploads/<filename>')
def get_uploaded_image(filename):
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)
