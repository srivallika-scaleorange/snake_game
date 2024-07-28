const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    { x: 10, y: 10 },
];
let food = getRandomFoodPosition();
let dx = 0;
let dy = 0;
let score = 0;
let level = 1;
let speed = 7; // Initial speed
let gameOver = false;

// Array of colors for the snake
const snakeColors = [
    'green', 'white', 'yellow', 'orange', 'purple', 'pink', 'cyan', 'magenta', 'lime', 'brown'
];

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    if (gameOver) return;

    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -1;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -1;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 1;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 1;
    }
}

function getRandomFoodPosition() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
}

function drawGame() {
    clearCanvas();
    if (!gameOver) {
        moveSnake();
        drawSnake();
        drawFood();
        checkCollision();
        updateScore();
    } else {
        displayGameOver();
    }
    setTimeout(() => requestAnimationFrame(drawGame), 1000 / speed);
}

function clearCanvas() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        food = getRandomFoodPosition();
        if (score % 30 === 0) {
            levelUp();
        }
    } else {
        snake.pop();
    }
}

function drawSnake() {
    ctx.fillStyle = snakeColors[(level - 1) % snakeColors.length];
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function checkCollision() {
    const head = snake[0];

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        setGameOver();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            setGameOver();
        }
    }
}

function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
    levelElement.textContent = `Level: ${level}`;
}

function levelUp() {
    level++;
    speed *= 1.05; // Increase speed by 5%
    snake = [{ x: 10, y: 10 }];
    dx = 0;
    dy = 0;
}

function setGameOver() {
    gameOver = true;
    setTimeout(() => {
        resetGame();
    }, 2000);
}

function displayGameOver() {
    ctx.fillStyle = 'white';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    food = getRandomFoodPosition();
    dx = 0;
    dy = 0;
    score = 0;
    level = 1;
    speed = 7;
    gameOver = false;
}

drawGame();