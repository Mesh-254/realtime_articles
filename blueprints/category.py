import random

from flask import *
from models.models import *
category = Blueprint('category', __name__)


@category.route('/categories')
def categories():
    queryset = Category.query.all()

    # List of icon classes
    icon_badges = [
        "badge text-bg-warning", "badge text-bg-success", "badge bg-dark", "badge bg-primary"," badge text-bg-info"

    ]
    # Randomly select an icon class
    random_badge_class = random.choice(icon_badges)

    for query in queryset:
        text = query.description.split()  # Split content into words
        if len(text) > 10:
            query.description = ' '.join(text[:30])

    return render_template('/category/category.html', queryset=queryset, random_badge_class=random_badge_class)
