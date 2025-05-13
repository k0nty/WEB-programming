const boardElem = document.getElementById('game-board');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const minMovesElem = document.getElementById('min-moves');
const userMovesElem = document.getElementById('user-moves');
const timerElem = document.getElementById('timer');

let boardState = [];
let savedState = [];
let userMoves = 0;
let timer = 0;
let timerInterval;
let usedFiles = [];

const allConfigs = ['data/data1.json', 'data/data2.json', 'data/data3.json'];

function drawBoard(state) {
    boardElem.innerHTML = '';
    boardState = state.map(row => [...row]);

    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            if (boardState[i][j] == 1) {
                cell.classList.add('on');
            }
            cell.addEventListener('click', () => {
                toggle(i, j);
                userMoves++;
                userMovesElem.textContent = userMoves;
                checkWin()
            });
            boardElem.appendChild(cell);
        }
    }
}

function checkWin() {
    const isWin = boardState.every(row => row.every(cell => cell == 0));
    if (isWin) {
        clearInterval(timerInterval);
        alert(`Ви перемогли за ${userMoves} ходів і ${timer} секунд!`);
        boardElem.querySelectorAll('.cell').forEach(cell => {
            cell.style.pointerEvents = 'none';
        });
    }
}

function startTimer() {
    clearInterval(timerInterval);
    timer = 0;
    timerElem.textContent = timer;
    timerInterval = setInterval(() => {
      timer++;
      timerElem.textContent = timer;
    }, 1000);
  }

function toggle(i, j) {
    function toggleCell(x, y) {
        if (x >= 0 && x < 5 && y >= 0 && y < 5) {
            if(boardState[x][y]){
                boardState[x][y] = 0;
            }else{
                boardState[x][y] = 1;
            }
            boardElem.children[x * 5 + y].classList.toggle('on');
        }
    }

    toggleCell(i, j);
    toggleCell(i - 1, j);
    toggleCell(i + 1, j);
    toggleCell(i, j - 1);
    toggleCell(i, j + 1);
}

let lastUsedFile = null;

function startGame() {
    const availableFiles = allConfigs.filter(file => file !== lastUsedFile);
    const randomFile = availableFiles[Math.floor(Math.random() * availableFiles.length)];
    lastUsedFile = randomFile;

    fetch(randomFile)
        .then(res => res.json())
        .then(data => {
        drawBoard(data.board);
        savedState = data.board.map(row => [...row]);
        minMovesElem.textContent = data.minMoves;
        userMoves = 0;
        userMovesElem.textContent = '0';
        restartBtn.disabled = false;
        startTimer();
        });
}


function restartGame() {
    drawBoard(savedState);
    userMoves = 0;
    userMovesElem.textContent = '0';
    startTimer();
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);