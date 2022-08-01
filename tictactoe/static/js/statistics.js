function get_stats(){
    $.ajax({
        type: "GET",
        url: window.location.origin + '/stats',
    }).done((stats) => {
        let table_body;

        for (let i=0; i < stats.length; i++){
            table_body +=
                `<tr>
                    <td class="opponent">${stats[i].opponent}</td>
                    <td class="wins">${stats[i].wins}</td>
                    <td class="losses">${stats[i].losses}</td>
                    <td class="ties">${stats[i].ties}</td>
                    <td class="game_duration">${stats[i].game_duration}</td>
                </tr>`;
    
            }
        $('.table_body').html(table_body);
    });
}
