const gameContainer = document.getElementById('game-container');
const target = document.getElementById('target');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const startButton = document.getElementById('start-game');
const restartButton = document.getElementById('restart-game');
const mainMenu = document.getElementById('main-menu');
const gameElements = document.getElementById('game-elements');
const difficultySelect = document.getElementById('choose-difficulty');
const colorSelect = document.getElementById('choose-color');

let score = 0;
let isGameOver = false;
let timerId;
let difficultySettings = { timeLimit: 4000, minDistance: 100 };
let lastPosition = { x: 0, y: 0 };

function setDifficulty() {
    const difficulty = difficultySelect.value;
    if (difficulty === 'easy') {
        difficultySettings = { timeLimit: 4000, minDistance: 100, size: 60 };
    } else if (difficulty === 'medium') {
        difficultySettings = { timeLimit: 2000, minDistance: 150, size: 50 };
    } else {
        difficultySettings = { timeLimit: 1000, minDistance: 200, size: 40 };
    }
    target.style.width = `${difficultySettings.size}px`;
    target.style.height = `${difficultySettings.size}px`;
}

function setTargetColor() {
    target.style.backgroundColor = colorSelect.value;
}

function moveTarget() {
    if (isGameOver) return;

    const difficulty = difficultySelect.value;
    const maxX = gameContainer.clientWidth - difficultySettings.size;
    const maxY = gameContainer.clientHeight - difficultySettings.size;
    let newX, newY, distance;

    if (difficulty === 'hard') {
        newX = Math.random() * maxX;
        newY = Math.random() * maxY;
    } else {
        do {
            const deltaX = (Math.random() - 0.5) * difficultySettings.minDistance * 3;
            const deltaY = (Math.random() - 0.5) * difficultySettings.minDistance * 3;
            newX = Math.min(Math.max(lastPosition.x + deltaX, 0), maxX);
            newY = Math.min(Math.max(lastPosition.y + deltaY, 0), maxY);
            distance = Math.sqrt((newX - lastPosition.x) ** 2 + (newY - lastPosition.y) ** 2);
        } while (distance < difficultySettings.minDistance);
    }

    target.style.left = `${newX}px`;
    target.style.top = `${newY}px`;
    lastPosition = { x: newX, y: newY };
}

let timeRemaining;

function startTimer() {
    clearInterval(timerId);
    timeRemaining = difficultySettings.timeLimit;
    timeDisplay.textContent = `Time: ${(timeRemaining / 1000).toFixed(1)}s`;

    timerId = setInterval(() => {
        timeRemaining -= 100;
        timeDisplay.textContent = `Time: ${(timeRemaining / 1000).toFixed(1)}s`;

        if (timeRemaining <= 0) {
            clearInterval(timerId);
            endGame();
        }
    }, 100);
}

function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

startButton.addEventListener('click', () => {
    const difficulty = difficultySelect.value;
    const color = colorSelect.value;
    if (!difficulty || !color) {
        alert('Select a difficulty level and color!');
        return;
    }

    if (!isGameOver) {
        score = 0;
        updateScore();
        mainMenu.style.display = 'none';
        gameElements.style.display = 'block';
        restartButton.style.display = 'none';
        target.style.display = 'block';

        setDifficulty();
        setTargetColor();
        moveTarget();
        startTimer();
    }
});

target.addEventListener('click', () => {
    if (isGameOver) return;

    score++;
    updateScore();
    moveTarget();
    startTimer();
});

function endGame() {
    isGameOver = true;
    clearInterval(timerId);
    alert(`Game Over! Score: ${score}`);
    target.style.display = 'none';
    restartButton.style.display = 'block';
}

restartButton.addEventListener('click', () => {
    clearInterval(timerId);
    isGameOver = false;
    target.style.display = 'block';
    mainMenu.style.display = 'block';
    gameElements.style.display = 'none';
    restartButton.style.display = 'none';
});