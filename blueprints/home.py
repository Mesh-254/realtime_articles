from flask import *
from models.models import Article

home = Blueprint('home', __name__)


@home.route('/<filename>')
def get_uploaded_image(filename):
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)


@home.route('/')
@home.route('/index')
def index():
    title = 'Realtime Articles'
    articles = Article.query.order_by(Article.date_published.desc()).all()
    # Truncate main content of each article to 50 words
    for article in articles:
        words = article.main_content.split()  # Split content into words
        if len(words) > 50:
            article.main_content = ' '.join(words[:50]) + '...'  # Join first 50 words
    return render_template('home/blog_list.html', articles=articles, title=title)


@home.route('/article_details/<int:id>')
def article_details(id):
    article = Article.query.get_or_404(id)
    return render_template('home/article_detail.html',
                           article=article)


@home.route('/article_pricing')
def article_pricing():
    return render_template('home/article_pricing.html')
