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

