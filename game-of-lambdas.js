var dies = function(next) { 
    return function(f, alive, dead) {
        return f(next, dead);
    }
};

var lives = function(next) {
    return function(f, alive, dead) {
        return f(next, alive);
    }
};

var nope = function(f, alive, dead) {
    return f(nope, dead);
};

var advance = function(cell) {
    return cell(function(next, val) {
        return next;
    }, null, null);
}

var get = function(cell, alive, dead) {
    return cell(function(next, val) { 
        return val;
    }, alive, dead);
}

var rules = advance;
var yes   = lives;
var no    = dies;

var I = function(x) { return x; }

var L = function(y, next) {
    return function(x, f) {
        return next(f(y, x), f);
    }
}

var neighbours = function(x, y, board, N) {
    var cell = function(x, y) { return board[y * N + x]; };

    var x0 = (x + N - 1) % N,
        x1 = x,
        x2 = (x + 1) % N,
        y0 = (y + N - 1) % N,
        y1 = y,
        y2 = (y + 1) % N;

    return L(cell(x0, y0),
           L(cell(x1, y0),
           L(cell(x2, y0),
           L(cell(x0, y1),
           L(cell(x2, y1),
           L(cell(x0, y2),
           L(cell(x1, y2),
           L(cell(x2, y2), 
               I))))))));
}

var nextCell = function(cell, neighbours) {
    return get(neighbours(rules(cell), function(current, acc) {
        return get(current, advance, I)(acc);
    }), alive, dead);
}

/**
 * Return the next state of the board
 */
var nextBoard = function(board, N) {
    return _.map(board, function(cell, i) {
        var x = i % N;
        var y = Math.floor(i / N);

        var n = neighbours(x, y, board, N);
        return nextCell(board[i], n);
    });
}

//                   # of live neighbours
//                   0    1     2      3      4+
var alive = yes ( dies (dies (lives (lives (nope)))));
var dead  = no  ( dies (dies (dies  (lives (nope)))));
