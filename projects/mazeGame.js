const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const mazeSize = 6;
const keys = {};
const maze = Array(mazeSize).fill(false).map(() => Array(mazeSize).fill(false));

const player = {
    x : canvas.width/2,
    y : canvas.height/2,
    dir : 0,
    rSpeed : Math.PI / 30,
    speed : 2,
    size : 10,
    view : Math.PI / 4
}

const ray = {
    x : 0,
    y : 0,
    speed : 1,
    speed2 : 1,
    rez : Math.PI / 200
}

const cellWidth = canvas.width / mazeSize;
const cellHeight = canvas.height / mazeSize;

let frame = 0;

function drawCircle(x,y,r) {
    ctx.beginPath();
    ctx.arc(x,y,r,0,2*Math.PI);
    ctx.fill();
}

function drawBird(x,y,d,size) {
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
}

function createMaze() {
    maze[0][0] = true;
    maze[0][1] = true;
    maze[0][2] = true;
    maze[0][3] = true;
    maze[0][4] = true;
    maze[0][5] = true;
    maze[1][5] = true;
    maze[2][5] = true;
    maze[3][5] = true;
    maze[4][5] = true;
    maze[5][5] = true;
    maze[5][4] = true;
    maze[5][3] = true;
    maze[5][2] = true;
    maze[5][1] = true;
    maze[5][0] = true;
    maze[4][0] = true;
    maze[3][0] = true;
    maze[2][0] = true;
    maze[1][0] = true;
}

function drawMaze() {
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            if (maze[row][col]) {
                ctx.fillRect(row * cellWidth, col * cellHeight, cellWidth, cellHeight);
            }
        }
    }
}

function controlls() {
    if (keys["ArrowRight"]) {
        player.dir += player.rSpeed;
    } else if (keys["ArrowLeft"]) {
        player.dir -= player.rSpeed;
    }
    if (keys["ArrowUp"]) {
        player.x += player.speed * Math.cos(player.dir);
        player.y += player.speed * Math.sin(player.dir);
    } else if (keys["ArrowDown"]) {
        player.x -= player.speed * Math.cos(player.dir);
        player.y -= player.speed * Math.sin(player.dir);
    }
}

function playerWallColision() {
    if (player.x < 0 + player.size) {
        player.x += player.speed;
    }
    if (player.x > canvas.width - player.size) {
        player.x -= player.speed;
    }
    if (player.y < 0 + player.size) {
        player.y += player.speed;
    }
    if (player.y > canvas.height - player.size) {
        player.y -= player.speed;
    }
}

function playerMazeColision() {
    let mx = Math.floor(player.x / cellWidth);
    let my = Math.floor(player.y / cellHeight);

    if (maze[mx]?.[my]) {
        let cx = cellWidth * (mx + 0.5);
        let cy = cellHeight * (my + 0.5);
        let ox = player.x - cx;
        let oy = player.y - cy;

        if (Math.abs(ox) > Math.abs(oy)) {
            player.x += Math.sign(ox) * player.speed;
        } else {
            player.y += Math.sign(oy) * player.speed;
        }
    }

    mx = Math.floor(player.x / cellWidth);
    my = Math.floor(player.y / cellHeight);

    if (maze[mx]?.[my]) {
        let cx = cellWidth * (mx + 0.5);
        let cy = cellHeight * (my + 0.5);
        let ox = player.x - cx;
        let oy = player.y - cy;

        if (Math.abs(ox) < Math.abs(oy)) {
            player.x += Math.sign(ox) * player.speed;
        } else {
            player.y += Math.sign(oy) * player.speed;
        }
    }
}

function castRay(a) {
    console.log("cast ray");
    let dist = 0;
    ray.x = player.x;
    ray.y = player.y;
    console.log("x: "+ray.x+", y: "+ray.y);
    if (maze[Math.floor(ray.x / cellWidth)][Math.floor(ray.y / cellHeight)]) {
        return 1;
    }
    while (dist < canvas.width + canvas.height) {
        console.log("maze["+Math.floor(ray.x / cellWidth)+"]["+Math.floor(ray.y / cellHeight)+"]")
        if (maze[Math.floor(ray.x / cellWidth)][Math.floor(ray.y / cellHeight)]) {
            while (dist < cellWidth + cellHeight) {
                ray.x -= Math.cos(a) * ray.speed2;
                ray.y -= Math.sin(a) * ray.speed2;
                dist -= ray.speed2;
                if (!maze[ray.x][ray.y]) {
                    return dist;
                }
            }
        }
        ray.x += Math.cos(a) * ray.speed;
        ray.y += Math.sin(a) * ray.speed;
        dist += ray.speed;
        console.log("x: "+ray.x+", y: "+ray.y);
        console.log("dist: "+dist);
    }
}

function computeView() {
    console.log("compute view");
    for (let col = -player.view; col < player.view; col += ray.rez) {
        vx = canvas.width / 2 + col;
        vy = 50 * canvas.height / (castRay(player.dir + col) + 1);
        ctx.moveTo(vx, vy);
        ctx.lineTo(vx, -vy);
        ctx.stroke();
        console.log("view stroke");
    }
}

function updatePlayerPos() {
    controlls();
    playerWallColision();
    playerMazeColision();
}

document.addEventListener("keydown", (e) => {keys[e.key] = true});
document.addEventListener("keyup", (e) => {keys[e.key] = false});

function animate() {
    if (frame < 10){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        updatePlayerPos();
        ctx.fillStyle = "blue";
        drawMaze();
        ctx.fillStyle = "red";
        drawBird(player.x, player.y, player.dir, player.size)
        ctx.fillStyle = "green";
        computeView();
    }
    frame++;
    requestAnimationFrame(animate);
}

createMaze();
animate();