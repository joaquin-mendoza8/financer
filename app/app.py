from flask import Flask, render_template, render_template, session, redirect, url_for, request, jsonify, flash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from flask_session import Session
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

app.secret_key = '1080#hubble_app!1440'
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
Session(app)

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Dummy user storage (replace with a database in production)
users = {}

# User class
class User(UserMixin):
    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password_hash = generate_password_hash(password)

# Load user
@login_manager.user_loader
def load_user(user_id):
    return users.get(user_id)

# ROUTES

# Login route
@app.route('/login', methods=['GET', 'POST'])
def login():

    msg = None

    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = next((u for u in users.values() if u.username == username), None)
        if user and check_password_hash(user.password_hash, password):
            login_user(user)
            return redirect(url_for('index'))
        else:
            print('Invalid username or password') # Replace with flash message in production
            msg = 'Invalid username or password'
    
    return render_template('index.html', msg=msg)

# Logout route
@app.route('/logout')
@login_required
def logout():

    print('Logging out user:', current_user.username)
    logout_user()

    # return redirect(url_for('login'))
    return render_template('login.html')

# Register route (for testing purposes; remove in production)
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username in [u.username for u in users.values()]:
            print('User already exists') # Replace with flash message in production
            pass
        else:
            user_id = str(len(users) + 1)
            users[user_id] = User(user_id, username, password)
            return redirect(url_for('login'))
    return render_template('register.html')

# Main application entry point
@app.route('/')
@login_required
def index():
    return render_template('index.html')
