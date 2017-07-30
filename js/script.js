angular.module('myApp', []).controller('myController', ['$scope', function ($scope) {
        $scope.template = 'main';
        $scope.player1 = 'Player 1';
        $scope.player2 = 'Player 2';

        $scope.changeTemplate = function (name) {
            $scope.template = name;
        };

        $scope.gameName = '';
        $scope.changeGame = function (name) {
            $scope.gameName = name;
        };

        $scope.setName = function (name1, name2) {
            if (name1 !== undefined && name2 !== undefined) {
                $scope.player1 = capitalizeFirstLetter(name1);
                $scope.player2 = capitalizeFirstLetter(name2);
            }
            else if (name1 !== undefined && name2 === undefined) {
                $scope.player1 = capitalizeFirstLetter(name1);
                $scope.player2 = 'Player 2';
            }
            else if (name1 === undefined && name2 !== undefined) {
                $scope.player1 = 'Player 1';
                $scope.player2 = capitalizeFirstLetter(name2);
            }
            else {
                $scope.player1 = 'Player 1';
                $scope.player2 = 'Player 2';
            }
        };

        // Take Away codes
        $scope.numberOfCoins = 10;
        $scope.taken = 0;

        $scope.take = function (amount) {
            $scope.taken = $scope.taken + amount;
        };

        $scope.turn = '';
        $scope.changeTurn = function () {
            if ($scope.taken < 7) {
                if ($scope.turn === '') {
                    $scope.turn = $scope.player1;
                }
                else if ($scope.turn === $scope.player1) {
                    $scope.turn = $scope.player2;
                }
                else {
                    $scope.turn = $scope.player1;
                }
            }
        };

        $scope.restartTakeAway = function () {
            $scope.taken = 0;
            $scope.turn = $scope.player1;
        };

        // Chomp codes
        $scope.chompOver = false;
        $scope.chompFlag = 0;
        $scope.rowNum = 4;
        $scope.columnNum = 7;
        $scope.matrix = makeChompMatrix($scope.rowNum, $scope.columnNum);
        
        $scope.chompTurn = '';
        $scope.changeChompTurn = function () {
            if ($scope.chompTurn === '') {
                $scope.chompTurn = $scope.player1;
            }
            else if ($scope.chompTurn === $scope.player1) {
                $scope.chompTurn = $scope.player2;
            }
            else {
                $scope.chompTurn = $scope.player1;
            }

        };

        $scope.chompDone = function () {
            if ($scope.chompFlag === 2) {
                $scope.chompOver = true;
                $scope.changeChompTurn();
            }
        };

        $scope.restartChomp = function () {
            playAgain();
            $scope.chompOver = false;
            $scope.chompFlag = 0;
            $scope.matrix = makeChompMatrix($scope.rowNum, $scope.columnNum);
            $scope.chompTurn = $scope.player1;
        };

        $scope.chompPos = function (row, column) {
            $scope.matrix = chompMatrix($scope.rowNum, $scope.columnNum, row, column, $scope.matrix);
        };

        $scope.increaseChompFlag = function () {
            $scope.chompFlag++;
        };
        
        //ChompAI
        $scope.chompAIChecked = false;
        $scope.chompAICheckedF = function(val) {
            $scope.chompAIChecked = val;
        };
        $scope.chompAI = function(x,y) {
            $scope.player2 = 'Computer';
            yourChoice(x,y);
        };
        
        

var c = 7;                //c = # columns.  Require 6 <= c <= 10.
var x, y;
var
        ppos = [1, 12, 23, 34, 45, 56, 113, 122, 224, 235, 246, 336, 355, 1114, 1125, 1133, 1222, 2226, 2255, 2335];
//perfect play for c=7 is achieved by adding 
//67,257,347,477,2237,2357,2447,3377,3457,4557 to ppos. 
//but ppos must be arranged in increasing order. 
//For c=8, add 78,268,448,2248,2368,2458,2588,3338.
var n = [];
$scope.box = [];

for (var i = 1; i <= 4; i++) {
    $scope.box[i] = [null,1,1,1,1,1,1,1];   
}

function yourChoice(u, v) {
    if ($scope.box[u][v] === 1) {
        Move(u, v);
        encode();
        if (n[1] + n[2] === 1) {
            //alert("Good work!\n You won!");
            return;
        }
        x = findMove();
        Move(x, y + 1);
        if ($scope.box[1][2] + $scope.box[2][1] === 0) {
            $scope.chompFlag = 2;
            //alert("Nice try,\n but I won!");
        }
        
    }
}
        
function Move(x, y) {
    for (var k1 = x; k1 <= 4; k1++) {
        for (var k2 = y; k2 <= c; k2++) {
            $scope.box[k1][k2] = 0;
        }
    }
}

function encode() {
    for (var i = 1; i < 5; i++) {
        n[i] = 0;
        for (var j = 1; j <= c; j++) {
            n[i] = n[i] + $scope.box[i][j];
        }
    }  
}

function findMove() {
    var t = 10;
    var k = ppos.length - 1;
    for (y = n[1] - 1; y >= n[2]; y--) {
        val = y + t * (n[2] + t * (n[3] + t * n[4]));
        while (val < ppos[k])
            k--;
        if (val === ppos[k]) {
            return 1;
        }
    }
    for (y = n[2] - 1; y >= n[3]; y--) {
        val = n[1] + t * (y + t * (n[3] + t * n[4]));
        while (val < ppos[k])
            k--;
        if (val === ppos[k]) {
            return 2;
        }
        val = y + t * (y + t * (n[3] + t * n[4]));
        while (val < ppos[k])
            k--;
        if (val === ppos[k]) {
            return 1;
        }
    }
    for (y = n[3] - 1; y >= n[4]; y--) {
        val = n[1] + t * (n[2] + t * (y + t * n[4]));
        while (val < ppos[k])
            k--;
        if (val === ppos[k]) {
            return 3;
        }
        val = n[1] + t * (y + t * (y + t * n[4]));
        while (val < ppos[k])
            k--;
        if (val === ppos[k]) {
            return 2;
        }
        val = y + t * (y + t * (y + t * n[4]));
        while (val < ppos[k])
            k--;
        if (val === ppos[k]) {
            return 1;
        }
    }
    for (y = n[4] - 1; y >= 0; y--) {
        val = n[1] + t * (n[2] + t * (n[3] + t * y));
        while (val < ppos[k])
            k--;
        if (val === ppos[k]) {
            return 4;
        }
        val = n[1] + t * (n[2] + t * (y + t * y));
        while (val < ppos[k])
            k--;
        if (val === ppos[k]) {
            return 3;
        }
        val = n[1] + t * (y + t * (y + t * y));
        while (val < ppos[k])
            k--;
        if (val === ppos[k]) {
            return 2;
        }
        val = y + t * (y + t * (y + t * y));
        while (val < ppos[k])
            k--;
        if (val === ppos[k]) {
            return 1;
        }
    }
    if ((Math.random() > .4) && (n[4] > 0)) {
        y = n[4] - 1;
        return 4;
    } else if ((Math.random() > .5) && (n[3] > 0)) {
        y = n[3] - 1;
        return 3;
    } else if ((Math.random() > .67) && (n[2] > 0)) {
        y = n[2] - 1;
        return 2;
    } else {
        y = n[1] - 1;
        return 1;
    }
}

function playAgain() {
    for (var i = 1; i <= 4; i++) {
        $scope.box[i] = [null,1,1,1,1,1,1,1];
    }
}

        // Nim codes
        $scope.restartNim = function () {
            $scope.nimOver = false;
            $scope.nimRow = 3;
            $scope.nimColumn = 10;
            $scope.nimMatrix = nimMatrixCal($scope.nimRow, $scope.nimColumn, makeMatrix($scope.nimRow, $scope.nimColumn));
            $scope.colors = candyArray($scope.nimColumn);
            $scope.nimRowNum = -1;
            $scope.nimTurn = $scope.player1;
        };

        $scope.nimOver = false;
        $scope.nimRow = 3;
        $scope.nimColumn = 10;
        $scope.nimMatrix = nimMatrixCal($scope.nimRow, $scope.nimColumn, makeMatrix($scope.nimRow, $scope.nimColumn));
        $scope.colors = candyArray($scope.nimColumn);
        $scope.nimRowNum = -1;

        $scope.nimTurn = '';
        $scope.changeNimTurn = function () {
            if ($scope.nimTurn === '') {
                $scope.nimTurn = $scope.player1;
            }
            else if ($scope.nimTurn === $scope.player1) {
                $scope.nimTurn = $scope.player2;
            }
            else {
                $scope.nimTurn = $scope.player1;
            }

        };

        $scope.nimRowClicked = function (nimRowNumClicked) {
            $scope.nimRowNum = nimRowNumClicked;
        };

        $scope.nimTake = function (nimRowNumClicked) {
            if ($scope.nimMatrix[nimRowNumClicked].length === $scope.nimColumn && $scope.nimMatrix[nimRowNumClicked][$scope.nimColumn - 1] === true) {
                $scope.nimMatrix[nimRowNumClicked][$scope.nimColumn - 1] = false;
            }
            for (var i = 0; i < $scope.nimMatrix[nimRowNumClicked].length; i++) {
                if ($scope.nimMatrix[nimRowNumClicked][i] === false && i > 0) {
                    $scope.nimMatrix[nimRowNumClicked][i - 1] = false;
                }
            }
        };

        $scope.nimCheckforWinner = function () {
            var total = 0;
            for (var i = 0; i < $scope.nimMatrix.length; i++) {
                total += sumArray($scope.nimMatrix[i]);
            }
            if (total === 0) {
                $scope.nimOver = true;
            }
            else {
                $scope.nimOver = false;
            }
        };
    }]);

