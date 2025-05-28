let canvas, ctx, scoreElement, gameOverElement, finalScoreElement, startScreen, startButton, volumeSlider, musicToggle;
let shootSound, explosionSound, gameOverSound, backgroundMusic1, backgroundMusic2, backgroundMusic3;
let player, enemies, enemyBullets, score, gameOver, gameStarted, keys, particles, enemyBulletSpeed, wave, currentMusic;
let backgroundMusics, animationFrameId;
let spacePressed = false;
let bossSpawned = false;

function initializeGame() {
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
  scoreElement = document.getElementById('score');
  gameOverElement = document.getElementById('gameOver');
  ticket = document.getElementById('ticket');
  finalScoreElement = document.getElementById('finalScore');
  startScreen = document.getElementById('startScreen');
  startButton = document.getElementById('startButton');
  volumeSlider = document.getElementById('volume');
  musicToggle = document.getElementById('musicToggle');
  restartBtn = document.getElementById('restartBtn');
  returnBtn = document.getElementById('returnBtn');
  shootSound = new Audio('../game/sounds/shoot.mp3');
  explosionSound = new Audio('../game/sounds/death.mp3');
  gameOverSound = new Audio('../game/sounds/playerDeath.mp3');
  backgroundMusic1 = new Audio('../game/sounds/phonk1.mp3');
  backgroundMusic2 = new Audio('../game/sounds/phonk2.mp3');
  backgroundMusic3 = new Audio('../game/sounds/phonk3.mp3');

  canvas.width = document.querySelector('.game-container').offsetWidth;
  canvas.height = document.querySelector('.game-container').offsetHeight;

  player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 50,
    width: (canvas.width * 0.03),
    height: (canvas.height * 0.09),
    speed: 5,
    bullets: []
  };
  enemies = [];
  enemyBullets = [];
  score = 0;
  gameOver = false;
  gameStarted = false;
  keys = {};
  particles = [];
  enemyBulletSpeed = 1.5;
  wave = 1;
  backgroundMusics = [backgroundMusic1, backgroundMusic2, backgroundMusic3];

  document.addEventListener('keydown', (event) => {
    if (event.code === 'ArrowLeft') keys.ArrowLeft = true;
    if (event.code === 'ArrowRight') keys.ArrowRight = true;
    if (event.code === 'Space' && !spacePressed) {
      spacePressed = true;
      shoot();
    }
  });
  document.addEventListener('keyup', (event) => {
    if (event.code === 'ArrowLeft') keys.ArrowLeft = false;
    if (event.code === 'ArrowRight') keys.ArrowRight = false;
    if (event.code === 'Space') spacePressed = false;
  });
  startButton.addEventListener('click', startGame);
  restartBtn.addEventListener('click', restartGame);
  returnBtn.addEventListener('click', returnToMenu);
  volumeSlider.addEventListener('input', setVolume);

  window.addEventListener('resize', () => {
    canvas.width = document.querySelector('.game-container').offsetWidth;
    canvas.height = document.querySelector('.game-container').offsetHeight;
    player.x = canvas.width / 2 - 25;
    player.y = canvas.height - 50;
  });

  // Додаємо функцію для малювання зірки
  
}

