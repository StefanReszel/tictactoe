let board = new Array(9);
let board_empty = true;

let moves = 0;


function check_board(figure){
    moves += 1;

    if (moves > 4){
        if (check_rows(figure) || check_columns(figure) || check_diagonal(figure)){
            return true
        }
    }
}

function check_rows(figure){
    let index = 0

    for (let i=0; i<3; i++){
        if (figure == board[index] && board[index] == board[index+1] && board[index+1] == board[index+2]){
            return true
        }
        index += 3
    }
}

function check_columns(figure){
    for (let i=0; i<3; i++){
        if (figure == board[i] && board[i] == board[i+3] && board[i+3] == board[i+6]){
            return true
        }
    }
}
        
function check_diagonal(figure){
    let first_diagonal = (figure == board[0] && board[0] == board[4] && board[4] == board[8]);
    let second_diagonal = (figure == board[2] && board[2] == board[4] && board[4]  == board[6]);

    if (first_diagonal || second_diagonal){
        return true
    }
}
