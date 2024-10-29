// DOM Elements representing game components
const startText = document.getElementById("startText");
const paddle1 = document.getElementById("paddle1");
const paddle2 = document.getElementById("paddle2");
const ball = document.getElementById("ball");
const player1ScoreElement = document.getElementById("player1Score");
const player2ScoreElement = document.getElementById("player2Score");
const lossSound = document.getElementById("lossSound");
const wallSound = document.getElementById("wallSound");
const paddleSound = document.getElementById("paddleSound");

// Game state variables
let gameRunning = false; // Tracks if the game is in progress
let keysPressed = {}; // Object to store key states for paddles
let paddle1Speed = 0;
let paddle1Y = 150; // Initial Y position for paddle1
let paddle2Speed = 0;
let paddle2Y = 150; // Initial Y position for paddle2
let ballX = 290; // Starting X position of the ball
let ballSpeedX = 2; // Ball speed along the X-axis
let ballY = 190; // Starting Y position of the ball
let ballSpeedY = 2; // Ball speed along the Y-axis
let player2Score = 0; // Player 2's score
let player1Score = 0; // Player 1's score

// Game constants for paddle and ball movement
const paddleAcceleration = 1;
const maxPaddleSpeed = 5;
const paddleDeceleration = 1;
const gameHeight = 400;
const gameWidth = 600;

// Event listeners for game control
document.addEventListener("keydown", startGame);
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

// Start game function - begins game and initiates game loop
function startGame() {
  gameRunning = true;
  startText.style.display = "none"; // Hide start text once game starts
  document.removeEventListener("keydown", startGame);
  gameLoop();
}

// Main game loop - repeats every few milliseconds for smooth animation
function gameLoop() {
  if (gameRunning) {
    updatePaddle1(); // Update left paddle position
    updatePaddle2(); // Update right paddle position
    moveBall(); // Move ball and handle collisions
    setTimeout(gameLoop, 8); // Run loop every 8 milliseconds
  }
}

// Keydown event handler - records pressed keys
function handleKeyDown(e) {
  keysPressed[e.key] = true;
}

// Keyup event handler - resets released keys
function handleKeyUp(e) {
  keysPressed[e.key] = false;
}

// Updates paddle1 position based on keys pressed ('w' for up, 's' for down)
function updatePaddle1() {
  if (keysPressed["w"]) {
    paddle1Speed = Math.max(paddle1Speed - paddleAcceleration, -maxPaddleSpeed);
  } else if (keysPressed["s"]) {
    paddle1Speed = Math.min(paddle1Speed + paddleAcceleration, maxPaddleSpeed);
  } else {
    if (paddle1Speed > 0) {
      paddle1Speed = Math.max(paddle1Speed - paddleDeceleration, 0);
    } else if (paddle1Speed < 0) {
      paddle1Speed = Math.min(paddle1Speed + paddleDeceleration, 0);
    }
  }

  // Update paddle1 position within bounds
  paddle1Y += paddle1Speed;
  paddle1Y = Math.min(Math.max(paddle1Y, 0), gameHeight - paddle1.clientHeight);
  paddle1.style.top = paddle1Y + "px";
}

// Updates paddle2 position based on arrow keys ('ArrowUp' for up, 'ArrowDown' for down)
function updatePaddle2() {
  if (keysPressed["ArrowUp"]) {
    paddle2Speed = Math.max(paddle2Speed - paddleAcceleration, -maxPaddleSpeed);
  } else if (keysPressed["ArrowDown"]) {
    paddle2Speed = Math.min(paddle2Speed + paddleAcceleration, maxPaddleSpeed);
  } else {
    if (paddle2Speed > 0) {
      paddle2Speed = Math.max(paddle2Speed - paddleDeceleration, 0);
    } else if (paddle2Speed < 0) {
      paddle2Speed = Math.min(paddle2Speed + paddleDeceleration, 0);
    }
  }

  // Update paddle2 position within bounds
  paddle2Y += paddle2Speed;
  paddle2Y = Math.min(Math.max(paddle2Y, 0), gameHeight - paddle2.clientHeight);
  paddle2.style.top = paddle2Y + "px";
}

// Move ball and handle all collisions
function moveBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Collision with top or bottom walls
  if (ballY >= gameHeight - ball.clientHeight || ballY <= 0) {
    ballSpeedY = -ballSpeedY;
    playSound(wallSound);
  }

  // Collision with paddle1 (left paddle)
  if (
    ballX <= paddle1.clientWidth &&
    ballY >= paddle1Y &&
    ballY <= paddle1Y + paddle1.clientHeight
  ) {
    ballSpeedX = -ballSpeedX;
    playSound(paddleSound);
  }

  // Collision with paddle2 (right paddle)
  if (
    ballX >= gameWidth - paddle2.clientWidth - ball.clientWidth &&
    ballY >= paddle2Y &&
    ballY <= paddle2Y + paddle2.clientHeight
  ) {
    ballSpeedX = -ballSpeedX;
    playSound(paddleSound);
  }

  // If ball goes out of bounds, update score and reset position
  if (ballX <= 0) {
    player2Score++;
    playSound(lossSound);
    updateScoreboard();
    resetBall();
    pauseGame();
  } else if (ballX >= gameWidth - ball.clientWidth) {
    player1Score++;
    playSound(lossSound);
    updateScoreboard();
    resetBall();
    pauseGame();
  }

  // Set new position of the ball in the DOM
  ball.style.left = ballX + "px";
  ball.style.top = ballY + "px";
}

// Updates the scoreboard display based on current scores
function updateScoreboard() {
  player1ScoreElement.textContent = player1Score;
  player2ScoreElement.textContent = player2Score;
}

// Reset ball position to center and randomize direction after scoring
function resetBall() {
  ballX = gameWidth / 2 - ball.clientWidth / 2;
  ballY = gameHeight / 2 - ball.clientHeight / 2;
  ballSpeedX = Math.random() > 0.5 ? 2 : -2;
  ballSpeedY = Math.random() > 0.5 ? 2 : -2;
}

// Pauses the game until a key is pressed to restart
function pauseGame() {
  gameRunning = false;
  document.addEventListener("keydown", startGame);
}

// Plays sound for a given event (paddle hit, wall hit, score)
function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}
