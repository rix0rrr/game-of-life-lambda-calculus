var underscore = _;

test("Alive And Dead", function() {
    // Check that alive only lives on 2 or 3 nexsts
    for (var neighbours = 0; neighbours < 10; neighbours++) {
        var state = rules(alive);
        for (var i = 0; i < neighbours; i++) {
            state = advance(state);
        }

        var life = get(state, true, false);
        ok(life == (neighbours == 2 || neighbours == 3));
    }

    // Check that dead only lives on 3 nexts
    for (var neighbours = 0; neighbours < 10; neighbours++) {
        var state = rules(dead);
        for (var i = 0; i < neighbours; i++) {
            state = advance(state);
        }

        var life = get(state, true, false);
        ok(life == (neighbours == 3));
    }
});

test("nextCell", function() {
    var neighbours = L(alive, L(alive, L(dead, L(dead, L(dead, L(dead, I))))));
    var next = nextCell(alive, neighbours);
    ok(get(next, true, false));

    var next = nextCell(dead, neighbours);
    ok(get(next, false, true));
});

test("neighbours", function() {
    var toList = function(current, acc) {
        return acc.concat([current]);
    }

    var board = [ 1, 2, 3, 4, 5,
                  6, 7, 8, 9,10,
                 11,12,13,14,15,
                 16,17,18,19,20,
                 21,22,23,24,25];

    var n = neighbours(2, 2, board, 5)([], toList);
    deepEqual(n, [7, 8, 9, 12, 14, 17, 18, 19]);

    var n = neighbours(4, 2, board, 5)([], toList);
    deepEqual(n, [9, 10, 6, 14, 11, 19, 20, 16]);
});

test("nextBoard", function() {
    // Use aliases for ASCII art
    var X = alive;
    var _ = dead;

    var glider1 = [_,_,_,_,_,
                   _,_,X,_,_,
                   _,_,_,X,_,
                   _,X,X,X,_,
                   _,_,_,_,_];

    // Change alias meaning to string so we can do string compares
    var X = 'X';
    var _ = '_';

    var glider2 = [_,_,_,_,_,
                   _,_,_,_,_,
                   _,X,_,X,_,
                   _,_,X,X,_,
                   _,_,X,_,_];

    var glider3 = [_,_,_,_,_,
                   _,_,_,_,_,
                   _,_,_,X,_,
                   _,X,_,X,_,
                   _,_,X,X,_];

    
    var result2 = nextBoard(glider1, 5);
    var strrep2 = underscore.map(result2, function(cell) { return get(cell, X, _); });
    deepEqual(strrep2, glider2);

    var result3 = nextBoard(result2, 5);
    var strrep3 = underscore.map(result3, function(cell) { return get(cell, X, _); });
    deepEqual(strrep3, glider3);
});
