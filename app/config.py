from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
import os
import pymysql
pymysql.install_as_MySQLdb()

# create db and session objects
if 'db' not in globals():
    db = SQLAlchemy()
session = Session()

class Config:
    # secret key for session
    SECRET_KEY = os.environ.get('SECRET_KEY')

    # session configuration
    SESSION_TYPE = 'sqlalchemy'
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True
    SESSION_SQLALCHEMY = db

    # db connection
    DATABASE_URL_DEV = os.environ.get('DATABASE_URL_DEV')
    DATABASE_URL_PROD = os.environ.get('DATABASE_URL_PROD')
    SQLALCHEMY_DATABASE_URI = DATABASE_URL_DEV if os.environ.get('RUN_DEV') == "True" else DATABASE_URL_PROD
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL_DEV') # use dev db for testing
    WTF_CSRF_ENABLED = False  # disable CSRF protection in testing env