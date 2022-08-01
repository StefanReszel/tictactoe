def has_zero_credits(credits: dict):
    for player_credit in credits.values():
        if player_credit == 0:
            return True
    return False


def has_not_enough_credits(credits: dict):
    for player_credit in credits.values():
        if player_credit < 3:
            return True
    return False


def take_fee(credits: dict):
    for player_name in credits.keys():
        credits[player_name] -= 3
