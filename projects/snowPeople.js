const canvas = document.getElementById("snowPeople");
const ctx = canvas.getContext("2d");


function circle(x,y,r){
    ctx.beginPath();
    ctx.arc(x,y,r,0,2*Math.PI);
    ctx.fill();
}
function snowPerson(x,y,r){
    circle(x,y,r);
    circle(x,y+2.5*r,2*r);
    circle(x,y+5.5*r,2.5*r);
}

ctx.fillStyle='blue';
ctx.fillRect(0,0,400,400);
ctx.fillStyle='white';
ctx.fillRect(0,300,400,400);
ctx.fillStyle='white';
snowPerson(100,230,10)
snowPerson(200,230,10)
snowPerson(300,230,10)
