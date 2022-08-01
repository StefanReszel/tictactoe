from flask_login import UserMixin
from sqlalchemy.orm import relationship


from tictactoe import db, ma


class Player(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)

    statistics = relationship('PlayerStatistics', cascade="all, delete")

    def __repr__(self):
        return self.name


class PlayerStatistics(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    player_id = db.Column(db.Integer, db.ForeignKey('player.id'), nullable=False)
    duration = db.Column(db.Float, nullable=False)
    win = db.Column(db.Integer, nullable=False, default=0)
    loss = db.Column(db.Integer, nullable=False, default=0)
    tie = db.Column(db.Integer, nullable=False, default=0)
    opponent = db.Column(db.String(50), nullable=False)


class AggregatedStatisticsSchema(ma.Schema):
    class Meta:
        fields = ('player_id', 'opponent', 'wins', 'losses', 'ties', 'game_duration')


statistic_schema = AggregatedStatisticsSchema()
