// function sayHi(name) {
//     console.log("Hello " + name);
// }
// function f(x) {
//     console.log("f(" + String(x) + ") = " + String(x+1));
// }
// user = prompt("what's your name? ");
// sayHi(String(user));
// f(7);


const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

ctx.fillStyle='blue';
ctx.beginPath();
ctx.arc(100,300,25,0,2*Math.PI);
ctx.fill();