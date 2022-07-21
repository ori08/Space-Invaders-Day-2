'use strict'
var ALIEN = '<img  src="img/Beast1.png" />';
var ALIENS_ROW_LENGTH = 8
var ALIENS_ROW_COUNT = 3
var Allien_SPEED = 700
const ROCK = '<img src="img/Stone.png" />'
const ROCK_SPEED = 140

var gAliensTopRowIdx = 0
var gAliensBottomRowIdx = 3;


var isHitWall = false
var gAlliansFreaze = false
var gFirstMove = true
var isRockClear = true


var gAlliens = []
var gIdx = 0

var gRockPos
var gRock_Distance = 1
var gRandomAliien
var gRockStartPos
var gInterval_Rock
var gIsRock = false

function createAlliens(board) {
    for (var i = 0; i < ALIENS_ROW_COUNT; i++) {

        for (var j = BOARD_SIZE - 1; j >= BOARD_SIZE - ALIENS_ROW_LENGTH; j--) {

            var allien = {
                pos: { i: i, j: j },
            }
            board[i][j] = ALIEN
            gAlliens.push(allien)

        }
    }

}

function moveAlliens() {
    if (!gGame.isOn) return

    renderAlliens()

    var lastAllienIdx = 0
    var firstAllienIdx = Infinity

    // find the first and last allign in the j index
    for (var i = 0; i < gAlliens.length; i++) {
        if (gAlliens[i].pos.j < firstAllienIdx) firstAllienIdx = gAlliens[i].pos.j
        if (gAlliens[i].pos.j > lastAllienIdx) lastAllienIdx = gAlliens[i].pos.j
    }

    //if one of the allien hit the left wall:
    //TODO shift down all the alliens 
    if (firstAllienIdx === 0 && isHitWall === false) {
        isHitWall = true
        shiftBoardDown(gBoard, firstAllienIdx, lastAllienIdx)
        return
    }
    //TODO shift down all the alliens 
    else if (lastAllienIdx === BOARD_SIZE - 1 && !gFirstMove && isHitWall === true) {
        isHitWall = false
        shiftBoardDown(gBoard, firstAllienIdx, lastAllienIdx)
        return
    }

    //Thorow rock from random allien
    if (isRockClear) {
        gRandomAliien = getRandomAllienCell()
        console.log(gRandomAliien);
        gRockStartPos = gRandomAliien.j
        gInterval_Rock = setInterval(shotRock, ROCK_SPEED)
    }


    // Tell the aliiens wheich side to move by boolean var
    //False for go left, and true for go right  
    for (var i = 0; i < gAlliens.length; i++) {
        if (!isHitWall) gAlliens[i].pos.j--
        else gAlliens[i].pos.j++
    }
    if (isHitWall) shiftBoardRight(gBoard, firstAllienIdx, lastAllienIdx)
    else shiftBoardLeft(gBoard, firstAllienIdx, lastAllienIdx)


    renderBoard(gBoard)
    gFirstMove = false
    isWin()
    isGameOver()
}

function shiftBoardRight(board, from, to) {
    for (var i = gAliensTopRowIdx; i < gAliensBottomRowIdx; i++) {
        for (var j = to; j >= from; j--) {
            var curCell = board[i][j]
            if (curCell === ALIEN) {
                board[i][j] = EMPTY
                board[i][j + 1] = ALIEN
            }
        }
    }
}

function shiftBoardLeft(board, from, to) {
    for (var i = gAliensTopRowIdx; i < gAliensBottomRowIdx; i++) {
        for (var j = from; j <= to; j++) {
            var curCell = board[i][j]
            if (curCell === ALIEN) {
                board[i][j] = EMPTY
                board[i][j - 1] = ALIEN
            }
        }
    }
}

function shiftBoardDown(board, from, to) {
    gAliensTopRowIdx++
    gAliensBottomRowIdx++
    //Update the gAliiens location array 
    for (var i = 0; i < gAlliens.length; i++) {
        gAlliens[i].pos.i++
    }
    //Update the board 
    for (var i = gAliensBottomRowIdx - 1; i >= gAliensTopRowIdx - 1; i--) {
        for (var j = to; j >= from; j--) {
            if (board[i][j] === ALIEN) {
                board[i + 1][j] = ALIEN
                board[i][j] = EMPTY
            }
        }
    }
    // Update the DOM
    renderBoard(gBoard)
}

function shotRock() {
    console.log(gRandomAliien.i);
    isRockClear = false
    gRockPos = { i: gRandomAliien.i + gRock_Distance, j: gRockStartPos }
    console.log(gRockPos);
    // If the laser pass the board bottom limit TODO
    if (gRockPos.i > BOARD_SIZE - 1) {
        gRockPos = null
        gBoard[BOARD_SIZE - 1][gRockStartPos] = EMPTY
        renderCell({ i: 0, j: gRockStartPos }, EMPTY)
        clearInterval(gInterval_Rock)
        gIsRock = false
        isRockClear = true
        gRock_Distance = 1
        return
    }
    renderRock()
    gRock_Distance++

}

function renderRock() {

    var board = gBoard
    var BeforeRockPos = { i: gRockPos.i - 1, j: gRockPos.j }
    var cell_After_Rock = board[gRockPos.i][gRockPos.j]
    var cell_Before_Rock = board[BeforeRockPos.i][BeforeRockPos.j]

    if (cell_After_Rock === HERO) {
        lives_remain++
        renderGameMode(".lives", "Lives", LIVE, lives_remain)

    }

    if (cell_Before_Rock !== ALIEN) {
        board[BeforeRockPos.i][BeforeRockPos.j] = EMPTY
        renderCell(BeforeRockPos, EMPTY)
    }

    board[gRockPos.i][gRockPos.j] = ROCK
    renderCell(gRockPos, ROCK)

}

function renderAlliens() {
    for (var i = 0; i < gAlliens.length; i++) {
        gBoard[gAlliens[i].pos.i][gAlliens[i].pos.j] = ALIEN
        renderCell(gAlliens[i].pos, ALIEN)
    }

}

function killAliien(pos) {
    for (var i = 0; i < gAlliens.length; i++) {
        if (gAlliens[i].pos.i === pos.i && gAlliens[i].pos.j === pos.j) {
            gAlliens.splice(i, 1)
            renderScore(10)
        }
    }
}

function findAlliensCells() {
    var board = gBoard
    var emptyCells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j] === ALIEN) emptyCells.push({ i: i, j: j })
        }
    }
    return emptyCells
}
//return random empty cell
function getRandomAllienCell() {
    var emptyCells = findAlliensCells()
    var randomEmptyCell = emptyCells[getRandomIntInc(0, emptyCells.length - 1)]
    return randomEmptyCell
}








