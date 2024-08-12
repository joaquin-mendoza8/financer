import unittest
from app import app
from app.config import db
from app.models import User
from dotenv import load_dotenv
import os

# load environment variables
load_dotenv()

class BasicTests(unittest.TestCase):

    # setup before each test
    def setUp(self):
        app.config['TESTING'] = True
        self.app = app.test_client()
        db.create_all()  # create new db for each test

    # teardown after each test
    def tearDown(self):
        db.session.remove()
        db.drop_all()

    # test home page
    def test_home_page(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)

    # test user registration
    def test_user_registration(self):
        response = self.app.get('/register')
        self.assertEqual(response.status_code, 200)

    # Test User Login
    def test_user_login(self):
        username = os.environ.get('TEST_USER')
        password = os.environ.get('TEST_PASSWORD')

        response = self.app.post('/login', data=dict(
            username=username,
            password=password
        ), follow_redirects=True)
        self.assertEqual(response.status_code, 200)

if __name__ == "__main__":
    unittest.main()
