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

    articles = Article.query.filter_by(category_id=category_id).all()

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

    return render_template('/category/articles_by_category_list.html',
                           articles=articles, category=category, reading_time=reading_time,
                           random_badge_class=random_badge_class)
