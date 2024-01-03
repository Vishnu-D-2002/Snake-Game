const board = document.getElementById('board');
const context = board.getContext('2d');
const scoreVal = document.getElementById('scoreVal');
const startbtn = document.getElementById('start');

const HEIGHT = board.height;
const WIDTH = board.width;
const UNIT = 25;

let score = 0;
let foodX;
let foodY;
let speedX = 25;
let speedY = 0;

let snake = [
    { x: UNIT * 3, y: 0 },
    { x: UNIT * 2, y: 0 },
    { x: UNIT, y: 0 },
    { x: 0, y: 0 }
];

let gamePaused = true;
let gameInterval;

startGame();
document.addEventListener('keydown', moveDirection);
startbtn.addEventListener('click', toggleGame);
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

function toggleGame() {
    if (gamePaused) {
        startbtn.textContent = 'Pause';
        gamePaused = false;
        gameInterval = setInterval(gameLoop, 200);
    } else {
        startbtn.textContent = 'Start';
        gamePaused = true;
        clearInterval(gameInterval);
    }
}

function restartGame() {
    startbtn.textContent = 'Start';
    gamePaused = true;
    score = 0;
    scoreVal.textContent = score;
    speedX = 25;
    speedY = 0;
    snake = [
        { x: UNIT * 3, y: 0 },
        { x: UNIT * 2, y: 0 },
        { x: UNIT, y: 0 },
        { x: 0, y: 0 }
    ];
    clearBoard();
    startGame();

    // Reattach event listeners
    startbtn.addEventListener('click', toggleGame);
    document.addEventListener('keydown', moveDirection);

    // Clear existing interval and start a new one with the appropriate speed
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 100); // Adjust the interval as needed
}

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    if (!gamePaused) {
        const touchEndX = event.touches[0].clientX;
        const touchEndY = event.touches[0].clientY;

        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // Adjust these values based on your preference for sensitivity
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (deltaX > 0) {
                moveDirection({ key: 'ArrowRight' });
            } else {
                moveDirection({ key: 'ArrowLeft' });
            }
        } else {
            // Vertical swipe
            if (deltaY > 0) {
                moveDirection({ key: 'ArrowDown' });
            } else {
                moveDirection({ key: 'ArrowUp' });
            }
        }

        // Update touch start coordinates
        touchStartX = touchEndX;
        touchStartY = touchEndY;
    }
}

function moveDirection(e) {
    if (gamePaused) return;

    switch (e.key) {
        case 'ArrowUp':
            if (speedY !== UNIT) {
                speedX = 0;
                speedY = -UNIT;
            }
            break;

        case 'ArrowDown':
            if (speedY !== -UNIT) {
                speedX = 0;
                speedY = UNIT;
            }
            break;

        case 'ArrowLeft':
            if (speedX !== UNIT) {
                speedX = -UNIT;
                speedY = 0;
            }
            break;

        case 'ArrowRight':
            if (speedX !== -UNIT) {
                speedX = UNIT;
                speedY = 0;
            }
            break;
    }
}

function startGame() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, WIDTH, HEIGHT);
    createFood();
    displayFood();
    displaySnake();
}

function clearBoard() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, WIDTH, HEIGHT);
}

function createFood() {
    foodX = Math.floor(Math.random() * WIDTH / UNIT) * UNIT;
    foodY = Math.floor(Math.random() * HEIGHT / UNIT) * UNIT;
}

function displayFood() {
    context.fillStyle = 'red';
    context.fillRect(foodX, foodY, UNIT, UNIT);
}

function displaySnake() {
    context.fillStyle = 'aqua';
    context.strokeStyle = 'black';
    snake.forEach(snakePath => {
        context.fillRect(snakePath.x, snakePath.y, UNIT, UNIT);
        context.strokeRect(snakePath.x, snakePath.y, UNIT, UNIT);
    });
}

function moveSnake() {
    const head = { x: snake[0].x + speedX, y: snake[0].y + speedY };
    snake.unshift(head);

    if (head.x == foodX && head.y == foodY) {
        createFood();
        score++;
        scoreVal.textContent = score;
    } else {
        snake.pop();
    }
}

function gameLoop() {
    if (!gamePaused) {
        clearBoard();
        displayFood();
        moveSnake();
        displaySnake();
        gameOver();
    }
}

function gameOver() {
    const head = snake[0];

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            displayGameOver();
            clearInterval(gameInterval);
            return;
        }
    }

    switch (true) {
        case head.x < 0:
        case head.x >= WIDTH:
        case head.y < 0:
        case head.y >= HEIGHT:
            displayGameOver();
            clearInterval(gameInterval);
            break;
    }
}

function displayGameOver() {
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.font = '60px Serif';
    context.fillText('Game Over...!!', WIDTH / 2, HEIGHT / 2);
    startbtn.textContent = 'Restart';
    startbtn.removeEventListener('click', toggleGame);
    startbtn.addEventListener('click', restartGame);
    gamePaused = true;
}
