const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const size = 10;
const speed = 2;
const birds = 1000;
const maxDistance = 20;
const rotationSpeed = Math.PI / 40;
const mimicked = 6;
const mimicDist = 100;
const minDirDiff = Math.PI / 4;
const minGroupDist = 100;

const canSizeX = 1400;
const canSizeY = 750;

let angle = [];
let x = [];
let y = [];

let distances = Array(birds).fill(null).map(() => Array(birds).fill(Infinity));
let direction = 0

function drawBird(x,y,d) {
    let x1 = x + size * Math.cos(d);
    let y1 = y + size * Math.sin(d);

    let x2 = x + size * Math.cos(d + (Math.PI * 3 / 4));
    let y2 = y + size * Math.sin(d + (Math.PI * 3 / 4));

    let x3 = x + size * Math.cos(d - (Math.PI * 3 / 4));
    let y3 = y + size * Math.sin(d - (Math.PI * 3 / 4));

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function spawnBirds() {
    for (let s = 0; s < birds; s++) {
        x.push(Math.random() * canSizeX);
        y.push(Math.random() * canSizeY);
        angle.push(Math.random() * 2 * Math.PI);
    }
}

function wrap(i) {
    if (x[i] < 0) {
        x[i] = canSizeX;
    } else if (y[i] < 0) {
        y[i] = canSizeY;
    } else if (x[i] > canSizeX) {
        x[i] = 0;
    } else if (y[i] > canSizeY) [
        y[i] = 0
    ]
}

function processDistances() {
    distances = Array(birds).fill(null).map(() => Array(birds).fill(Infinity));
    for (let i = 0; i < birds; i++) {
        for (let j = i + 1; j < birds; j++) {
            let dx = x[i] - x[j];
            let dy = y[i] - y[j];
            let distance = Math.sqrt(dx * dx + dy * dy);
            distances[i][j] = distance;
            distances[j][i] = distance;
        }
    }
}

function detectColisions(i) {
    let closestIndex = -1;
    let minDistance = Infinity;

    for (let j = 0; j < birds; j++) {
        if (i != j && distances[i][j] < minDistance) {
            minDistance = distances[i][j];
            closestIndex = j;
        }
    }

    if (closestIndex !== -1 && minDistance <= maxDistance) {
        turnAway(i, closestIndex);
    }
}

function turnAway(i, c) {
    let angleBetween = Math.atan2(y[i] - y[c], x[i] - x[c]);
    turnToward(angle[i], angleBetween)
}

function turnWithGroup(i) {
    // Collect neighbors' distances with correct 2D array indexing
    let neighbors = [];
    for (let j = 0; j < birds; j++) {
        if (j != i && distances[i][j] <= mimicDist) { // Exclude self and filter by distance
            neighbors.push({ index: j, distance: distances[i][j] });
        }
    }

    // Sort neighbors by distance and select the closest 'mimicked' ones
    neighbors.sort((a, b) => a.distance - b.distance);
    let closestNeighbors = neighbors.slice(0, mimicked);

    // Ensure there are enough neighbors to calculate the average
    if (closestNeighbors.length === 0) return;

    // Compute the average angle of the closest neighbors
    let avgAngle = closestNeighbors.reduce((sum, neighbor) => sum + angle[neighbor.index], 0) / closestNeighbors.length;

    // Check the direction difference and adjust angle if needed
    if (Math.abs(angle[i] - avgAngle) > minDirDiff) {
        turnToward(angle[i], avgAngle);
    }
}

function moveTowardGroup(i) {
    let maxDistance = -Infinity;
    let f = -1;

    for (let j = 0; j < birds; j++) {
        if (i != j && distances[i][j] <= minGroupDist && distances[i][j] > maxDistance) { 
            maxDistance = distances[i][j];
            f = j;
        }
    }

    if (f != -1) {
        let angleBetween = Math.atan2(y[f] - y[i], x[f] - x[i]);
        turnToward(angle[i], angleBetween);
    }
}

function turnToward(a, b) {
    let diff = b - a;
    let normalizedDiff = ((diff + Math.PI) % (2 * Math.PI)) - Math.PI;
    direction = normalizedDiff > 0 ? 1 : -1;
}


function updateBirds() {
    processDistances();

    for (let i = 0; i < birds; i++) {
        direction = 0;
        moveTowardGroup(i);
        turnWithGroup(i);
        detectColisions(i);
        angle[i] += direction * rotationSpeed;

        x[i] += speed * Math.cos(angle[i]);
        y[i] += speed * Math.sin(angle[i]);
        wrap(i);

        drawBird(x[i],y[i],angle[i]);
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateBirds();
    requestAnimationFrame(animate);
}


ctx.fillStyle = "red";
spawnBirds();
animate();