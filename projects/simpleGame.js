const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const canvasSize = {x:500,y:500};

const player = {
    x : 200,
    y : 200,
    dx : 0,
    dy : 0,
    size : 40,
    maxSpeed : 10,
    xAcceleration : 1,
    xDeceleration : 1,
    decay : 0.5,
    jumpSpeed : 2,
    jumpMargin : 3,
    wallJump : 10,
    wallDeflect : 6,
    maxJump : 20
};
const keys = {};

const gravity = 0.2;

let currentX = [];
let currentY = [];
let speedX = [];
let speedY = [];
let size = [];
let frame = 0;

function drawCircle(x,y,r) {
    // console.log("drawing circle");
    ctx.beginPath();
    ctx.arc(x,y,r,0,2*Math.PI);
    ctx.fill();
}

function createObject(x,y,s,xs,ys) {
    currentX.push(x);
    currentY.push(y);
    speedX.push(xs);
    speedY.push(ys);
    size.push(s);
}

function updateObjects(item) {
    ctx.fillStyle = "white";
    drawCircle(currentX[item],currentY[item],size[item]/2);
    if (frame < 1000) {
        // console.log("Item num: " + item);
        // console.log("X: " + currentX);
        // console.log("Y: " + currentY);
        // console.log("speedX: " + speedX);
        // console.log("speedY: " + speedY);
    }

    currentX[item] += speedX[item];
    currentY[item] += speedY[item];

    if (currentX[item] >= canvasSize.x - size[item]/2 + size[item]/10) {
        speedX[item] *= -1;
        currentX[item] -= size[item]/30;
    } else if (currentX[item] <= 0 + size[item]/2 - size[item]/10) {
        speedX[item] *= -1;
        currentX[item] += size[item]/30;
    }

    if (currentY[item] >= canvasSize.y - size[item]/2 + size[item]/10) {
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

function updatePlayer() {
    ctx.fillStyle = "blue";
    drawCircle(player.x,player.y,player.size/2);

    player.x += player.dx;
    player.y += player.dy;

    if (player.x >= canvasSize.x - player.size/2 + player.size/10) {
        player.dx *= -1;
        player.x -= player.size/30;
    } else if (player.x <= 0 + player.size/2 - player.size/10) {
        player.dx *= -1;
        player.x += player.size/30;
    }

    if (player.y >= canvasSize.y - player.size/2 + player.size/10) {
        player.dy *= -1 * player.decay;
        player.y -= player.size/30;
    } else if (player.y <= 0 + player.size/2 - player.size/10) {
        player.dy *= -1 * player.decay;
        player.y += player.size/30;
    } else {
        player.dy += gravity;
    }

    if (keys["ArrowRight"]) {
        if (player.dx < player.maxSpeed) {
            player.dx += player.xAcceleration;
        }
    } else {
        if (player.dx > 0) {
            player.dx -= player.xDeceleration
        }
    }

    if (keys["ArrowLeft"]) {
        if (player.dx > -player.maxSpeed) {
            player.dx -= player.xAcceleration;
        }
    } else {
        if (player.dx < 0) {
            player.dx += player.xDeceleration
        }
    }

    if (keys["ArrowUp"]) {
        if (player.y >= canvasSize.y - player.size/2 - player.jumpMargin) {
            player.dy -= player.jumpSpeed;
        } else if (player.x <= 0 + player.size / 2 + player.jumpMargin) {
            if (player.dy > player.maxJump) {
                player.dy -= player.wallJump;
            }
            player.dx += player.wallDeflect;
        } else if (player.x >= canvasSize.x - player.size / 2 - player.jumpMargin) {
            if (player.dy > player.maxJump) {
                player.dy -= player.wallJump;
            }
            player.dx -= player.wallDeflect;
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (currentX.length > 0) {
        updateObjects(0);
    }

    if (frame == 0) {
        createObject(300,100,60,5,0);
    }

    updatePlayer();

    frame += 1;
    requestAnimationFrame(animate);
}

document.addEventListener("keydown", (e) => {keys[e.key] = true});
document.addEventListener("keyup", (e) => {keys[e.key] = false});

animate();