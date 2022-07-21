var gIntervalTimer

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
  // Select the elCell and set the value
  var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
  elCell.innerHTML = value;
}

function getRandomIntInc(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//countdown of 5 sec
function startTimer() {
  if (isTimerOn) return
  isTimerOn = true
  clearInterval(gIntervalTimer)
  var ms = 5000

  gIntervalTimer = setInterval(function () {
    ms -= 59
    var elTimer = document.querySelector('.timer')
    elTimer.innerText = convertMsToTime(ms)

  }, 59)
}

// move to utils service 
function convertMsToTime(milliseconds) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;

  return `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}:${(
    milliseconds % 1000
  )
    .toString()
    .substring(0, 3)}`;
}

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}


function killTimer() {
  clearInterval(gIntervalTimer)
  var elTimer = document.querySelector('.timer')
  elTimer.innerText = ""
  isTimerOn = false
}