from flask import Flask, render_template, render_template, session, redirect, url_for, request
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from app.config import Config, db, session
from flask_migrate import Migrate
from app.models import User

app = Flask(__name__)

# configure the app
app.config.from_object(Config)
db.init_app(app)
session.init_app(app)
migrate = Migrate(app, db)

# create the database tables
with app.app_context():
    db.create_all() 

# initialize flask-login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'


# load user
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# ROUTES


# login route
@app.route('/login', methods=['GET', 'POST'])
def login():

    if request.method == 'POST':

        # get username/pw from form
        username = request.form['username']
        password = request.form['password']

        # check if user exists / pw is correct
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password_hash, password):
            login_user(user)
            print('User logged in:', user.username)
            return render_template('index.html')
        else:
            print('Invalid username or password') # Replace with flash message in production
            return render_template('login.html', msg='Invalid username or password')

    return render_template('login.html')


# logout route
@app.route('/logout')
@login_required
def logout():

    # log out the user
    print('Logging out user:', current_user.username)
    logout_user()

    return render_template('login.html')


# register route (for testing purposes; remove in production)
@app.route('/register', methods=['GET', 'POST'])
def register():

    # if form is submitted
    if request.method == 'POST':

        # get username/pw from form
        username = request.form['username']
        password = request.form['password']
        
        # check if user already exists
        user = User.query.filter_by(username=username).first()
        if user:

            # if user exists, return error message
            return render_template('register.html', msg='User already exists')
        else:

            # create a new user and add to the database
            password_hash = generate_password_hash(password)
            new_user = User(username=username, password_hash=password_hash)
            db.session.add(new_user)
            db.session.commit()

            # log in the new user
            return redirect(url_for('login'))

    return render_template('register.html')


# main application entry point
@app.route('/')
@login_required
def index():
    return render_template('index.html')
