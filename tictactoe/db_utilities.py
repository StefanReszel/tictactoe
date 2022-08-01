from sqlalchemy.exc import SQLAlchemyError, IntegrityError

from tictactoe import db
from .messages import Messages


def add_obj_to_db(obj):
    try:
        db.session.add(obj)
        db.session.commit()

    except IntegrityError as error:
        error.message = Messages.DB_INTEGRITY_ERROR_MESSAGE
        return error

    except SQLAlchemyError as error:
        error.message = Messages.DB_COMMON_ERROR_MESSAGE
        return error


def delete_obj_from_db(obj):
    db.session.delete(obj)
    db.session.commit()


def clear_tables(*tables):
    for table in tables:
        db.session.query(table).delete()
        db.session.commit()
