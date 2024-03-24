from flask import *
from flask_login import login_required
from forms import CategoryForm, ArticleForm
from models.models import Category, Article
from models.database import db

article = Blueprint('article', __name__)


@article.route('/')
@article.route('/base')
@login_required
def base():
    title = 'Admin page'
    return render_template('admin/base.html', title=title)


@article.route('/create_category', methods=['GET', 'POST'])
@login_required
def create_category():
    title = "Create new Category"
    form = CategoryForm()
    if form.validate_on_submit():
        category_name = (Category.query.
                         filter(Category.name == form.name.data).first())
        if category_name:
            flash("Category with similar name already exists!", 'danger')
            return redirect(url_for('article.category_list'))
        category = Category(
            name=form.name.data,
            description=form.description.data
        )
        db.session.add(category)
        db.session.commit()
        flash('New category has been created', 'success')
        return redirect(url_for('article.category_list'))
    return render_template('admin/category/edit_category.html',
                           title=title, form=form)


@article.route('/category_list')
@login_required
def category_list():
    title = 'Category List'
    queryset = Category.query.order_by(Category.id.desc())
    return render_template('admin/category/category_list.html',
                           queryset=queryset, title=title)


@article.route('/edit_category/<int:category_id>', methods=['GET', 'POST'])
@login_required
def edit_category(category_id):
    title = "Edit Category"
    category = Category.query.get_or_404(category_id)
    form = CategoryForm(obj=category)
    if form.validate_on_submit():
        category_name = (Category.query
                         .filter(Category.name == form.name.data)
                         .filter(Category.id != category_id)
                         .first())
        if category_name:
            flash("Category with similar name already exists!", 'danger')
            return redirect(url_for('article.category_list'))
        category.name = form.name.data
        category.description = form.description.data
        db.session.commit()
        flash('Category has been updated', 'success')
        return redirect(url_for('article.category_list'))
    return render_template('admin/category/edit_category.html',
                           title=title, form=form, category=category)


@article.route('/delete_category/<int:id>', methods=['GET', 'POST'])
@login_required
def delete_category(id):
    category = Category.query.get_or_404(id)
    associated_articles = Article.query.filter_by(category_id=id).all()

    if request.method == 'POST':
        if associated_articles:
            flash("Cannot delete category. There are associated articles.", 'danger')
            return redirect(url_for('article.category_list'))

        db.session.delete(category)
        db.session.commit()
        flash('Category has been successfully deleted!', 'success')
        return redirect(url_for('article.category_list'))

    return render_template('admin/category/delete_category.html', category=category)


@article.route('/create_article')
@login_required
def create_article():
    form = ArticleForm()
    if form.validate_on_submit():
        # Check if an article with the same title already exists
        existing_article = Article.query.filter_by(main_title=form.main_title.data).first()
        if existing_article:
            flash("Article with the same title already exists!", 'danger')
            return redirect(url_for('create_article'))

        # Create a new article instance and populate its fields from the form
        new_article = Article(
            main_title=form.main_title.data,
            main_content=form.main_content.data,
            author_id=form.author_id.data,
            category_id=form.category_id.data,
            main_image=form.main_image.data
        )

        # Add the new article to the database session and commit changes
        db.session.add(new_article)
        db.session.commit()

        flash("Article created successfully!", 'success')
        return redirect(url_for('article.article_list'))  # Redirect to the homepage or any other relevant page

    return render_template('create_article.html', form=form, title='Create Article/Blog')


@article.route('/article_list')
@login_required
def article_list():
    pass