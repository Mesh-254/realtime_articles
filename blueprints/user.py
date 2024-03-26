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
        return redirect(url_for('article.base'))

    form = UserLoginForm()
    if form.validate_on_submit():
        # Try to find user by username or email
        user = User.query.filter(or_(User.username == form.email_or_username.data,
                                     User.email == form.email_or_username.data)).first()
        # Check if user exists and password matches
        if user and user.check_password(form.password.data):
            if user.is_admin:  # Check if the user is an admin
                login_user(user, remember=form.remember_me.data)
                next_page = request.args.get('next')
                # Check if there's a next page or if it's a valid URL
                if not next_page or urlsplit(next_page).netloc != '':
                    next_page = url_for('article.base')
                return redirect(next_page)
            else:
                flash('Only admins are allowed to log in.', 'danger')
        else:
            flash('Invalid username or password', 'danger')
    return render_template('login/login.html', form=form)

@user.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('user.login'))
