const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const scale = 20; // hücre boyutu
const rows = canvas.height / scale;
const cols = canvas.width / scale;

let snake;
let food;
let scoreEl = document.getElementById('score');
let restartBtn = document.getElementById('restart');
let gameInterval;
let speed = 120; // ms

function init() {
  snake = {
    body: [{x: Math.floor(cols/2), y: Math.floor(rows/2)}],
    dir: {x:1, y:0},
    nextDir: {x:1, y:0},
  };
  placeFood();
  scoreEl.textContent = 0;
  clearInterval(gameInterval);
  gameInterval = setInterval(update, speed);
}

function placeFood() {
  food = {
    x: Math.floor(Math.random() * cols),
    y: Math.floor(Math.random() * rows)
  };
  // food yılanın üzerinde oluşursa tekrar yerleştir
  if(snake.body.some(p => p.x === food.x && p.y === food.y)) placeFood();
}

function update() {
  // yön değişimini uygula
  snake.dir = snake.nextDir;

  // yeni kafa pozisyonu
  const head = {x: snake.body[0].x + snake.dir.x, y: snake.body[0].y + snake.dir.y};

  // duvara çarpma => oyun sonu (wrap yerine sonlandırmak tercih ettik)
  if(head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
    gameOver();
    return;
  }

  // kendine çarpma
  if(snake.body.some(seg => seg.x === head.x && seg.y === head.y)) {
    gameOver();
    return;
  }

  snake.body.unshift(head);

  // yiyeceği yediyse skor artar ve yeni yiyecek
  if(head.x === food.x && head.y === food.y) {
    const score = parseInt(scoreEl.textContent, 10) + 1;
    scoreEl.textContent = score;
    placeFood();
    // istersen hızlanma:
    // if (score % 5 === 0 && speed > 40) { speed -= 8; clearInterval(gameInterval); gameInterval = setInterval(update, speed); }
  } else {
    snake.body.pop();
  }

  draw();
}

function gameOver() {
  clearInterval(gameInterval);
  alert('Oyun bitti! Skor: ' + scoreEl.textContent);
}

function draw() {
  ctx.fillStyle = '#111';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // yiyecek
  ctx.fillStyle = '#e74c3c';
  ctx.fillRect(food.x*scale, food.y*scale, scale, scale);

  // yılan
  ctx.fillStyle = '#2ecc71';
  snake.body.forEach((p, i) => {
    ctx.fillStyle = i === 0 ? '#27ae60' : '#2ecc71';
    ctx.fillRect(p.x*scale, p.y*scale, scale-1, scale-1);
  });
}

window.addEventListener('keydown', (e) => {
  const k = e.key;
  if((k === 'ArrowUp' || k === 'w') && snake.dir.y !== 1) snake.nextDir = {x:0, y:-1};
  if((k === 'ArrowDown' || k === 's') && snake.dir.y !== -1) snake.nextDir = {x:0, y:1};
  if((k === 'ArrowLeft' || k === 'a') && snake.dir.x !== 1) snake.nextDir = {x:-1, y:0};
  if((k === 'ArrowRight' || k === 'd') && snake.dir.x !== -1) snake.nextDir = {x:1, y:0};
});

// restart butonu
restartBtn.addEventListener('click', () => init());

// başlat
init();
