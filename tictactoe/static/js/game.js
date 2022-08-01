const figures = {
    circle: '&#9675;',
    cross: '&times;',
};

let players;

let player_name;
let credits;
let player_figure;
let turn;

let start_time;
let time_of_round;


const socket = io();


socket.on('connect', () => {
    socket.emit('add_player');
});


socket.on('add_player', (data) => {
    player_name = data['player_name'];
    credits = data['players_credits'];

    put_credits_in_html();

    if (data['amount_of_players'] == 2){
        socket.emit('start_round');
    }
});


socket.on('start_round', (data) => {
    reset_round();

    add_listener_on_board();

    players = data['players'];
    credits = data['credits'][player_name];

    put_credits_in_html();
    
    let starting = data['starting'];

    if (starting == player_name){
        turn = true;
        player_figure = figures['circle']
    }else{
        turn = false;
        player_figure = figures['cross']
    }

    start_time = Date.now();
});


socket.on('has_zero_credits', () => {
    if (credits == 0){
        alert(ADD_CREDITS);
    }
})


socket.on('has_not_enough_credits', () => {
    if (credits < 3){
        logout_player();
    }
})


socket.on('remove_player', () => {
    let data = {
        'player_name': player_name,
        'credits': credits,
    }

    reset_round();
    turn = false;
    
    socket.emit('remove_player', data);
});


socket.on('set_figure_on_board', (data) => {
    switch_order();

    let field_id = data['field_id'];
    let figure = data['figure'];
    
    board_empty = false;

    board[field_id] = figure;
    
    $(`#${field_id}`).html(`<span class=figure>${figure}<span/>`);

    if (check_board(player_figure)){
        socket.emit('winner', {'winner': player_name});

    }else if (moves == 9 && !turn){
        socket.emit('tie');
    };
});


socket.on('winner', (data) => {

    time_of_round = get_time_of_round();

    let winner = data['winner'];

    let opponent = players.indexOf(player_name) == 0 ? players[1] : players[0];
    let win = winner == player_name ? 1 : 0;
    let loss = winner == player_name ? 0 : 1;
    let tie = 0;
    
    add_statistic(time_of_round, opponent, win, loss, tie);
    
    board_empty = true;
    $('.board').off();

    get_stats();

    if (player_name == winner){
        credits = data['winners_credits'];
        put_credits_in_html();

        socket.emit('start_round');
    }
})


socket.on('tie', (data) => {    
    time_of_round = get_time_of_round();
    
    let opponent = players.indexOf(player_name) == 0 ? players[1] : players[0];
    let win = 0
    let loss = 0
    let tie = 1

    add_statistic(time_of_round, opponent, win, loss, tie);

    board_empty = true;
    $('.board').off();

    get_stats();

    if (player_name == data['round_starter']){
        socket.emit('start_round');
    }
});


function add_listener_on_board(){
    $('.board').off();

    $('.board').on( "click", (el) => {
        if (turn && el.target.id){
            if (!board[el.target.id]){
                socket.emit('set_figure_on_board',
                {
                    'field_id': el.target.id,
                    'figure': player_figure,
                });
            }
        }
    });
}


function add_statistic(duration, opponent, win, loss, tie){
    $.ajax({
        type: "POST",
        url: window.location.origin + '/stats',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            duration: duration,
            opponent: opponent,
            win: win,
            loss: loss,
            tie: tie,
        }),
    });    
}


function reset_round(){
    board = new Array(9);
    moves = 0

    $('.square').html("");
}


function switch_order(){
    if (turn){
        turn = false;
    }else{
        turn = true;
    }
}


function get_time_of_round(){
    return (Date.now() - start_time) / 1000;
}
