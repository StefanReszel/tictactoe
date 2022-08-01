import os

from tictactoe.socketio import socketio, app, db


if __name__ == '__main__':
    if not os.path.exists('db.sqlite3'):
        db.create_all(app=app)

    socketio.run(app)
