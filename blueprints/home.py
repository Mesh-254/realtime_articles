from flask import *
from models.models import Article, Subheading, ThirdLevelSubheading

home = Blueprint('home', __name__)


@home.route('/uploads/<filename>')
def get_uploaded_image(filename):
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)

@home.route('/')
@home.route('/index')
def index():
    title = 'Realtime Articles'
    articles = Article.query.order_by(Article.date_published.desc()).all()
    return render_template('home/blog_list.html', articles=articles, title=title)




@home.route('/article_details/<int:id>')
def article_details(id):
    article= Article.query.get_or_404(id)
    subheadings = Subheading.query.filter_by(article_id=id).all()
    third_level_subheadings = []
    for subheading in subheadings:
        third_level_subheadings.extend(ThirdLevelSubheading.query.filter_by(subheading_id=subheading.id).all())
        print(third_level_subheadings)
    return render_template('home/article_detail.html',
                           article=article, subheadings=subheadings, third_level_subheadings=third_level_subheadings)


