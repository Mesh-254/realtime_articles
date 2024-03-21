from flask import *
from forms import UserLoginForm
from flask_login import current_user, login_user, logout_user, login_required
from models.models import User
from urllib.parse import urlsplit
from sqlalchemy import or_

user = Blueprint('user', __name__)


@user.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('user.index'))

    form = UserLoginForm()
    if form.validate_on_submit():
        # Try to find user by username
        user = User.query.filter(or_(User.username == form.email_or_username.data,
                                     User.email == form.email_or_username.data)).first()
        # Check if user exists and password matches
        if user and user.check_password(form.password.data):
            login_user(user, remember=form.remember_me.data)
            next_page = request.args.get('next')
            # Check if there's a next page or if it's a valid URL
            if not next_page or urlsplit(next_page).netloc != '':
                next_page = url_for('user.index')
                return redirect(next_page)
        else:
            flash('Invalid username or password', 'danger')
            return redirect(url_for('user.login'))
    return render_template('login/login.html', form=form)


@user.route('/')
@user.route('/index')
def index():
    user = {'username': 'Miguel'}
    return render_template('home/blog_list.html', title='Home', user=user)


@user.route('/logout')
def logout():
    logout_user()
    return "you have logged out"
