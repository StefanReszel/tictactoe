const figures = {
    circle: '&#9675;',
    cross: '&times;',
};

let players;
let player_name;
let player_figure;
let turn;

let start_time;
let time_of_round;


const socket = io();


socket.on('connect', () => {
    socket.emit('get_players');
});


socket.on('get_players', (data) => {
    players = data.players;

    if (players.length < 2 && !player_name){

        socket.emit('add_player');
    }
    if (players.length == 2 && players[0] == player_name){
        socket.emit('set_order');
    }
})


socket.on('add_player', (data) => {
    player_name = data['player'];

    if (!players.includes(player_name)){
        socket.emit('get_players');
    }
});


socket.on('set_order', (data) => {
    let starting = data['starting'];

    if (starting == player_name){
        turn = true;
        player_figure = figures['circle']
    }else{
        turn = false;
        player_figure = figures['cross']
    }

    time_of_round = get_time_of_round();
    start_time = Date.now();
});


socket.on('remove_player', () => {    
    socket.emit('remove_player', {'player_name': player_name});
    reset_game();
    turn = false;
});


$('.board').click((el) => {
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


socket.on('set_figure_on_board', (data) => {
    switch_order();

    let field_id = data['field_id'];
    let figure = data['figure'];
    
    board[field_id] = figure;

    $(`#${field_id}`).html(`<span class=figure>${figure}<span/>`);

    if (check_board(player_figure)){
        socket.emit('set_order');
        socket.emit('winner', {'winner': player_name});

    }else if (moves == 9 && !turn){
        socket.emit('set_order');
        socket.emit('tie');
    };
});


socket.on('winner', (data) => {
    let winner = data['winner'];

    let opponent = players.indexOf(player_name) == 0 ? players[1] : players[0];
    let win = winner == player_name ? 1 : 0;
    let loss = winner == player_name ? 0 : 1;
    let tie = 0;

    add_statistic(time_of_round, opponent, win, loss, tie);
    reset_game();
})


socket.on('tie', () => {    
    let opponent = players.indexOf(player_name) == 0 ? players[1] : players[0];
    let win = 0
    let loss = 0
    let tie = 1

    add_statistic(time_of_round, opponent, win, loss, tie);
    reset_game();
});


function reset_game(){
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
        success: () => {console.log("STATS CREATED")},
    });    
}