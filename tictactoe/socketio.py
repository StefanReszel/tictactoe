from flask_socketio import SocketIO, emit
from flask_login import current_user
from tictactoe import create_app, db

from .models import Player, PlayerStatistics
from .db_utilities import delete_obj_from_db, clear_tables
from .credits_utilities import has_zero_credits, has_not_enough_credits, take_fee


app = create_app()
socketio = SocketIO(app)


players = []
credits = {}


@socketio.on('add_player')
def add_player():
    if len(players) < 2:
        player_name = current_user.name
        credits[player_name] = 10

        players.append(player_name)

        emit('add_player', {
            'player_name': player_name,
            'players_credits': credits[player_name],
            'amount_of_players': len(players),
            })


@socketio.on('disconnect')
def disconnect():
    if len(players) == 1:
        clear_tables(Player, PlayerStatistics)
        players.clear()
        credits.clear()
    else:
        emit('remove_player', broadcast=True)


@socketio.on('remove_player')
def remove_player(data):
    global players
    global credits

    player_name = data['player_name']
    player_credits = data['credits']

    player_to_delete = db.session.query(Player).filter(Player.name != player_name).first()

    players = [player_name]
    credits = {player_name: player_credits}

    delete_obj_from_db(player_to_delete)


@socketio.on('set_figure_on_board')
def set_figure_on_board(data):
    field_id = data["field_id"]
    figure = data["figure"]

    emit('set_figure_on_board', {'field_id': field_id, 'figure': figure}, broadcast=True)


@socketio.on('start_round')
def start_round():
    if has_zero_credits(credits):
        emit('has_zero_credits', broadcast=True)
    elif has_not_enough_credits(credits):
        emit('has_not_enough_credits', broadcast=True)
    else:
        take_fee(credits)

        emit('start_round', {
            'starting': players[0],
            'players': players,
            'credits': credits
            }, broadcast=True)

        players.reverse()


@socketio.on('winner')
def emit_winner(data):
    winner = data['winner']
    credits[winner] += 4

    emit('winner', {'winner': winner, 'winners_credits': credits[winner]}, broadcast=True)


@socketio.on('tie')
def tie():
    emit('tie', {'round_starter': players[0]}, broadcast=True)


@socketio.on('add_credits')
def add_credits(data):
    player_name = data['player_name']
    
    credits[player_name] = 10

    emit('add_credits', {'players_credits': credits[player_name]})
