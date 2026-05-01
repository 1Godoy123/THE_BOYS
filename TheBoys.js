const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


const bird = {
    x: 50,
    y: canvas.height / 2,
    width: 40,
    height: 30,
    velocity: 0,
    gravity: 0.5,
    jumpStrength: -10,
    wingAngle: 0,
    wingDirection: 1
};

const pipes = [];
const pipeWidth = 70;
const pipeGap = 200;
const pipeSpeed = 3;

let gameOver = false;
let score = 0;
let highScore = localStorage.getItem('flappyHighScore') || 0;
let frameCount = 0;


const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
gradient.addColorStop(0, '#87CEEB');    
gradient.addColorStop(0.7, '#87CEFA');  
gradient.addColorStop(1, '#B0E0E6');    


function spawnPipe() {
    const pipeHeight = Math.random() * (canvas.height - pipeGap);
    pipes.push({
        x: canvas.width,
        topHeight: pipeHeight,
        bottomHeight: canvas.height - pipeHeight - pipeGap
    });
}


function drawBird() {

    frameCount++;
    if (frameCount % 8 === 0) {
        bird.wingAngle += 0.4 * bird.wingDirection;
        if (Math.abs(bird.wingAngle) > 0.6) {
            bird.wingDirection *= -1;
        }
    }

    ctx.save();
    ctx.translate(bird.x, bird.y);
    ctx.rotate(bird.velocity * 0.08);   

    const bw = bird.width;
    const bh = bird.height;
    const block = 8; 

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
    ctx.fillRect(-bw/2 - 2, 2, 12, 4);

    ctx.restore();

    ctx.fillStyle = '#F1C40F';
    ctx.fillRect(-bw/2 + 6, -bh/2 + 6, 8, 8);   

    ctx.restore();
}


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
        ctx.fillRect(pipe.x - 4, pipe.topHeight - 24, pw + 8, 28);   // cap top
        ctx.fillRect(pipe.x - 4, canvas.height - pipe.bottomHeight, pw + 8, 28); // cap bottom
    });
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`High Score: ${highScore}`, 10, 60);
}

function checkCollision(){
    if(bird.y-bird.height/2<=0 || bird.y + bird.height/2>=canvas.height){
        return true;
    }
    for(let pipe of pipes){
        if (bird.x + bird.width/2 > pipe.x && bird.x - bird.width/2 < pipe.x + pipeWidth) {
            if (bird.y - bird.height/2 < pipe.topHeight || bird.y + bird.height/2 > canvas.height - pipe.bottomHeight) {
                return true;
            }
        }
    }
    return false;
}

function gameLoop() {
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, canvas.height/2 - 100, canvas.width, 200);
        
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over', canvas.width/2 - 80, canvas.height/2);
        ctx.fillText(`Score: ${score}`, canvas.width/2 - 60, canvas.height/2 + 40);
        return;
    }
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

