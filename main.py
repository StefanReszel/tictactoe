import os

from tictactoe.socketio import socketio, app, db


if __name__ == '__main__':
    if not os.path.exists('db.sqlite3'):
        with app.app_context():
            db.create_all()

    socketio.run(app, allow_unsafe_werkzeug=True)
