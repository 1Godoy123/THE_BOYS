const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const DIFFICULTIES = {
    easy:   { pipeGap: 230, pipeSpeed: 2.2, jumpStrength: -9  },
    medium: { pipeGap: 185, pipeSpeed: 3.0, jumpStrength: -10 },
    hard:   { pipeGap: 140, pipeSpeed: 4.2, jumpStrength: -11 }
};

let pipeGap       = DIFFICULTIES.medium.pipeGap;
let pipeSpeed     = DIFFICULTIES.medium.pipeSpeed;

const bird = {
    x: 50,
    y: canvas.height / 2,
    width: 40,
    height: 30,
    velocity: 0,
    gravity: 0.5,
    jumpStrength: DIFFICULTIES.medium.jumpStrength,
    wingAngle: 0,
    wingDirection: 1
};

const pipes = [];
const pipeWidth = 70;

let gameOver         = false;
let gameStarted      = false;
let selectedDifficulty = 'medium';
let score            = 0;
let highScore        = localStorage.getItem('flappyHighScore') || 0;
let frameCount       = 0;
let animFrameId      = null;

const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
skyGradient.addColorStop(0,   '#87CEEB');
skyGradient.addColorStop(0.7, '#87CEFA');
skyGradient.addColorStop(1,   '#B0E0E6');

// ── Difficulty UI ──────────────────────────────────────────────────────────
const startScreen  = document.getElementById('startScreen');
const diffButtons  = document.querySelectorAll('.diff-btn');
const startBtn     = document.getElementById('startBtn');

diffButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        diffButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedDifficulty = btn.dataset.difficulty;
    });
});

startBtn.addEventListener('click', startGame);

// ── Game lifecycle ─────────────────────────────────────────────────────────
function startGame() {
    const diff    = DIFFICULTIES[selectedDifficulty];
    pipeGap       = diff.pipeGap;
    pipeSpeed     = diff.pipeSpeed;
    bird.jumpStrength = diff.jumpStrength;

    resetState();
    gameStarted = true;
    startScreen.style.display = 'none';

    if (animFrameId) cancelAnimationFrame(animFrameId);
    gameLoop();
}

function resetState() {
    bird.y        = canvas.height / 2;
    bird.velocity = 0;
    bird.wingAngle    = 0;
    bird.wingDirection = 1;
    pipes.length  = 0;
    score         = 0;
    frameCount    = 0;
    gameOver      = false;
}

function restartAfterDeath() {
    resetState();
    if (animFrameId) cancelAnimationFrame(animFrameId);
    gameLoop();
}

// ── Pipe spawning ──────────────────────────────────────────────────────────
function spawnPipe() {
    const minHeight = 50;
    const maxHeight = canvas.height - pipeGap - minHeight;
    const topHeight = minHeight + Math.random() * (maxHeight - minHeight);
    pipes.push({
        x: canvas.width,
        topHeight,
        bottomHeight: canvas.height - topHeight - pipeGap
    });
}

// ── Draw: bird ─────────────────────────────────────────────────────────────
function drawBird() {
    frameCount++;
    if (frameCount % 8 === 0) {
        bird.wingAngle += 0.4 * bird.wingDirection;
        if (Math.abs(bird.wingAngle) > 0.6) bird.wingDirection *= -1;
    }

    ctx.save();
    ctx.translate(bird.x, bird.y);
    ctx.rotate(bird.velocity * 0.08);

    const bw = bird.width;
    const bh = bird.height;

    ctx.fillStyle = '#F4D03F';
    ctx.fillRect(-bw/2, -bh/2, bw, bh);

    ctx.strokeStyle = '#B8860B';
    ctx.lineWidth = 3;
    ctx.strokeRect(-bw/2 + 2, -bh/2 + 2, bw - 4, bh - 4);

    ctx.fillStyle = '#1C2526';
    ctx.fillRect(bw/4 - 4, -bh/4 - 4, 10, 10);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(bw/4 - 2, -bh/4 - 2, 4, 4);

    ctx.fillStyle = '#E67E22';
    ctx.beginPath();
    ctx.moveTo(bw/2, -2);
    ctx.lineTo(bw/2 + 14, 0);
    ctx.lineTo(bw/2, 6);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#D35400';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#E67E22';
    ctx.save();
    ctx.rotate(bird.wingAngle * 0.7);
    ctx.fillRect(-bw/2 - 6, -8, 18, 16);
    ctx.fillStyle = '#D35400';
    ctx.fillRect(-bw/2 - 2, -6, 10, 4);
    ctx.fillRect(-bw/2 - 2,  2, 12, 4);
    ctx.restore();

    ctx.fillStyle = '#F1C40F';
    ctx.fillRect(-bw/2 + 6, -bh/2 + 6, 8, 8);

    ctx.restore();
}

