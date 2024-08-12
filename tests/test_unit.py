import pytest
from dotenv import load_dotenv

import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.app import app
from app.config import db

# load env variables
load_dotenv()

# setup function, run before each test
@pytest.fixture(autouse=True)
def setup_and_teardown():
    with app.app_context():
        db.create_all()  # create new db for each test
    yield
    with app.app_context():
        db.session.remove()
        db.drop_all()

# test home page
def test_home_page():
    client = app.test_client()
    response = client.get('/')
    assert response.status_code == 302

# test user registration page
def test_user_registration():
    client = app.test_client()
    response = client.get('/register')
    assert response.status_code == 200

# test user login
def test_user_login():
    client = app.test_client()
    username = os.environ.get('TEST_USER')
    password = os.environ.get('TEST_PASSWORD')

    response = client.post('/login', data=dict(
        username=username,
        password=password
    ), follow_redirects=True)
    assert response.status_code == 200
