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
