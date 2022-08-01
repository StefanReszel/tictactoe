from flask import render_template, request, redirect, url_for, flash
from flask.views import MethodView
from flask_login import current_user, login_user, login_required

from sqlalchemy.sql import func

from tictactoe import login_manager, db

from .models import Player, PlayerStatistics, statistic_schema
from .forms import PlayerForm
from .db_utilities import add_obj_to_db
from .messages import Messages


@login_manager.user_loader
def load_user(player_id):
    return Player.query.get(player_id)


class SignInPlayer(MethodView):
    def get(self):
        form = PlayerForm()
        return render_template('tictactoe/sign_in.html', form=form)

    def post(self):
        form = PlayerForm()

        if len(Player.query.all()) < 2:    
            if form.validate_on_submit():
                player_name = request.form['player_name']

                player = Player(name=player_name)

                error = add_obj_to_db(player)

                if not error:
                    login_user(player)
                    return redirect(url_for('tictactoe.board'))

                flash(error.message)
        else:
            flash(Messages.FULL_OF_PLAYERS)

        return render_template('tictactoe/sign_in.html', form=form)


class Board(MethodView):
    decorators = [login_required]

    def get(self):
        return render_template('tictactoe/board.html')


class PlayerStatisticsData(MethodView):
    decorators = [login_required]

    def get(self):
        statistics = db.session.query(
            PlayerStatistics.player_id,
            PlayerStatistics.opponent,
            func.sum(PlayerStatistics.win).label('wins'),
            func.sum(PlayerStatistics.loss).label('losses'),
            func.sum(PlayerStatistics.tie).label('ties'),
            func.sum(PlayerStatistics.duration).label('game_duration'),
            ).filter(PlayerStatistics.player_id == current_user.id).\
            group_by(PlayerStatistics.opponent)

        return statistic_schema.jsonify(statistics, many=True)

    def post(self):
        body = request.json

        new_statistic = PlayerStatistics(
            player_id = current_user.id,
            duration = body.get('duration'),
            opponent = body.get('opponent'),
            win = body.get('win'),
            loss = body.get('loss'),
            tie = body.get('tie'),
        )

        error = add_obj_to_db(new_statistic)

        if not error:
            return {
                'status': 'OK'
            }

        return{
            'status': 'ERROR',
            'message': error.message,
        }
