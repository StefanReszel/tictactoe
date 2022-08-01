import secrets

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_marshmallow import Marshmallow


db = SQLAlchemy()
ma = Marshmallow()
login_manager = LoginManager()


def create_app():
    app = Flask(__name__)

    app.config['SECRET_KEY'] = secrets.token_hex()
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///../db.sqlite3"

    app.url_map.strict_slashes = False

    db.init_app(app)
    ma.init_app(app)
    login_manager.init_app(app)

    from .urls import bp
    app.register_blueprint(bp)

    return app
