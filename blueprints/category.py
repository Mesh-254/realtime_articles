import random
import re
from flask import *
from models.models import *

category = Blueprint('category', __name__)


@category.route('/categories')
def categories():
    queryset = Category.query.all()

    # List of icon classes
    icon_badges = [
        "badge text-bg-warning", "badge text-bg-success", "badge bg-dark", "badge bg-primary", " badge text-bg-info"

    ]
    # Randomly select an icon class
    random_badge_class = random.choice(icon_badges)

    for query in queryset:
        text = query.description.split()  # Split content into words
        if len(text) > 10:
            query.description = ' '.join(text[:30])

    return render_template('/category/category.html', queryset=queryset, random_badge_class=random_badge_class)


@category.route('/category/<int:category_id>/articles', methods=['GET'])
def get_articles_by_category(category_id):
    category = Category.query.get_or_404(category_id)

    # all articles query to feed trending articles it fetches the latest 15 blogs
    articles_query = Article.query.order_by(Article.date_published.desc()).limit(10)

    search_term = request.args.get('q', '')
    if search_term:
        articles = Article.query.filter_by(category_id=category_id).filter(
            Article.main_title.ilike(f'%{search_term}%') | Article.main_content.contains(search_term)).order_by(
            Article.date_published.desc())
    else:
        articles = Article.query.filter_by(category_id=category_id).order_by(
            Article.date_published.desc())

    # Pagination
    page = request.args.get('page')
    if page and page.isdigit():
        page = int(page)
    else:
        page = 1
    pages = articles.paginate(page=page, per_page=10)

    reading_time = 0  # Default value for reading time
    # limiting the number of content to be displayed on screen
    for query in articles:

        # Calculates the number of words in the article content
        word_count = len(re.findall(r'\w+', query.main_content))
        # Calculate the estimated reading time
        reading_time = round(word_count / 200)  # average reading time is 200 words per minute

        text = query.main_content.split()
        if len(text) > 10:
            query.main_content = ' '.join(text[:50])

    # List of icon classes
    icon_badges = [
        "badge text-bg-warning", "badge text-bg-success", "badge bg-dark", "badge bg-primary", " badge text-bg-info"

    ]
    # Randomly select an icon class
    random_badge_class = random.choice(icon_badges)

    return render_template('/category/articles_by_category_list.html', category=category, reading_time=reading_time,
                           random_badge_class=random_badge_class, pages=pages, articles_query=articles_query)