// ── Draw: pipes ────────────────────────────────────────────────────────────
function drawPipes() {
    pipes.forEach(pipe => {
        const pw = pipeWidth;

        ctx.fillStyle = '#2E8B57';
        ctx.fillRect(pipe.x, 0, pw, pipe.topHeight);
        ctx.strokeStyle = '#1E5F3A';
        ctx.lineWidth = 4;
        for (let y = 20; y < pipe.topHeight; y += 28) {
            ctx.beginPath();
            ctx.moveTo(pipe.x, y);
            ctx.lineTo(pipe.x + pw, y);
            ctx.stroke();
        }

        ctx.fillStyle = '#2E8B57';
        ctx.fillRect(pipe.x, canvas.height - pipe.bottomHeight, pw, pipe.bottomHeight);
        for (let y = canvas.height - pipe.bottomHeight; y < canvas.height - 20; y += 28) {
            ctx.beginPath();
            ctx.moveTo(pipe.x, y);
            ctx.lineTo(pipe.x + pw, y);
            ctx.stroke();
        }

        ctx.fillStyle = '#27AE60';
        ctx.fillRect(pipe.x - 4, pipe.topHeight - 24, pw + 8, 28);
        ctx.fillRect(pipe.x - 4, canvas.height - pipe.bottomHeight, pw + 8, 28);
    });
}

// ── Draw: HUD ──────────────────────────────────────────────────────────────
function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`High Score: ${highScore}`, 10, 60);
}

// ── Collision ──────────────────────────────────────────────────────────────
function checkCollision() {
    if (bird.y - bird.height / 2 <= 0 || bird.y + bird.height / 2 >= canvas.height) return true;
    for (const pipe of pipes) {
        if (bird.x + bird.width / 2 > pipe.x && bird.x - bird.width / 2 < pipe.x + pipeWidth) {
            if (bird.y - bird.height / 2 < pipe.topHeight || bird.y + bird.height / 2 > canvas.height - pipe.bottomHeight) {
                return true;
            }
        }
    }
    return false;
}

// ── Game loop ──────────────────────────────────────────────────────────────
function gameLoop() {
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, canvas.height / 2 - 100, canvas.width, 200);
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2);
        ctx.fillText(`Score: ${score}`, canvas.width / 2 - 60, canvas.height / 2 + 40);
        return;
    }

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        spawnPipe();
    }

    pipes.forEach((pipe, i) => {
        pipe.x -= pipeSpeed;
        if (pipe.x + pipeWidth < 0) {
            pipes.splice(i, 1);
            score++;
        }
    });

    drawPipes();
    drawBird();
    drawScore();

    if (checkCollision()) {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('flappyHighScore', highScore);
        }
        gameOver = true;
    }

    animFrameId = requestAnimationFrame(gameLoop);
}

// ── Input ──────────────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
    if (e.code !== 'Space') return;
    e.preventDefault();
    if (!gameStarted) { startGame(); return; }
    if (gameOver) { restartAfterDeath(); } else { bird.velocity = bird.jumpStrength; }
});

canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    if (!gameStarted) return;
    if (gameOver) { restartAfterDeath(); } else { bird.velocity = bird.jumpStrength; }
}, { passive: false });