function stopGame() {
  gameStarted = false;
  gameOver = true;
  stopBackgroundMusic();
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  if (startScreen) startScreen.style.display = 'flex';
  if (gameOverElement) gameOverElement.style.display = 'none';
  if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function setVolume() {
  const volume = parseFloat(volumeSlider.value);
  shootSound.volume = volume;
  explosionSound.volume = volume;
  gameOverSound.volume = volume;
  backgroundMusics.forEach(music => music.volume = volume);
}

function playBackgroundMusic() {
  if (musicToggle.checked && gameStarted) {
    if (currentMusic) currentMusic.pause();
    currentMusic = backgroundMusics[Math.floor(Math.random() * backgroundMusics.length)];
    currentMusic.loop = true;
    currentMusic.play().catch(() => {});
  }
}

function stopBackgroundMusic() {
  if (currentMusic) {
    currentMusic.pause();
    currentMusic.currentTime = 0;
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 5 + 2;
    this.speedX = Math.random() * 4 - 2;
    this.speedY = Math.random() * 4 - 2;
    this.opacity = 1;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.opacity -= 0.02;
    this.size *= 0.95;
  }
  draw() {
    ctx.fillStyle = `rgba(0, 255, 255, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function spawnEnemies() {
  const spawnZones = [
    { xMin: 50, xMax: 250 },
    { xMin: canvas.width / 2 - 150, xMax: canvas.width / 2 + 150 },
    { xMin: canvas.width - 550, xMax: canvas.width - 250 }
  ];
  const zone = spawnZones[Math.floor(Math.random() * spawnZones.length)];

  if (wave === 7 && !bossSpawned) {
      bossSpawned = true;
    enemies.push({
      type: 'boss',
      x: canvas.width / 2 - 50,
      y: 100,
      width: 100,
      height: 100,
      speed: 1,
      health: 100,
      attackTimer: 0,
      currentAttack: 0,
      summonCooldown: 0,
      summonedCount: 0,
      attacks: [shootBullets, summonEnemies],
      angle: 0
    });
  } else if (wave === 4) {
    const positions = [
      { x: 0, y: 0 },
      { x: -60, y: 50 }, { x: 60, y: 50 },
      { x: -120, y: 100 }, { x: 120, y: 100 },
      { x: -180, y: 150 }, { x: 180, y: 150 }
    ];
    positions.forEach(pos => {
      enemies.push({
        x: zone.xMin + 200 + pos.x,
        y: 50 + pos.y,
        width: (canvas.width * 0.04),
        height: 20,
        speed: 2.8 + wave * 0.2,
        angle: 0,
        spawnZone: zone,
        type: 'butterfly',
        isSpiraling: false,
        spiralAngle: 0
      });
    });
  } else if (wave % 3 === 0) {
    const positions = [
      { x: 0, y: 0 },
      { x: -40, y: 60 }, { x: 40, y: 60 },
      { x: -80, y: 120 }, { x: 80, y: 120 }
    ];
    positions.forEach(pos => {
      enemies.push({
        x: zone.xMin + 100 + pos.x,
        y: 50 + pos.y,
        width: (canvas.width * 0.03),
        height: canvas.height * 0.05,
        speed: 2.5 + wave * 0.2,
        angle: 0,
        spawnZone: zone,
        type: 'bee',
        isDiving: false,
        diveTargetX: 0,
        diveTargetY: 0
      });
    });
  } else {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 3; j++) {
        enemies.push({
          x: zone.xMin + i * 80,
          y: 50 + j * 80,
          width: (canvas.width * 0.02) + 20,
          height: 10,
          speed: 2 + wave * 0.2,
          angle: 0,
          spawnZone: zone,
          type: 'regular'
        });
      }
    }
  }
}
function drawStar(cx, cy, spikes, outerRadius, innerRadius, color) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;
      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }
function drawPlayer() {
  ctx.fillStyle = '#00FFFF';
  ctx.shadowBlur = 20;
  ctx.shadowColor = '#00FFFF';
  ctx.beginPath();
  ctx.moveTo(player.x + player.width / 2, player.y);
  ctx.lineTo(player.x, player.y + player.height);
  ctx.lineTo(player.x + player.width, player.y + player.height);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawEnemy(enemy) {
  if (enemy.type === 'boss') {
    drawStar(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 5, 50, 20, '#7284a5');
  } else if (enemy.type === 'butterfly') {
    ctx.fillStyle = '#FF0000';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#FF0000';
    ctx.beginPath();
    const cx = enemy.x + enemy.width / 2;
    const cy = enemy.y + enemy.height / 2;
    const r = enemy.width / 2;
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i + Math.PI / 6;
      const px = cx + r * Math.cos(angle);
      const py = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
  } else if (enemy.type === 'bee') {
    ctx.fillStyle = '#00FF00';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00FF00';
    ctx.beginPath();
    ctx.moveTo(enemy.x + player.width / 2, enemy.y);
    ctx.lineTo(enemy.x + player.width, enemy.y + enemy.height / 2);
    ctx.lineTo(enemy.x + enemy.width / 2, enemy.y + enemy.height);
    ctx.lineTo(enemy.x, enemy.y + enemy.height / 2);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
  } else {
    ctx.fillStyle = '#FF00FF';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#FF00FF';
    ctx.beginPath();
    ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.width / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

function drawBullet(bullet) {
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
}

function movePlayer() {
  if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
  if (keys['ArrowRight'] && player.x < canvas.width - player.width) player.x += player.speed;
}

function shoot() {
  if (!gameStarted || gameOver) return;
  player.bullets.push({
    x: player.x + player.width / 2 - 2.5,
    y: player.y,
    width: 5,
    height: 10,
    speed: -10
  });
  shootSound = new Audio('../game/sounds/shoot.mp3');
  shootSound.play().catch(() => {});
}

function shootBullets(enemy) {
  const numBullets = 8;
  const angleStep = 2 * Math.PI / numBullets;
  for (let i = 0; i < numBullets; i++) {
    const angle = i * angleStep;
    enemyBullets.push({
      x: enemy.x + enemy.width / 2,
      y: enemy.y + enemy.height / 2,
      width: 5,
      height: 5,
      speedX: Math.cos(angle) * 3,
      speedY: Math.sin(angle) * 3
    });
  }
}

function summonEnemies(enemy) {
  if (enemy.summonCooldown > 0) {
    enemy.summonCooldown--;
    return;
  }

  if (enemy.summonedCount >= 15) return; 

  for (let i = 0; i < 3; i++) {
    enemies.push({
      x: enemy.x + Math.random() * 100 - 50,
      y: enemy.y + Math.random() * 100 - 50,
      width: (canvas.width * 0.02) + 20,
      height: 10,
      speed: 2 + wave * 0.2,
      angle: 0,
      type: 'regular'
    });
    enemy.summonedCount++;
  }

  enemy.summonCooldown = 60; 
}

function updateBullets() {
  player.bullets = player.bullets.filter(bullet => bullet.y > 0);
  player.bullets.forEach(bullet => {
    bullet.y += bullet.speed;
    drawBullet(bullet);
  });
  enemyBullets = enemyBullets.filter(bullet => bullet.y < canvas.height && bullet.x > 0 && bullet.x < canvas.width);
  enemyBullets.forEach(bullet => {
    if (bullet.speedX !== undefined && bullet.speedY !== undefined) {
      bullet.x += bullet.speedX;
      bullet.y += bullet.speedY;
    } else {
      bullet.y += bullet.speed;
    }
    drawBullet(bullet);
  });
}

function updateEnemies() {
  enemies.forEach(enemy => {
    if (enemy.type === 'boss') {
      enemy.angle += 0.02;
      enemy.x = canvas.width / 2 + Math.sin(enemy.angle) * 200;
      enemy.attackTimer++;
      if (enemy.attackTimer > 200) {
        enemy.currentAttack = (enemy.currentAttack + 1) % enemy.attacks.length;
        enemy.attackTimer = 0;
        enemy.summonedCount = 0;
      }
      enemy.attacks[enemy.currentAttack](enemy);
    } else if (enemy.type === 'butterfly') {
      if (enemy.isSpiraling) {
        enemy.spiralAngle += 0.2;
        enemy.x += Math.cos(enemy.spiralAngle) * 4;
        enemy.y += Math.sin(enemy.spiralAngle) * 4 + 2;
        if (enemy.spiralAngle > Math.PI * 4) {
          enemy.isSpiraling = false;
          enemy.y = 50;
          if (enemy.x > canvas.width - 520) {
            enemy.x = canvas.width - enemy.x + 50;
          } else if (enemy.x < 520) {
            enemy.x = canvas.width - enemy.x - 70;
          }
          enemy.angle = 0.05;
        }
      } else {
        enemy.angle += 0.05;
        enemy.x += Math.sin(enemy.angle) * enemy.speed * 0.8;
        enemy.y += 1.5;
        if (Math.random() < 0.02 && !enemy.isSpiraling) {
          enemy.isSpiraling = true;
          enemy.spiralAngle = 0;
        }
      }
    } else if (enemy.type === 'bee') {
      if (enemy.isDiving) {
        const dx = enemy.diveTargetX - enemy.x;
        const dy = enemy.diveTargetY - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 10) {
          enemy.x += (dx / distance) * 5;
          enemy.y += (dy / distance) * 5;
        } else {
          enemy.isDiving = false;
          enemy.y = 50;
          if (enemy.x > canvas.width - 520) {
            enemy.x = canvas.width - enemy.x + 50;
          } else if (enemy.x < 520) {
            enemy.x = canvas.width - enemy.x - 70;
          }
          enemy.angle = 0.05;
        }
      } else {
        enemy.angle += 0.05;
        enemy.x += Math.sin(enemy.angle) * enemy.speed * 1.5;
        enemy.y += 1;
        if (Math.random() < 0.01 && !enemy.isDiving) {
          enemy.isDiving = true;
          enemy.diveTargetX = player.x + player.width / 2;
          enemy.diveTargetY = player.y;
        }
      }
    } else {
      enemy.angle += 0.05;
      enemy.x += Math.sin(enemy.angle) * enemy.speed;
      enemy.y += 0.5;
    }
    if (enemy.y >= canvas.height && enemy.type !== 'boss') {
      enemy.y = 50;
      if (enemy.x > canvas.width - 520) {
        enemy.x = canvas.width - enemy.x + 50;
      } else if (enemy.x < 520) {
        enemy.x = canvas.width - enemy.x - 70;
      }
      enemy.angle = 0.05;
    }
    drawEnemy(enemy);
    if (enemy.type !== 'boss') {
      const shootChance = enemy.type === 'butterfly' ? 0.01 : enemy.type === 'bee' ? 0.005 : 0.001;
      if (Math.random() < shootChance) {
        enemyBullets.push({
          x: enemy.x + enemy.width / 2 - 2.5,
          y: enemy.y + enemy.height,
          width: 5,
          height: 10,
          speed: enemyBulletSpeed
        });
      }
    }
  });
}

function checkCollisions() {
  player.bullets.forEach((bullet, bulletIndex) => {
    enemies.forEach((enemy, enemyIndex) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        if (enemy.type === 'boss') {
          enemy.health -= 10;
          if (enemy.health <= 0) {
            for (let i = 0; i < 20; i++) {
              particles.push(new Particle(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2));
            }
            enemies.splice(enemyIndex, 1);
            score += 100;
            scoreElement.textContent = `Очки: ${score}`;
            explosionSound = new Audio('../game/sounds/death.mp3');
            explosionSound.play().catch(() => {});
            wave++;
            spawnEnemies();
          }
        } else {
          for (let i = 0; i < 10; i++) {
            particles.push(new Particle(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2));
          }
          enemies.splice(enemyIndex, 1);
          score += enemy.type === 'butterfly' ? 30 : enemy.type === 'bee' ? 20 : 10;
          scoreElement.textContent = `Очки: ${score}`;
          explosionSound = new Audio('../game/sounds/death.mp3');
          explosionSound.play().catch(() => {});
        }
        player.bullets.splice(bulletIndex, 1);
      }
    });
  });
  enemyBullets.forEach(bullet => {
    if (
      bullet.x < player.x + player.width &&
      bullet.x + bullet.width > player.x &&
      bullet.y < player.y + player.height &&
      bullet.y + bullet.height > player.y
    ) {
      gameOver = true;
      gameStarted = false;
      gameOverElement.style.display = 'flex';
      finalScoreElement.textContent = score;
      if (score>=1000){
        ticket.style.display= 'block';
      }
      gameOverSound.play().catch(() => {});
      stopBackgroundMusic();
    }
  });
  enemies.forEach(enemy => {
    if (
      player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.height &&
      player.y + player.height > enemy.y
    ) {
      gameOver = true;
      gameStarted = false;
      gameOverElement.style.display = 'flex';
      finalScoreElement.textContent = score;
      if (score>=1000){
        ticket.style.display= 'block';
      
      }
      gameOverSound.play().catch(() => {});
      stopBackgroundMusic();
    }
  });
  if (enemies.length === 0 && !gameOver) {
    wave++;
    spawnEnemies();
  }
}

function updateParticles() {
  particles = particles.filter(p => p.opacity > 0);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
}

function increaseEnemyBulletSpeed() {
  if (enemyBulletSpeed < 3) {
    enemyBulletSpeed += 0.05;
  }
}

setInterval(increaseEnemyBulletSpeed, 10000);

function gameLoop() {
  if (!gameStarted || gameOver) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  movePlayer();
  updateBullets();
  updateEnemies();
  updateParticles();
  checkCollisions();
  animationFrameId = requestAnimationFrame(gameLoop);
}

function startGame() {
  startScreen.style.display = 'none';
  ticket.style.display= 'none';
  gameStarted = true;
  spawnEnemies();
  setVolume();
  playBackgroundMusic();
  gameLoop();
}

function returnToMenu() {
  gameOverElement.style.display = 'none';
  ticket.style.display= 'none';
  startScreen.style.display = 'flex';
  gameOver = false;
  gameStarted = false;
  bossSpawned = false;
  player = { x: canvas.width / 2 - 25, y: canvas.height - 50, width: (canvas.width * 0.03), height: (canvas.height * 0.09), speed: 5, bullets: [] };
  enemies = [];
  enemyBullets = [];
  particles = [];
  score = 0;
  enemyBulletSpeed = 1.5;
  wave = 1;
  scoreElement.textContent = `Очки: ${score}`;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stopBackgroundMusic();
}

function restartGame() {
  player = { x: canvas.width / 2 - 25, y: canvas.height - 50, width: (canvas.width * 0.03), height: (canvas.height * 0.09), speed: 5, bullets: [] };
  enemies = [];
  enemyBullets = [];
  particles = [];
  score = 0;
  enemyBulletSpeed = 1.5;
  wave = 1;
  scoreElement.textContent = `Очки: ${score}`;
  gameOver = false;
  gameStarted = true;
  bossSpawned = false;
  gameOverElement.style.display = 'none';
  ticket.style.display= 'none';
  spawnEnemies();
  setVolume();
  playBackgroundMusic();
  gameLoop();
}