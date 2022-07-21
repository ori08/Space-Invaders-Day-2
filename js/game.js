'use strict'
const EMPTY = "";
const BOARD_SIZE = 14;
const SUPER_MODE = "╦╤─"
const CANDY = '<img  src="img/candy.png"/>'
const LIVE = "♥"
var lives_remain = 0

var gBoard;
var gGame = {
    isOn: false,
    aliensCount: 0,
    score: 0
}

var gInterval_Allien;
var gInterval_Bonus;
var Super_Mode_In_Used = 0
var isTimerOn = false

function init() {
    renderTexts()
    gBoard = createBoard()
    gHero = createHero(gBoard)
    createAlliens(gBoard)
    gInterval_Allien = setInterval(moveAlliens, Allien_SPEED)
    gInterval_Bonus = setInterval(addRandomBonus, 10000)
    renderBoard(gBoard)
}

function createBoard() {

    var board = [];
    for (var i = 0; i < BOARD_SIZE; i++) {
        board.push([]);
        for (var j = 0; j < BOARD_SIZE; j++) {
            board[i][j] = EMPTY
        }
    }
    return board;
}

function renderBoard(board) {
    var strHtml = ""
    for (var i = 0; i < board.length; i++) {
        strHtml += `<tr>`
        for (var j = 0; j < board[0].length; j++) {

            strHtml += `<td class="cell-${i}-${j}">
             ${board[i][j]}`
        }
        strHtml += `</td ></tr > `
        document.querySelector(`.gameBoard`).innerHTML = strHtml
    }
}

function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
    elCell.innerHTML = value;
}

//read keyboard key from user 
function readKeyboard(ev) {
    console.log(ev.code);
    if (!gGame.isOn) return

    switch (ev.code) {

        case 'ArrowLeft': {
            moveHero(ev)
        }
            break;
        case 'ArrowRight': {
            moveHero(ev)
        }
            break;
        case "Space": {
            console.log(gIsLaser);

            LASER = '<img src="img/laser.png" />';
            LASER_SPEED = 100;
            gLaserStartPos = gHero.pos.j
            if (!gIsLaser) gInterval_Laser = setInterval(shotLaser, LASER_SPEED)
            gIsLaser = true
        }
            break;
        case "KeyN": {
            killNighboard()
        }
            break;
        case "KeyX": {
            if (Super_Mode_In_Used === 3) return
            superMode()
            renderGameMode(".superMode", "Super-Mode", SUPER_MODE, Super_Mode_In_Used)
        }
            break;
    }
}

function killTimer() {
    clearInterval(gIntervalTimer)
    var elTimer = document.querySelector('.timer')
    elTimer.innerText = ""
    isTimerOn = false
}

function clearIntervalArray() {
    for (var i = 0; i < intervallArray.length; i++) {
        clearInterval(intervallArray[i])
    }
}

function renderScore(score) {
    gGame.score += score
    var elScore = document.querySelector(".score")
    elScore.innerText = gGame.score
}

function resetGame() {
    startGame()
}

function startGame() {
    setLevel("Easy")
}

function renderGameMode(className, title, symbol, count) {
    var elSuperMode = document.querySelector(className);
    var value = symbol.repeat(3 - count)
    elSuperMode.innerText = `${title} : \n ${value}`;
}

function openModal(modalName) {
    gGame.isOn = false
    var elModal = document.querySelector(modalName)
    elModal.style.display = "flex"
}

function closeModal(modalName) {
    var elModal = document.querySelector(modalName)
    elModal.style.display = "none"
}

function isWin() {

    if (gAlliens.length === 0) {
        gGame.isOn = false
        openModal(".winModal")
    }

}

function isGameOver() {
    for (var i = 0; i < gAlliens.length; i++) {
        if (gAlliens[i].pos.i === BOARD_SIZE - 2 || lives_remain === 3) {
            gGame.isOn = false
            openModal(".gameOverModal")
        }
    }
}

function setLevel(lv) {
    switch (lv) {
        case 'Easy': {
            setGameLevelParmeters(3, 700)
        }
            break;
        case 'Normal': {
            setGameLevelParmeters(4, 500)
        }
            break;
        case 'Hard': {
            setGameLevelParmeters(5, 300)
        }
            break;
    }
}

function setGameLevelParmeters(AliienRows, AllienSpeed) {
    gGame = {
        isOn: true,
        aliensCount: 0,
        score: 0
    }
    gIsLaser = false
    isHitWall = false
    gFirstMove = true
    lives_remain = 0
    gAliensTopRowIdx = 0
    gAliensBottomRowIdx = AliienRows
    ALIENS_ROW_COUNT = AliienRows
    Allien_SPEED = AllienSpeed
    gAlliens = []
    Super_Mode_In_Used = 0
    clearInterval(gInterval_Laser)
    clearInterval(gInterval_Allien)
    clearInterval(gInterval_Bonus)
    clearInterval(gInterval_Rock)
    init()
}

function findEmetyCells() {
    var board = gBoard
    var emptyCells = []
    var i = BOARD_SIZE - 2
    for (var j = 0; j < BOARD_SIZE - 1; j++) {
        if (board[i][j] !== HERO) emptyCells.push({ i: i, j: j })
    }

    return emptyCells
}

function getRandomEmetyCell() {
    var emptyCells = findEmetyCells()
    var randomEmptyCell = emptyCells[getRandomIntInc(0, emptyCells.length - 1)]
    return randomEmptyCell
}

function addRandomBonus() {
    if (!gGame.isOn) return
    var board = gBoard
    var cellPos = getRandomEmetyCell()
    board[cellPos.i][cellPos.j] = CANDY
    renderCell(cellPos, CANDY)

    setTimeout(() => {
        board[cellPos.i][cellPos.j] = EMPTY;

        // prevent rerendering a game after a win
        renderCell(cellPos, EMPTY)
    }, 5000);

}

function renderTexts() {
    renderCustimizeModal()
    renderScore(0)
    renderGameMode(".superMode", "Super-Mode", SUPER_MODE, Super_Mode_In_Used)
    renderGameMode(".lives", "Lives", LIVE, lives_remain)
    closeModal(".winModal")
    closeModal(".gameOverModal")
}

function setSpirtImg(imgName, Sprit) {
    if (Sprit === "ALIEN") ALIEN = `<img src="img/${imgName}.png" />`
    else if (Sprit === "HERO") HERO = `<img src="img/${imgName}.png" />`
    closeModal('.costomizeModal')
    gGame.isOn = true
}

function renderCustimizeModal() {
    var strHtmlAllien = ""
    var strHtmlSpaceship = ""
    var elAllien = document.querySelector(".allienGroup")
    var elSpaceship = document.querySelector(".spaceshipGroup")
    for (var i = 1; i <= 5; i++) {
        strHtmlAllien += `<img src="img/Beast${i}.png" onclick="setSpirtImg('Beast${i}','ALIEN')">`
        strHtmlSpaceship += `<img src="img/Spaceship${i}.png" onclick="setSpirtImg('Spaceship${i}','HERO')">`
    }
    elAllien.innerHTML = strHtmlAllien
    elSpaceship.innerHTML = strHtmlSpaceship
}