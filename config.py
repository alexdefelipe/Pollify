import os
basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    SECRET_KEY = os.environ.get(
        'SECRET_KEY') or b'^\xdd#S\x8a*Y\x9a\xa2\x89\xadi\xfbg\xc4\xb2'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'test.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CORS_HEADERS = "Content-Type"
    JWT_SECRET_KEY = b'\xae\x96\xa3\x93\x9f=\xb0\x8b\x89\xc2g\xaf\x11\xd0J\xd0'
