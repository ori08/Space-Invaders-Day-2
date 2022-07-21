'use strict'
var HERO = '<img src="img/Spaceship1.png" />';

var LASER = '<img src="img/laser.png" />';
var LASER_SPEED = 80;

var gHero;
var gInterval_Laser

var gLaserPos
var gLaser_Distance = 1
var gLaserStartPos
var gIsLaser = false
var gSuperMode = true



function createHero(board) {
    gHero = {
        pos: { i: 12, j: 5 },
        isShoot: false
    }
    board[gHero.pos.i][gHero.pos.j] = HERO
    return gHero
}

function moveHero(ev) {
    if (!gGame.isOn) return
    var nextLocation = getNextLocation(ev)
    // varified that hero not pass the wall
    if (nextLocation.j < 0 || nextLocation.j > BOARD_SIZE - 1) return

    var nextCell = gBoard[nextLocation.i][nextLocation.j]
    if (nextCell === CANDY) spaceCandy()
    //Update the board
    gBoard[gHero.pos.i][gHero.pos.j] = EMPTY
    // TODO: update the DOM
    renderCell(gHero.pos, EMPTY)

    gHero.pos = nextLocation
    //Update the board
    gBoard[gHero.pos.i][gHero.pos.j] = HERO
    // TODO: update the DOM
    renderCell(gHero.pos, HERO)
}

function getNextLocation(ev) {

    var nextLocation = {
        i: gHero.pos.i,
        j: gHero.pos.j,
    }

    switch (ev.code) {

        case 'ArrowLeft': {
            nextLocation.j--
        }
            break;

        case 'ArrowRight': {
            nextLocation.j++
        }
            break;
    }
    return nextLocation;
}

function shotLaser() {
    gLaserPos = { i: gHero.pos.i - gLaser_Distance, j: gLaserStartPos }
    // If the laser pass the board top limit TODO
    if (gLaserPos.i < 0) {
        gLaserPos = null
        gBoard[0][gLaserStartPos] = EMPTY
        renderCell({ i: 0, j: gLaserStartPos }, EMPTY)
        clearInterval(gInterval_Laser)
        gIsLaser = false
        gLaser_Distance = 1
        return
    }
    renderLaser()
    gLaser_Distance++
}

function renderLaser() {
    var board = gBoard
    var BeforeLaserPos = { i: gLaserPos.i + 1, j: gLaserPos.j }
    var cell_After_Laser = board[gLaserPos.i][gLaserPos.j]
    var cell_Before_Laser = board[BeforeLaserPos.i][BeforeLaserPos.j]

    if (cell_After_Laser === ALIEN) {
        // Remove the allien from the alliens array 
        killAliien(gLaserPos)

        //Update the board 
        board[gLaserPos.i][gLaserPos.j] = EMPTY
        board[BeforeLaserPos.i][BeforeLaserPos.j] = EMPTY

        //When laser hit Allien remove laser from board and exit the Interval
        clearInterval(gInterval_Laser)
        gIsLaser = false
        gLaser_Distance = 1

        //Update the DOM
        renderCell(gLaserPos, EMPTY)
        renderCell(BeforeLaserPos, EMPTY)
        gLaserPos = null
        return
    }

    if (cell_Before_Laser !== HERO) {
        board[BeforeLaserPos.i][BeforeLaserPos.j] = EMPTY
        renderCell(BeforeLaserPos, EMPTY)
    }

    board[gLaserPos.i][gLaserPos.j] = LASER
    renderCell(gLaserPos, LASER)
}

function superMode() {
    Super_Mode_In_Used++
    LASER = '<img src="img/super-mode.png" />';
    LASER_SPEED = 40;
    gLaserStartPos = gHero.pos.j
    if (!gIsLaser) gInterval_Laser = setInterval(shotLaser, LASER_SPEED)


}

function killNighboard() {
    var board = gBoard
    var curCell_I = gLaserPos.i
    var curCell_J = gLaserPos.j

    for (var i = curCell_I - 1; i <= curCell_I + 1; i++) {
        if (i < 0 || i >= board.length) continue;

        for (var j = curCell_J - 1; j <= curCell_J + 1; j++) {

            if (j < 0 || j >= board[0].length) continue;
            if (i === curCell_I && j === curCell_J) continue;
            if (board[i][j] === ALIEN) {
                markCell(i, j)
                board[i][j] = EMPTY
                killAliien({ i: i, j: j })
                renderCell({ i: i, j: j }, EMPTY)
            }
        }
    }


}

function spaceCandy() {
    gAlliansFreaze = true
    renderScore(50)
    clearInterval(gInterval_Allien)
    setTimeout(freazeAlliens, 5000)
    startTimer()

    function freazeAlliens() {
        gInterval_Allien = setInterval(moveAlliens, Allien_SPEED)
        killTimer()
    }
}

function markCell(i, j) {
    console.log(document.querySelector(`.cell-${i}-${j}`));
    document.querySelector(`.cell-${i}-${j}`).style.border = "1px solid red "

}