capitalizeFirstLetter = function (name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
};

makeChompMatrix = function (rowNum, columnNum) {
    var matrix = [];
    for (var i = 0; i < rowNum; i++) {
        matrix[i] = [];
        for (var j = 0; j < columnNum; j++) {
            matrix[i][j] = 1;
        }
    }
    return matrix;
};

makeMatrix = function (rowNum, columnNum) {
    var matrix = [];
    for (var i = 0; i < rowNum; i++) {
        matrix[i] = [];
        for (var j = 0; j < columnNum; j++) {
            matrix[i][j] = false;
        }
    }
    return matrix;
};

chompMatrix = function (rowNum, columnNum, row, column, matrix) {
    for (var i = 0; i < rowNum; i++) {
        if (i <= row) {
            for (var j = 0; j < columnNum; j++) {
                if (column <= j) {
                    matrix[i][j] = 0;
                }
            }
        }
    }
    return matrix;
};

nimMatrixCal = function (rowNum, columnNum, matrix) {
    for (var i = 0; i < rowNum; i++) {
        var randomNum = parseInt(Math.random() * (columnNum - 1)) + 2;
        for (var j = 0; j < randomNum; j++) {
            matrix[i][j] = true;
        }
    }
    return matrix;
};

candyArray = function (number) {
    var array = [];
    for (var i = 0; i < number; i += 6) {
        array[i] = "red";
        array[i + 1] = "green";
        array[i + 2] = "blue";
        array[i + 3] = "yellow";
        array[i + 4] = "brown";
        array[i + 5] = "orange";
    }
    return shuffle(array);
};

shuffle = function (array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

add = function (a, b) {
    return a + b;
};

sumArray = function (array) {
    return array.reduce(add, 0);
};