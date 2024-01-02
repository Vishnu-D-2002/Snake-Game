
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

const snake = [
    { x: UNIT * 3, y: 0 },
    { x: UNIT * 2, y: 0 },
    { x: UNIT, y: 0 },
    { x: 0, y: 0 }
];

let gamePaused = true; // Track game state
startGame();
document.addEventListener('keydown', moveDirection);
startbtn.addEventListener('click', toggleGame);

function toggleGame() {
    gamePaused = !gamePaused;
    if (!gamePaused) {
        startGame();
        gameLoop();
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
    snake.forEach((snakePath) => {
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
    setTimeout(() => {
        if (!gamePaused) {
            clearBoard();
            displayFood();
            moveSnake();
            displaySnake();
            gameOver();
            gameLoop();
        }
    }, 200);
}

function gameOver() {
    const head = snake[0];

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            context.fillStyle = 'white';
            context.textAlign = 'center';
            context.font = '60px Serif';
            context.fillText('Game Over...!!', WIDTH / 2, HEIGHT / 2);
            gamePaused = true;
            return; 
        }
    }
    
    switch (true) {
        case snake[0].x < 0:
        case snake[0].x >= WIDTH:
        case snake[0].y < 0:
        case snake[0].y >= HEIGHT:
            context.fillStyle = 'white';
            context.textAlign = 'center';
            context.font = '60px Serif';
            context.fillText('Game Over...!!', WIDTH / 2, HEIGHT / 2);
            gamePaused = true;
            break;
    }
}
