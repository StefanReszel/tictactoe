let CAN_NOT_ADD_CREDITS_MESSAGE = "Możesz dodawać kredyty tylko gdy na koncie masz 0 i tablica jest pusta.";
let CAN_NOT_CONTINUE = "Masz za mało kredytów by kontynuować. Zostaniesz przekierowany do strony logowania.";
let ADD_CREDITS = "Dodaj kredyty."


function put_credits_in_html(){
    $('.credits').html(credits);
}


$('.add_credits').on('click', (event) => {
    event.preventDefault();

    if (credits == 0 && board_empty){
        socket.emit('add_credits',{'player_name': player_name});
    }else{
        alert(CAN_NOT_ADD_CREDITS_MESSAGE);
    }
})


function logout_player(){
        alert(CAN_NOT_CONTINUE);

        window.location.replace(window.origin);
}


socket.on('add_credits', (data) => {
    credits = data['players_credits']

    socket.emit('start_round');
})