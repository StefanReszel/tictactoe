from flask_wtf import FlaskForm

from wtforms.fields import StringField
from wtforms.validators import DataRequired, Length


class PlayerForm(FlaskForm):
    player_name = StringField(
        label="Nazwa gracza",
        validators=[
            DataRequired(),
            Length(min=4),
            ],
        )