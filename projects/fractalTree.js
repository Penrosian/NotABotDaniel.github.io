const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let d = 90;

function setD(dir){
    console.log("setD");
    if (dir > 360){
        d = dir - 360;
        setD(d);
    } else if (dir < 0){
        d = dir + 360;
        setD(d);
    } else {
        d = dir;
    }
}

function branch(x, y, leng, dir) {
    console.log("branch");
    setD(dir);
    ctx.lineWidth = leng / 5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + leng * Math.cos(d * Math.PI / 180), y + leng * Math.sin(d * Math.PI / 180));
    ctx.stroke();

    if (leng > 2) {
        console.log("firstBranch");
        branch(x + leng * Math.cos(d * Math.PI / 180), y + leng * Math.sin(d * Math.PI / 180), (leng / 4) * 3, dir - 20);
        console.log("secondBranch");
        branch(x + leng * Math.cos(d * Math.PI / 180), y + leng * Math.sin(d * Math.PI / 180), (leng / 4) * 3, dir + 20);
    }
}

ctx.fillStyle = "white";
ctx.fillRect(0,0,1000,1000);
ctx.fill();
ctx.fillStyle = "black"
branch(500,500,64,0);