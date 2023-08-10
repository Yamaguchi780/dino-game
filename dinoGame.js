const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imageNames = ['bird', 'cactus', 'dino'];

const game = {
  counter: 0,
  enemys: [],
  image: {},
  isGameOver: true,
  score: 0,
  timer: null
};

let imageLoadCounter = 0;
for (const imageName of imageNames){
  const imagePath = `image/${imageName}.png`;
  game.image[imageName] = new Image();
  game.image[imageName].src = imagePath;
  game.image[imageName].onload = () => {
    imageLoadCounter += 1;
    if (imageLoadCounter === imageNames.length){
      init();
    }
  }
}

function init() {
  game.counter    = 0;
  game.enemys     = [];
  game.isGameOver = false;
  game.score      = 0;
  createDino();
  game.timer = setInterval(ticker, 30);
}

function ticker(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if(Math.floor(Math.random() * (100 -game.score/100)) === 0) {
    createCactus();
  }
  if(Math.floor(Math.random() * (200 -game.score/100)) === 0) {
    createBird();
  }

  moveDino();
  moveEnemys();

  drawDino();
  drawEnemys();
  drawScore();

  hitCheck();

  game.score += 1;
  game.counter = (game.counter + 1) % 1000000;

}

function createDino() {
  game.dino = {
      x: game.image.dino.width / 2,
      y: canvas.height - game.image.dino.height / 2,
      moveY: 0,
      width: game.image.dino.width,
      height: game.image.dino.height,
      image: game.image.dino
  }
}

function createCactus(){
  game.enemys.push({
    x: canvas.width + game.image.cactus.width / 2,
    y: canvas.height - game.image.cactus.height / 2,
    width: game.image.cactus.width,
    height: game.image.cactus.height,
    moveX: -10,
    image: game.image.cactus
  });
}

function createBird(){
  const birdY = Math.random() * (300 - game.image.bird.height) + 150;
  game.enemys.push({
    x: canvas.width + game.image.bird.width / 2,
    y: birdY,
    width: game.image.bird.width,
    height: game.image.bird.height,
    moveX: -15,
    image: game.image.bird
  });
}

function moveDino(){
  game.dino.y += game.dino.moveY;
  if (game.dino.y >= canvas.height -game.dino.height/2){
    game.dino.y = canvas.height - game.dino.height/2;
    game.dino.moveY = 0;
  } else {
    game.dino.moveY += 3;
  }
}

function hitCheck(){
  for (const enemy of game.enemys) {
    if (
        Math.abs(game.dino.x - enemy.x) < game.dino.width * 0.8 / 2 + enemy.width * 0.9 / 2 &&
        Math.abs(game.dino.y - enemy.y) < game.dino.height * 0.5 / 2 + enemy.height * 0.9 / 2
    ) {
        game.isGameOver = true;
        ctx.font = 'bold 100px serif';
        ctx.fillStyle = 'rgba(209, 10, 10, 1)'
        ctx.fillText(`Game Over!`, 130, 200);
        clearInterval(game.timer);
    }
  }
}

function drawScore() {
  ctx.font = '24px serif';
  ctx.fillText(`score: ${game.score}`, 0, 30);
}


function moveEnemys(){
  for (const enemy of game.enemys){
    enemy.x += enemy.moveX;
  }
  game.enemys = game.enemys.filter(enemy => enemy.x > -enemy.width);
}

function drawEnemys(){
  for (const enemy of game.enemys) {
    ctx.drawImage(enemy.image, enemy.x - enemy.width / 2, enemy.y - enemy.height / 2);
}
}


function drawDino(){
  ctx.drawImage(game.image.dino, game.dino.x - game.dino.width / 2, game.dino.y - game.dino.height / 2);
}


document.onkeydown = function(e) {
  if(e.key === ' ' && game.dino.moveY === 0) {
      game.dino.moveY = -41;
  }
  if(e.key === 'Enter' && game.isGameOver === true) {
    init();
}
};