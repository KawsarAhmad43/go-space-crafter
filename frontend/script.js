const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const gameOverScreen = document.getElementById("gameOver");
const finalScoreDisplay = document.getElementById("finalScore");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let spaceship = { x: canvas.width / 2 - 25, y: canvas.height - 80, width: 50, height: 50, speed: 7, image: new Image() };
spaceship.image.src = "assets/spaceship.png"; // Custom spaceship image

let bullets = [];
let invaders = [];
let score = 0;
let gameOver = false;
let leftPressed = false;
let rightPressed = false;
let spacePressed = false;
let invaderSpeed = 1;

let shootSound = new Audio('assets/shoot.wav');
let explosionSound = new Audio('assets/explosion.wav');
let backgroundMusic = new Audio('assets/background.wav');
backgroundMusic.loop = true;
backgroundMusic.play();

// Initialize Invaders
function createInvaders() {
    invaders = [];
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 10; j++) {
            let invader = { x: j * 60 + 50, y: i * 50 + 30, width: 40, height: 40, speed: invaderSpeed, image: new Image() };
            invader.image.src = "assets/invader.png"; // Custom invader image
            invaders.push(invader);
        }
    }
}

// Draw Spaceship
function drawSpaceship() {
    ctx.drawImage(spaceship.image, spaceship.x, spaceship.y, spaceship.width, spaceship.height);
}

// Draw Bullets
function drawBullets() {
    bullets.forEach(bullet => {
        ctx.fillStyle = "red";
        ctx.fillRect(bullet.x, bullet.y, 5, 10);
    });
}

// Draw Invaders
function drawInvaders() {
    invaders.forEach(invader => {
        ctx.drawImage(invader.image, invader.x, invader.y, invader.width, invader.height);
    });
}

// Move spaceship
function moveSpaceship() {
    if (leftPressed && spaceship.x > 0) spaceship.x -= spaceship.speed;
    if (rightPressed && spaceship.x + spaceship.width < canvas.width) spaceship.x += spaceship.speed;
}

// Move Bullets
function moveBullets() {
    bullets.forEach(bullet => bullet.y -= 7);
    bullets = bullets.filter(bullet => bullet.y > 0);
}

// Move Invaders
function moveInvaders() {
    invaders.forEach(invader => invader.y += invader.speed);
    invaders = invaders.filter(invader => invader.y < canvas.height);
}

// Collision Detection
function checkCollisions() {
    bullets.forEach(bullet => {
        invaders.forEach((invader, index) => {
            if (bullet.x < invader.x + invader.width &&
                bullet.x + 5 > invader.x &&
                bullet.y < invader.y + invader.height &&
                bullet.y + 10 > invader.y) {
                invaders.splice(index, 1);
                bullets.splice(bullets.indexOf(bullet), 1);
                score++;
                scoreDisplay.textContent = "Score: " + score;
                explosionSound.play();
                sendScoreToServer();
            }
        });
    });
}

// Shoot Bullet
function shootBullet() {
    if (spacePressed) {
        bullets.push({ x: spaceship.x + spaceship.width / 2 - 2.5, y: spaceship.y });
        shootSound.play();
    }
}

// Game Over Condition
function checkGameOver() {
    invaders.forEach(invader => {
        if (invader.y + invader.height >= spaceship.y) {
            gameOver = true;
            finalScoreDisplay.textContent = score;
            gameOverScreen.classList.remove("hidden");
            backgroundMusic.pause();
        }
    });
}

// Send Score to Server
function sendScoreToServer() {
    fetch('http://localhost:8080/score', {
        method: 'POST'
    });
}

// Game Loop
function gameLoop() {
    if (gameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSpaceship();
    drawBullets();
    drawInvaders();
    moveSpaceship();
    moveBullets();
    moveInvaders();
    checkCollisions();
    checkGameOver();
    shootBullet();
    requestAnimationFrame(gameLoop);
}

// Event Listeners
window.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft" || e.key === "a") leftPressed = true;
    if (e.key === "ArrowRight" || e.key === "d") rightPressed = true;
    if (e.key === " ") spacePressed = true;
});

window.addEventListener("keyup", e => {
    if (e.key === "ArrowLeft" || e.key === "a") leftPressed = false;
    if (e.key === "ArrowRight" || e.key === "d") rightPressed = false;
    if (e.key === " ") spacePressed = false;
});

function restartGame() {
    gameOver = false;
    score = 0;
    scoreDisplay.textContent = "Score: 0";
    gameOverScreen.classList.add("hidden");
    backgroundMusic.play();
    createInvaders();
    gameLoop();
}

createInvaders();
gameLoop();
