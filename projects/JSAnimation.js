const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const gravity = 1;

let currentX = [];
let currentY = [];
let speedX = [];
let speedY = [];
let size = [];
let frame = 0;

function drawRect(x,y,s) {
    console.log("drawing rect");
    ctx.fillRect(x,y,s,s);
    ctx.fill();
}

function drawCircle(x,y,r) {
    console.log("drawing circle");
    ctx.beginPath();
    ctx.arc(x,y,r,0,2*Math.PI);
    ctx.fill();
}

function createObject(x,y,s) {
    currentX.push(x);
    currentY.push(y);
    speedX.push(3);
    speedY.push(0);
    size.push(s);
}

function updateObjects(item) {
    drawCircle(currentX[item],currentY[item],size[item]/2);
    if (frame < 1000) {
        // console.log("Item num: " + item);
        console.log("X: " + currentX);
        console.log("Y: " + currentY);
        console.log("speedX: " + speedX);
        console.log("speedY: " + speedY);
    }

    currentX[item] += speedX[item];
    currentY[item] += speedY[item];

    if (currentX[item] >= 400 - size[item]/2 + size[item]/10) {
        speedX[item] *= -1;
        currentX[item] -= size[item]/30;
    } else if (currentX[item] <= 0 + size[item]/2 - size[item]/10) {
        speedX[item] *= -1;
        currentX[item] += size[item]/30;
    }

    if (currentY[item] >= 400 - size[item]/2 + size[item]/10) {
        speedY[item] *= -1;
        currentY[item] -= size[item]/30;
    } else if (currentY[item] <= 0 + size[item]/2 - size[item]/10) {
        speedY[item] *= -1;
        currentY[item] += size[item]/30;
    } else {
        speedY[item] += gravity;
    }

    if (item < currentX.length - 1) {
        updateObjects(item+1);
    }
}

function detectColisions() {
    for (let i = 0; i < currentX.length; i++) {
        for (let j = i + 1; j < currentX.length; j++) {
            if (Math.sqrt(Math.pow(currentX[j] - currentX[i], 2) + Math.pow(currentY[j] - currentY[i], 2)) < size[i]/2 + size[j]/2) {
                console.log("COLISION DETECTED!")
                let comparedDir = Math.atan2(currentY[j] - currentY[i], currentX[j] - currentX[i]);
                let iSpeed = Math.sqrt(Math.pow(speedX[i], 2) + Math.pow(speedY[i], 2));
                let jSpeed = Math.sqrt(Math.pow(speedX[j], 2) + Math.pow(speedY[j], 2));
                let iDir = Math.atan2(speedY[i], speedX[i]);
                let jDir = Math.atan2(speedY[j], speedX[j]);
                let iNewDir = 2 * comparedDir - iDir + Math.PI;
                let jNewDir = 2 * comparedDir - jDir + Math.PI;
                speedX[i] = Math.cos(iNewDir) * iSpeed;
                speedY[i] = Math.sin(iNewDir) * iSpeed;
                speedX[j] = Math.cos(jNewDir) * jSpeed;
                speedY[j] = Math.sin(jNewDir) * jSpeed;
                currentX[i] += speedX[i];
                currentY[i] += speedY[i];
                currentX[j] += speedX[j];
                currentY[j] += speedY[j];

                if (frame < 1000) {
                    console.log("compDir: " + comparedDir);
                    console.log("iSpeed: " + iSpeed);
                    console.log("jSpeed: " + jSpeed);
                    console.log("iDir: " + iDir);
                    console.log("jDir: " + jDir);
                    console.log("iNewDir: " + iNewDir);
                    console.log("jNewDir: " + jNewDir);
                    console.log("speedX: " + speedX);
                    console.log("speedY: " + speedY);
                }
            }
        }
    }
}


function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (currentX.length > 0) {
        updateObjects(0);
    }

    if (currentX.length > 1) {
        detectColisions()
    }

    if (frame == 0) {
        createObject(200,100,60);
    }
    
    if (frame == 100) {
        createObject(200,100,40);
        createObject(200,100,20);
        createObject(200,100,80);
    }

    frame += 1;
    requestAnimationFrame(animate);
}

ctx.fillStyle = 'blue';

animate();