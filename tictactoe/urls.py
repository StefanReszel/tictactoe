
from flask import Blueprint

from .views import *


bp = Blueprint('tictactoe', __name__)


bp.add_url_rule('/', view_func=SignInPlayer.as_view('sign-in'))
bp.add_url_rule('/board', view_func=Board.as_view('board'))
bp.add_url_rule('/stats', view_func=PlayerStatisticsData.as_view('stats'))
