const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

d = 90;

function setD(dir){
    if (dir > 360){
        d = dir - 360;
        setD(dir);
    } else if (dir < 0){
        d = dir + 360;
        setD(dir);
    } else {
        d = dir;
    }
}

function branch(x, y, leng, dir) {
    setD(dir);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + leng * Math.cos(d * Math.PI / 180), y + leng * Math.sin(d * Math.PI / 180));
    ctx.stroke();

    if (leng > 2) {
        branch(x + leng * Math.cos(d * Math.PI / 180), y + leng * Math.sin(d * Math.PI / 180), leng / 2, dir - 20);
        branch(x + leng * Math.cos(d * Math.PI / 180), y + leng * Math.sin(d * Math.PI / 180), leng / 2, dir + 20);
    }
}

ctx.fillStyle='white';
branch(999,400,64,0);