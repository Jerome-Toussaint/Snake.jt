let rez = 20; // Resolution
let food;
let specialFood;
let greenFood;
let w;
let h;
let score = 0;
let highScore = 0;
let speedBoost = false;
let speedBoostEndTime = 0;
let gameOver = false;
let replayButton;

function setup() {
  createCanvas(800, 800); // Smaller canvas for higher resolution
  w = floor(width / rez);
  h = floor(height / rez);
  frameRate(10);
  snake = new Snake();
  foodLocation();
  specialFoodLocation();
  greenFoodLocation();
  replayButton = createButton('Replay');
  replayButton.position(width / 2 - 30, height / 2 + 20);
  replayButton.mousePressed(resetGame);
  replayButton.hide();
  console.log("Setup complete.");
}

function foodLocation() {
  let x = floor(random(w));
  let y = floor(random(h));
  food = createVector(x, y);
}

function specialFoodLocation() {
  let x = floor(random(w));
  let y = floor(random(h));
  specialFood = createVector(x, y);
}

function greenFoodLocation() {
  let x = floor(random(w));
  let y = floor(random(h));
  greenFood = createVector(x, y);
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    snake.setDir(-1, 0);
  } else if (keyCode === RIGHT_ARROW) {
    snake.setDir(1, 0);
  } else if (keyCode === DOWN_ARROW) {
    snake.setDir(0, 1);
  } else if (keyCode === UP_ARROW) {
    snake.setDir(0, -1);
  }
}

function draw() {
  scale(rez);
  background(50); // Darker background for better contrast
  if (snake.eat(food)) {
    foodLocation();
    score++;
  }
  if (snake.eatSpecial(specialFood)) {
    specialFoodLocation();
    score += 2;
  }
  if (snake.eatGreen(greenFood)) {
    greenFoodLocation();
    score += 2;
    speedBoost = true;
    speedBoostEndTime = millis() + 30000; // 30 seconds
    frameRate(20); // Increase speed
  }
  if (speedBoost && millis() > speedBoostEndTime) {
    speedBoost = false;
    frameRate(10); // Reset speed
  }
  snake.update();
  snake.show();

  if (snake.endGame()) {
    if (score > highScore) {
      highScore = score;
    }
    console.log("END GAME");
    background(255, 0, 0);
    gameOver = true;
    replayButton.show();
    noLoop();
  }

  noStroke();
  fill(255, 0, 0);
  rect(food.x, food.y, 1, 1);

  fill(0, 0, 255);
  rect(specialFood.x, specialFood.y, 1, 1);

  fill(0, 255, 0);
  rect(greenFood.x, greenFood.y, 1, 1);

  fill(255);
  textSize(1);
  text("Score: " + score, 1, 1);
  text("High Score: " + highScore, 1, 2);

  if (speedBoost) {
    let timeLeft = Math.ceil((speedBoostEndTime - millis()) / 1000);
    text("Speed Boost: " + timeLeft + "s", w - 10, 1);
  }

  if (gameOver) {
    textSize(2);
    textAlign(CENTER);
    text("Game Over!", w / 2, h / 2);
  }
}

function resetGame() {
  score = 0;
  speedBoost = false;
  gameOver = false;
  frameRate(10);
  snake = new Snake();
  foodLocation();
  specialFoodLocation();
  greenFoodLocation();
  replayButton.hide();
  loop();
}

class Snake {
  constructor() {
    this.body = [];
    this.body[0] = createVector(floor(w / 2), floor(h / 2));
    this.xdir = 0;
    this.ydir = 0;
    this.len = 0;
  }

  setDir(x, y) {
    this.xdir = x;
    this.ydir = y;
  }

  update() {
    let head = this.body[this.body.length - 1].copy();
    this.body.shift();
    head.x += this.xdir;
    head.y += this.ydir;
    this.body.push(head);
  }

  grow() {
    let head = this.body[this.body.length - 1].copy();
    this.len++;
    this.body.push(head);
  }

  split() {
    this.body.splice(0, floor(this.body.length / 2));
  }

  teleport() {
    let x = floor(random(w));
    let y = floor(random(h));
    this.body[this.body.length - 1] = createVector(x, y);
  }

  endGame() {
    let x = this.body[this.body.length - 1].x;
    let y = this.body[this.body.length - 1].y;
    if (x > w - 1 || x < 0 || y > h - 1 || y < 0) {
      return true;
    }
    for (let i = 0; i < this.body.length - 1; i++) {
      let part = this.body[i];
      if (part.x === x && part.y === y) {
        return true;
      }
    }
    return false;
  }

  eat(pos) {
    let x = this.body[this.body.length - 1].x;
    let y = this.body[this.body.length - 1].y;
    if (x === pos.x && y === pos.y) {
      this.grow();
      return true;
    }
    return false;
  }

  eatSpecial(pos) {
    let x = this.body[this.body.length - 1].x;
    let y = this.body[this.body.length - 1].y;
    if (x === pos.x && y === pos.y) {
      this.teleport();
      return true;
    }
    return false;
  }

  eatGreen(pos) {
    let x = this.body[this.body.length - 1].x;
    let y = this.body[this.body.length - 1].y;
    if (x === pos.x && y === pos.y) {
      this.grow();
      return true;
    }
    return false;
  }

  show() {
    for (let i = 0; i < this.body.length; i++) {
      fill(0);
      noStroke();
      rect(this.body[i].x, this.body[i].y, 1, 1);
    }
  }
}