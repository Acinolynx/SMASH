// Initialize canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var startBtn = document.getElementById("start-btn");
var restartBtn = document.getElementById("restart-btn");
var animationId;
var gameRunning = false;

// Audio elements
var bgm = new Audio("asset/bgm.mp3"); // Add the path to your background music file
bgm.loop = true; // Loop the background music
var hitSound = new Audio("asset/hit.wav"); // Add the path to your hit sound effect file

// Start playing background music as soon as the page loads
window.addEventListener("load", function () {
  bgm.volume = 0.05; // Set the volume of the background music
  bgm.play(); // Play background music
});

startBtn.addEventListener("click", function () {
  if (!gameRunning) {
    // only start the game if gameRunning is false
    gameRunning = true; // set gameRunning to true when the game starts
    document.querySelector(".start-screen").style.display = "none"; // Hide start screen
    document.querySelector(".button").style.display = "flex"; // Show control buttons
    canvas.style.display = "block"; // Show the canvas
    loop();
  }
});

restartBtn.addEventListener("click", function () {
  document.location.reload();
});

// Load racket images
var leftPaddleImage = new Image();
var rightPaddleImage = new Image();
leftPaddleImage.src = "asset/racket.png"; // Replace with your racket image
rightPaddleImage.src = "asset/racket.png"; // Use the same or different image

// Load ball properties
var ballRadius = 10;
var ballX = canvas.width / 2;
var ballY = canvas.height / 2;
var ballSpeedX = 4; // Slower ball speed
var ballSpeedY = 4; // Slower ball speed

// Define paddle properties
var paddleHeight = 150; // Increased paddle height for better visibility
var paddleWidth = 80; // Keep paddle width narrower
var leftPaddleY = canvas.height / 2 - paddleHeight / 2;
var rightPaddleY = canvas.height / 2 - paddleHeight / 2;
var paddleSpeed = 5;

// Define score properties
var leftPlayerScore = 0;
var rightPlayerScore = 0;
var maxScore = 10;

// Listen for keyboard events
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

// Handle key press
var upPressed = false;
var downPressed = false;
let wPressed = false;
let sPressed = false;

function keyDownHandler(e) {
  if (e.key === "ArrowUp") {
    upPressed = true;
  } else if (e.key === "ArrowDown") {
    downPressed = true;
  } else if (e.key === "w") {
    wPressed = true;
  } else if (e.key === "s") {
    sPressed = true;
  }
}

// Handle key release
function keyUpHandler(e) {
  if (e.key === "ArrowUp") {
    upPressed = false;
  } else if (e.key === "ArrowDown") {
    downPressed = false;
  } else if (e.key === "w") {
    wPressed = false;
  } else if (e.key === "s") {
    sPressed = false;
  }
}

// Update game state
function update() {
  // Move paddles
  if (upPressed && rightPaddleY > 0) {
    rightPaddleY -= paddleSpeed;
  } else if (downPressed && rightPaddleY + paddleHeight < canvas.height) {
    rightPaddleY += paddleSpeed;
  }

  if (wPressed && leftPaddleY > 0) {
    leftPaddleY -= paddleSpeed;
  } else if (sPressed && leftPaddleY + paddleHeight < canvas.height) {
    leftPaddleY += paddleSpeed;
  }

  // Move ball
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Check if ball collides with top or bottom of canvas
  if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

  // Check if ball collides with left paddle
  if (
    ballX - ballRadius < paddleWidth &&
    ballY > leftPaddleY &&
    ballY < leftPaddleY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
    hitSound.currentTime = 0; // Reset the hit sound to play from the beginning
    hitSound.play(); // Play hit sound
  }

  // Check if ball collides with right paddle
  if (
    ballX + ballRadius > canvas.width - paddleWidth &&
    ballY > rightPaddleY &&
    ballY < rightPaddleY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
    hitSound.currentTime = 0; // Reset the hit sound to play from the beginning
    hitSound.play(); // Play hit sound
  }

  // Check if ball goes out of bounds on left or right side of canvas
  if (ballX < 0) {
    rightPlayerScore++;
    reset();
  } else if (ballX > canvas.width) {
    leftPlayerScore++;
    reset();
  }

  // Check if a player has won
  if (leftPlayerScore === maxScore) {
    playerWin("Left player");
  } else if (rightPlayerScore === maxScore) {
    playerWin("Right player");
  }
}

function playerWin(player) {
  var message = "Congratulations! " + player + " wins!";
  $("#message").text(message); // Set the message text
  $("#message-modal").modal("show"); // Display the message modal
  reset();
}

// Reset ball to center of screen
function reset() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = -ballSpeedX;
  ballSpeedY = Math.random() * 3 - 1.5; // Slower random speed adjustment
}

// Draw objects on canvas
function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw ball
  ctx.fillStyle = "yellow"; // Tennis ball color
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();

  // Draw left paddle (racket)
  ctx.drawImage(leftPaddleImage, 0, leftPaddleY, paddleWidth, paddleHeight);

  // Draw right paddle (racket) - flip horizontally
  ctx.save(); // Save the current context
  ctx.translate(canvas.width, 0); // Move the context to the right edge
  ctx.scale(-1, 1); // Flip horizontally
  ctx.drawImage(rightPaddleImage, 0, rightPaddleY, paddleWidth, paddleHeight);
  ctx.restore(); // Restore the context to its original state

  // Draw scores with stroke
  ctx.fillStyle = "white";
  ctx.font = "30px font"; // Make sure the font is defined correctly
  ctx.fillText("Score: " + leftPlayerScore, 20, 40);
  ctx.fillText("Score: " + rightPlayerScore, canvas.width - 150, 40);

  // Add stroke to the text
  ctx.strokeStyle = "black"; // Set stroke color
  ctx.lineWidth = 1; // Set line width for the stroke
  ctx.strokeText("Score: " + leftPlayerScore, 20, 40);
  ctx.strokeText("Score: " + rightPlayerScore, canvas.width - 150, 40);
}

// Game loop
function loop() {
  update();
  draw();
  animationId = requestAnimationFrame(loop);
}

// Modal close functionality
$("#message-modal-close").on("click", function () {
  document.location.reload();
});
