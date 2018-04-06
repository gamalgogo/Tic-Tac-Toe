var computerPlayed=false;
var gameON=true;

$(function() {

    var player = 1;
    var table = $('table');
    var messages = $('.messages');
    var turn = $('.turn');

    displayNextPlayer(turn, player);

    $('td').click(function() {
        if (gameON==false){
            console.log(gameON);
            return false;
        }
        td = $(this);
        var state = getState(td);
        if(!state) {
            var pattern = definePatternForCurrentPlayer(player);
            changeState(td, pattern);

            if ($('#autoplay').is(':checked')){
                if (computerPlayed){
                    computerPlayed=false;
                }else {
                    autoMove(table, pattern);
                }
            }

            if(checkIfPlayerWon(table, pattern)) {
                messages.html('Player '+player+' has won.');
                gameON=false;
                turn.html('');
            } else {

                if(checkIfTie(table)) {
                    messages.html('Result is Tie.');
                    gameON=false;
                    turn.html('');
                }else {
                    player = setNextPlayer(player);
                    displayNextPlayer(turn, player);
                }

            }
        } else {
            messages.html('This box is already checked.');
        }
    });

    $('.reset').click(function() {
        gameON=true;
        player = 1;
        messages.html('');
        reset(table);
        displayNextPlayer(turn, player);
    });

});

/**
 *
 * @param table
 * @param pattern
 */
function autoMove(table, pattern) {
    var row1 = [];
    var row2 = [];
    var row3 = [];
    var playerUnit;
    table.find('td').each(function (index) {
        var item = '';
        if ($(this).hasClass('cross')) {
            item = 'X';
        } else if ($(this).hasClass('circle')) {
            item = 'O';
        }
        if ([0, 1, 2].indexOf(index) != -1) {
            row1.push(item);
        } else if ([3, 4, 5].indexOf(index) != -1) {
            row2.push(item);
        } else if ([6, 7, 8].indexOf(index) != -1) {
            row3.push(item);
        }
    });

    var rows = [row1,row2,row3];

    if (pattern = 'cross') {
        playerUnit='X';
    } else{
        playerUnit='O';
    }
    $.ajax({
        type: "POST",
        url: window.location.href+'src/ApiCall.php',
        data: {boardState: rows, playerUnit: playerUnit},
        success: function (data) {
            setTimeout(function () {
                $('td[data-x='+data[0]+'][data-y='+data[1]+']').click();
            },300);
            computerPlayed=true;
        }
    });
}

/**
 *
 * @param td
 * @returns {number}
 */
function getState(td) {
    if(td.hasClass('cross') || td.hasClass('circle')) {
        return 1;
    } else {
        return 0;
    }
}

/**
 *
 * @param td
 * @param pattern
 * @returns {*}
 */
function changeState(td, pattern) {
    return td.addClass(pattern);
}

/**
 *
 * @param player
 * @returns {string}
 */
function definePatternForCurrentPlayer(player) {
    if(player == 1) {
        return 'cross';
    } else {
        return 'circle';
    }
}

/**
 *
 * @param player
 * @returns {number}
 */
function setNextPlayer(player) {
    if(player == 1) {
        return player = 2;
    } else {
        return player = 1;
    }
}

/**
 *
 * @param turn
 * @param player
 */
function displayNextPlayer(turn, player) {
    turn.html('Player turn : '+player);
}

/**
 *
 * @param table
 * @returns {boolean}
 */
function checkIfTie(table) {
    var tie = true;
    table.find('td').each(function() {
        if (!$(this).hasClass('cross') && !$(this).hasClass('circle')){
            tie = false;
            return false;
        }
    });
    return tie;
}

/**
 *
 * @param table
 * @param pattern
 * @returns {number}
 */
function checkIfPlayerWon(table, pattern) {

    var won = 0;
    if(table.find('.item1').hasClass(pattern) && table.find('.item2').hasClass(pattern) && table.find('.item3').hasClass(pattern)) {
        won = 1;
    } else if (table.find('.item1').hasClass(pattern) && table.find('.item4').hasClass(pattern) && table.find('.item7').hasClass(pattern)) {
        won = 1;
    } else if (table.find('.item1').hasClass(pattern) && table.find('.item5').hasClass(pattern) && table.find('.item9').hasClass(pattern)) {
        won = 1;
    } else if (table.find('.item4').hasClass(pattern) && table.find('.item5').hasClass(pattern) && table.find('.item6').hasClass(pattern)) {
        won = 1;
    } else if (table.find('.item7').hasClass(pattern) && table.find('.item8').hasClass(pattern) && table.find('.item9').hasClass(pattern)) {
        won = 1;
    } else if (table.find('.item2').hasClass(pattern) && table.find('.item5').hasClass(pattern) && table.find('.item8').hasClass(pattern)) {
        won = 1;
    } else if (table.find('.item3').hasClass(pattern) && table.find('.item6').hasClass(pattern) && table.find('.item9').hasClass(pattern)) {
        won = 1;
    } else if (table.find('.item3').hasClass(pattern) && table.find('.item5').hasClass(pattern) && table.find('.item7').hasClass(pattern)) {
        won = 1;
    }
    return won;
}

/**
 *
 * @param table
 */
function reset(table) {
    table.find('td').each(function() {
        $(this).removeClass('circle').removeClass('cross');
    });
}