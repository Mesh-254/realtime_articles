from flask import *
from models.models import Article, Category
from models.database import db
from sqlalchemy import func


# Create a Blueprint object for the home routes
home = Blueprint('home', __name__)


# Route to serve uploaded images
@home.route('/<filename>')
def get_uploaded_image(filename):
    """
    Serve uploaded images from the UPLOAD_FOLDER directory.

    Parameters:
        filename (str): The name of the uploaded image file.

    Returns:
        Response: The image file to be rendered in the browser.
    """
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)


# Route to  home page or index page
@home.route('/')
@home.route('/index')
def index():
    """
        Render the index page with a list of articles.

        Returns:
            str: Rendered HTML template with a list of articles.
        """
    title = 'Realtime Articles'

    search_term = request.args.get('q', '')

    if search_term:
        articles = Article.query.filter(
            Article.main_title.ilike(f'%{search_term}%') | Article.main_content.contains(search_term)).order_by(
            Article.date_published.desc())
    else:
        articles = Article.query.order_by(Article.date_published.desc())

    # pagination
    page = request.args.get('page')
    if page and page.isdigit():
        page = int(page)
    else:
        page = 1
    pages = articles.paginate(page=page, per_page=12)
    # Truncate main content of each article to 50 words
    for article in articles:
        words = article.main_content.split()  # Split content into words
        if len(words) > 50:
            article.main_content = ' '.join(words[:50]) + '...'  # Join first 50 words
    return render_template('home/blog_list.html',
                           articles=articles, title=title, pages=pages)


# Route to display details of a specific articleposts=posts.items
@home.route('/article_details/<int:id>')
def article_details(id):
    """
    Render the article detail page for a specific article.

    Parameters:
        id (int): The ID of the article to be displayed.

    Returns:
        str: Rendered HTML template with details of the specified article.
    """
    article = Article.query.get_or_404(id)

    # Define a query to fetch the total count of blogs under each category
    category_blog_count = db.session.query(Category, func.count(Article.id).label('blog_count')) \
        .outerjoin(Article, Category.id == Article.category_id) \
        .group_by(Category.id) \
        .order_by(Category.id) \
        .all()
    recent_posts = Article.query.order_by(Article.date_published.desc()).limit(4)

    # Query to fetch similar posts belong to the same category
    similar_posts = Article.query.filter_by(category=article.category).filter(Article.id != article.id).order_by(
        Article.date_published.desc()).limit(3).all()
    for post in similar_posts:
        words = post.main_content.split()  # Split content into words
        if len(words) > 50:
            post.main_content = ' '.join(words[:50]) + '...'  # Join first 50 words

    return render_template('home/article_detail.html',
                           article=article, category_blog_count=category_blog_count,
                           recent_posts=recent_posts, similar_posts=similar_posts)


# Route to display the article pricing page
@home.route('/article_pricing')
def article_pricing():
    """
    Render the article pricing page.

    Returns:
        str: Rendered HTML template for the article pricing page.
    """
    return render_template('home/article_pricing.html')


@home.route('/contact_us', methods =['GET', 'POST'])
def contact_us():
    """Function to enable user communication """
    return render_template('home/contact_us.html')

@home.route('/terms_and_conditions')
def terms_and_conditions():
    """Function to render terms and conditions"""
    return render_template('home/terms_and_conditions.html')