/**
 * Created by MyPC on 24/10/2016.
 */
$(document).ready(function () {
//    define empty object which refer to empty 9 squares

    var obj = {};

    $("#myModal").modal("show");


    /*user choose O then PC take X
     * it is user's turn*/

    $("#o-btn").on("click", function () {
        window.usr = 'O';
        window.pc = 'X';
        $("#myModal").modal("hide");
        return (usrTurn());
    });

    /*user choose X then PC take O
     * it is PC's turn*/

    $("#x-btn").on("click", function () {
        window.usr = 'X';
        window.pc = 'O';
        $("#myModal").modal("hide");
        return (pcTurn());
    });

    /*
     function to set 'X' or 'O' in an empty square,
     parameters: id = square id & char = 'X' or 'O'
     also add new property to 'obj' to save busy squares like ('id' : 'X') or ('id' : 'O')
     */

    function set(id, char) {
        $('.td_game').off('click');
        if (!obj[id]) {
            if (char == 'X') {
                $("#" + id).addClass('text-danger');
            }
            else if (char == 'O') {
                $("#" + id).addClass('text-primary')
            }
            obj[id] = char;
            $('.td_game').off('click');
            $("#" + id).html(char).hide().fadeIn(100, function () {
                check();
            });
        }

    }

    /*
     function allows user to choose square,
     then call set() function sending chosen square id and user letter
     */

    function usrTurn() {
        $(".td_game").one("click", function () {
            if (!($(this).hasClass('text-primary')) && !($(this).hasClass('text-danger'))) {
                $('.td_game').off("click");
                set(this.id, usr);
                setTimeout(pcTurn, 150);
            }
        });
    }

    /*
     PC do some tests to choose perfect square,
     ach test equal a function returns true if one condition in this function was successful,
     else if test returned nothing (false) PC do the next test.. and so on,
     eventually PC end his turn by calling user turn function.
     */

    function pcTurn() {
        $(".td_game").off('click');
        if (!win()) {
            if (!block()) {
                if (!fork()) {
                    if (!blockFork()) {
                        if (!center()) {
                            if (!oppCorner()) {
                                if (!empCorner()) {
                                    empSide();
                                }
                            }
                        }
                    }
                }
            }
        }
        return usrTurn();
    }

    /*
     1st test: checking if there is a direct chance to win
     (which means two squares side by side contains PC letter) then set the third square to PC letter to finish the game
     */

    function win() {
        var arr = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            [1, 4, 7],
            [2, 5, 8],
            [3, 6, 9],
            [1, 5, 9],
            [3, 5, 7]
        ];
        for (var i in arr) {
            var row = arr[i];
            if (obj[row[0]] === pc && obj[row[1]] === pc && !(obj[row[2]])) {
                set(row[2], pc);
                return true;
            }
            if (obj[row[0]] === pc && obj[row[2]] === pc && !(obj[row[1]])) {
                set(row[1], pc);
                return true;
            }
            if (obj[row[1]] === pc && obj[row[2]] === pc && !(obj[row[0]])) {
                set(row[0], pc);
                return true;
            }
        }
    }


    /*
     2nd test: if there isn't a direct chance for PC to win (1st test), check if there is a direct chance for user to win and block it to prevent him from winning
     */
    function block() {
        var arr = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            [1, 4, 7],
            [2, 5, 8],
            [3, 6, 9],
            [1, 5, 9],
            [3, 5, 7]
        ];
        for (var i in arr) {
            var row = arr[i];
            if (obj[row[0]] === usr && obj[row[1]] === usr && !(obj[row[2]])) {
                set(row[2], pc);
                return true;
            }
            if (obj[row[0]] === usr && obj[row[2]] === usr && !(obj[row[1]])) {
                set(row[1], pc);
                return true;
            }
            if (obj[row[1]] === usr && obj[row[2]] === usr && !(obj[row[0]])) {
                set(row[0], pc);
                return true;
            }
        }
    }


    /*
     if there is no chance to win and no threats (first two tests), check if there is any chance to create a chance to win
     */
    function fork() {
        if (!((obj[1]) || (obj[2]) || (obj[3]) || (obj[4]) || (obj[5]) || (obj[6]) || (obj[7]) || (obj[8]) || (obj[9])) && Math.random() >= 0.3) {
            var corners = [1, 3, 7, 9];
            set(corners[Math.round(Math.random() * 4) - 1], pc);
            return true;
        }

        // Three corners
        var arr1 = [
            [9, 3, 1],
            [3, 1, 7],
            [1, 7, 9],
            [7, 9, 3]
        ];

        for (var i in arr1) {
            var row = arr1[i];
            if (obj[row[0]] === pc) {
                if ((obj[5]) && !(obj[row[2]])) {
                    set(row[2], pc);
                    return true;
                } else if (!(obj[row[1]]) && !(obj[((row[0] + row[1]) / 2)])) {
                    set(row[1], pc);
                    return true;
                }
            }
            if (obj[row[2]] === pc) {
                if ((obj[5]) && !(obj[row[0]])) {
                    set(row[0], pc);
                    return true;
                } else if (!(obj[row[1]]) && !(obj[((row[2] + row[1]) / 2)])) {
                    set(row[1], pc);
                    return true;
                }
            }
        }

        // center & Two corners
        var arr2 = [
            [1, 5, 3],
            [3, 5, 9],
            [9, 5, 7],
            [7, 5, 1]
        ];

        for (var i in arr2) {
            var row = arr2[i];
            if (obj[row[0]] === pc && obj[row[1]] === pc && !(obj[row[2]])) {
                set(row[2], pc);
                return true;
            }
            if (obj[row[0]] === pc && obj[row[2]] === pc && !(obj[row[1]])) {
                set(row[1], pc);
                return true;
            }
            if (obj[row[1]] === pc && obj[row[2]] === pc && !(obj[row[0]])) {
                set(row[0], pc);
                return true;
            }
        }
    }


    /*
     4th test: prevent user from creating any chance to win
     */

    function blockFork() {

        if (obj[2] === usr && obj[6] === usr && !(obj[3])) {
            set(3, pc);
            return true;
        } else if (obj[8] === usr && obj[6] === usr && !(obj[9])) {
            set(9, pc);
            return true;
        } else if (obj[8] === usr && obj[4] === usr && !(obj[7])) {
            set(7, pc);
            return true;
        } else if (obj[2] === usr && obj[4] === usr && !(obj[1])) {
            set(1, pc);
            return true;
        }

        var arr1 = [
            [9, 3, 1],
            [3, 1, 7],
            [1, 7, 9],
            [7, 9, 3]
        ];

        for (var i in arr1) {
            var row = arr1[i];

            if (obj[row[0]] === usr && obj[row[2]] === usr && !(obj[((row[1] + row[2]) / 2)])) {
                set(((row[1] + row[2]) / 2), pc);
                return true;
            }
            if (obj[row[2]] === usr && obj[row[0]] === usr && !(obj[((row[0] + row[1]) / 2)])) {
                set(((row[0] + row[1]) / 2), pc);
                return true;
            }
        }
    }


    /*
     previous tests failed ? center looks a strategic square, at least better than corners or sides
     */
    function center() {
        if (!(obj[5])) {
            set(5, pc);
            return true;
        }
    }

    function oppCorner() {
        if (obj[1] === usr && !(obj[9])) {
            set(9, pc);
            return true;
        }
        if (obj[9] === usr && !(obj[1])) {
            set(1, pc);
            return true;
        }
        if (obj[3] === usr && !(obj[7])) {
            set(7, pc);
            return true;
        }
        if (obj[7] === usr && !(obj[3])) {
            set(3, pc);
            return true;
        }
    }

    /*
     seems that we have a draw, lets fill the empty corners
     */
    function empCorner() {
        if (!(obj[9])) {
            set(9, pc);
            return true;
        }
        if (!(obj[1])) {
            set(1, pc);
            return true;
        }
        if (!(obj[7])) {
            set(7, pc);
            return true;
        }
        if (!(obj[3])) {
            set(3, pc);
            return true;
        }
    }

    /*
     fill the empty sides, Game Over.
     */
    function empSide() {
        if (!(obj[2])) {
            return (set(2, pc));
        } else if (!(obj[4])) {
            return (set(4, pc));
        } else if (!(obj[6])) {
            return (set(6, pc));
        } else if (!(obj[8])) {
            return (set(8, pc));
        }
    }


    /*
     For each set() function calling check if we have a winner here
     */

    function check() {
        var arr = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            [1, 4, 7],
            [2, 5, 8],
            [3, 6, 9],
            [1, 5, 9],
            [3, 5, 7]
        ];

        for (var i in arr) {
            var row = arr[i];
            if (obj[row[0]] === pc && obj[row[1]] === pc && obj[row[2]] === pc) {
                $('.td_game').off('click');
                window.lastWinner = 'pc';
                setTimeout(function () {
                    $('#' + row[0] + ', #' + row[1] + ', #' + row[2]).effect('pulsate', {
                        time: 1
                    }, 400);
                }, 100);
                return (setTimeout(clearPC, 1200));
            }

        }
        if ((obj[1]) && (obj[2]) && (obj[3]) && (obj[4]) && (obj[5]) && (obj[6]) && (obj[7]) && (obj[8]) && (obj[9])) {
            return (setTimeout(clearDraw, 600));
        }
    }

    /*
     PC wins
     clear all squares, start a new game
     */
    function clearPC() {
        $('#lose').modal('show');
        $('#lose').on('hidden.bs.modal', function () {
            $('.td_game').removeClass('text-danger');
            $('.td_game').removeClass('text-primary');
            $('.td_game').empty();
            for (var i = 1; i <= 9; i++) {
                obj[i] = '';
            }
        });
        pcTurn();
        return (usrTurn());
    }

    /*
     Draw!
     start a new game
     */
    function clearDraw() {
        $('#draw').modal('show');
        $('#draw').on('hidden.bs.modal', function () {
            $('.td_game').removeClass('text-danger');
            $('.td_game').removeClass('text-primary');
            $('.td_game').empty();
            for (var i = 1; i <= 9; i++) {
                obj[i] = '';
            }
            if (lastWinner == 'pc') {
                pcTurn();
            }
            return (usrTurn());
        });
    }

    $('#reset').on('click', function () {
        $('.td_game').removeClass('text-danger');
        $('.td_game').removeClass('text-primary');
        $('.td_game').empty();
        for (var i = 1; i <= 9; i++) {
            obj[i] = '';
        }
        $('#myModal').modal('show');
    });

});





