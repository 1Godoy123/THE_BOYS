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
