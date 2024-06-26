import os
from flask import *
from flask_login import login_required
from werkzeug.utils import secure_filename

from forms import CategoryForm, ArticleForm
from models.models import Category, Article, User
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
        image = form.image.data
        if not image:
            flash("No image selected!", 'danger')
            return None

        uploaded_file = secure_filename(image.filename)
        file_ext = os.path.splitext(uploaded_file)[1]
        if file_ext not in current_app.config['UPLOAD_EXTENSIONS']:
            flash('Allowed file types .jpg, .png, .gif, .jpeg,', 'danger')
            return None
        image_path = os.path.join(current_app.config['UPLOAD_FOLDER'], uploaded_file)
        image.save(image_path)

        category_name = (Category.query.
                         filter(Category.name == form.name.data).first())
        if category_name:
            flash("Category with similar name already exists!", 'danger')
            return redirect(url_for('article.category_list'))

        category = Category(
            name=form.name.data,
            description=form.description.data,
            image=image_path,
        )
        print(category.image)
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
    search_term = request.args.get('q', '')  # Get the search term from the query parameter
    if search_term:
        # Filter categories based on category name matching the search term
        queryset = Category.query.filter(Category.name.ilike(f'%{search_term}%')).order_by(Category.id.desc()).all()
    else:
        # If no search term provided, fetch all categories
        queryset = Category.query.order_by(Category.id.desc()).all()

    return render_template('admin/category/category_list.html',
                           queryset=queryset, title=title)


@article.route('/edit_category/<int:category_id>', methods=['GET', 'POST'])
@login_required
def edit_category(category_id):
    title = "Edit Category"
    category = Category.query.get_or_404(category_id)
    form = CategoryForm(obj=category)
    if form.validate_on_submit():
        image = form.image.data
        if not image:
            flash("No image selected!", 'danger')
            return None
        uploaded_file = secure_filename(image.filename)
        file_ext = os.path.splitext(uploaded_file)[1]
        if file_ext not in current_app.config['UPLOAD_EXTENSIONS']:
            flash('File type not allowed. Please upload a different file type.', 'danger')
            return redirect(url_for('article.edit_category', category_id=category_id))
        image_path = os.path.join(current_app.config['UPLOAD_FOLDER'], uploaded_file)
        image.save(image_path)

        category_name = (Category.query
                         .filter(Category.name == form.name.data)
                         .filter(Category.id != category_id)
                         .first())
        if category_name:
            flash("Category with similar name already exists!", 'danger')
            return redirect(url_for('article.category_list'))
        category.name = form.name.data
        category.description = form.description.data
        category.image = image_path
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

            # Check if the article has an associated image and delete it from the server
        if category.image:
            image_filename = secure_filename(category.image)
            image_path = os.path.join(current_app.config['UPLOAD_FOLDER'], image_filename)
            if os.path.exists(image_path):
                os.remove(image_path)

        db.session.delete(category)
        db.session.commit()
        flash('Category has been successfully deleted!', 'success')
        return redirect(url_for('article.category_list'))

    return render_template('admin/category/delete_category.html',
                           category=category)


@article.route('/create_article', methods=['GET', 'POST'])
@login_required
def create_article():
    title = 'Create Article / Blog'
    form = ArticleForm()
    if form.validate_on_submit():
        # Check if an article with the same title already exists
        existing_article = Article.query.filter_by(main_title=form.main_title.data).first()
        if existing_article:
            flash("Article with the same title already exists!", 'danger')
            return redirect(url_for('article.create_article'))

        # Save uploaded images and get their file paths
        main_image_path = save_image(form.main_image.data)
        # Create a new article instance and populate its fields from the form
        new_article = Article(
            main_title=form.main_title.data,
            main_content=form.main_content.data,
            category_id=form.category_id.data,
            main_image=main_image_path,
            author_id=form.author_id.data
        )
        # Add the new article to the database session and commit changes
        db.session.add(new_article)
        db.session.commit()
        flash(" Your Article/Blog was created successfully!", 'success')
        return redirect(url_for('article.article_list'))
    return render_template('admin/articles/edit_article.html', form=form, title=title)


def save_image(image_data):
    if image_data:
        uploaded_file = secure_filename(image_data.filename)
        file_ext = os.path.splitext(uploaded_file)[1]
        if file_ext not in current_app.config['UPLOAD_EXTENSIONS']:
            flash('Allowed file types .jpg, .png, .gif, .jpeg,', 'danger')
            return None
        image_path = os.path.join(current_app.config['UPLOAD_FOLDER'], uploaded_file)
        image_data.save(image_path)
        return image_path
    return None


# Fetch category and author details in your article_list function
@article.route('/article_list')
@login_required
def article_list():
    title = 'Article/Blog List'
    search_term = request.args.get('q', '')  # Get the search term from the query parameter
    if search_term:
        # Filter articles based on category name matching the search term
        articles= Article.query.filter(Article.main_title.ilike(f'%{search_term}%')).all()
    else:
        articles=Article.query.order_by(Article.date_published.desc()).all()
    # Fetch category and author details for each article
    for article in articles:
        category = Category.query.get(article.category_id)
        author = User.query.get(article.author_id)
        article.category_name = category.name if category else 'N/A'
        article.author_name = author.username if author else 'N/A'

        # Truncate main content of each article to 50 words
        words = article.main_content.split()  # Split content into words
        if len(words) > 50:
            article.main_content = ' '.join(words[:50]) + '...'  # Join first 50 words

    return render_template('admin/articles/article_list.html', title=title,
                           articles=articles)


@article.route('/update_article/<int:article_id>', methods=['GET', 'POST'])
@login_required
def update_article(article_id):
    title = 'Update title'
    article = Article.query.get_or_404(article_id)
    form = ArticleForm(obj=article)
    if form.validate_on_submit():
        main_image = form.main_image.data
        if main_image:
            uploaded_file = secure_filename(main_image.filename)
            file_ext = os.path.splitext(uploaded_file)[1]
            if file_ext not in current_app.config['UPLOAD_EXTENSIONS']:
                flash('File type not allowed. Please upload a different file type.', 'danger')
                return redirect(url_for('article.create_article', article_id=article_id))
            main_image.save(os.path.join(current_app.config['UPLOAD_FOLDER'], uploaded_file))
        else:
            uploaded_file = None
        # If editing existing article, update its details
        article.main_title = form.main_title.data
        article.main_content = form.main_content.data
        article.category_id = form.category_id.data
        if uploaded_file:
            article.main_image = uploaded_file
        article.author_id = form.author_id.data
        db.session.commit()
        flash("Article updated successfully!", 'success')
        return (redirect(url_for('article.article_list')))
    return render_template('admin/articles/edit_article.html', form=form, title=title)


@article.route('/delete_article/<int:article_id>', methods=['GET', 'POST'])
@login_required
def delete_article(article_id):
    # Retrieve the article from the database
    article = Article.query.get_or_404(article_id)
    title = 'Delete Article'
    if request.method == 'POST':

        # Check if the article has an associated image and delete it from the server
        if article.main_image:
            image_filename = secure_filename(article.main_image)
            image_path = os.path.join(current_app.config['UPLOAD_FOLDER'], image_filename)
            if os.path.exists(image_path):
                os.remove(image_path)

        # Delete the article from the database
        db.session.delete(article)
        db.session.commit()

        # Provide feedback to the user
        flash("Article deleted successfully!", "success")
        # Redirect the user to a relevant page
        return redirect(url_for('article.article_list'))
    return render_template('admin/articles/delete_article.html', title=title)
