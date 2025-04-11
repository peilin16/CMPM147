// sketch.js - purpose and description here
// Author: Peilin Huang
// Date: April 11 2025

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;
let seed = 219;

const pathColor = "#d3d3d3";
const leafColor = "#b7d3a8";
const grassColor = "#6b944d";
const treeColor = "#3e2f18";
class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }

    myMethod() {
        // code to run when method is called
    }
}



$("#reimage").click(function () {
  // Update the seed or randomness to get a new version
  seed += 1
  redraw(); // p5 function to force re-drawing
});


function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
function setup() {
  //alert("Hello World!")
  //randomSeed(seed);
  canvas = createCanvas(400, 700);
  canvas.parent("picture-container"); // attach canvas to the specific div
  noLoop(); // only draw when necessary


}
function reimage(){
  seed++;
  redraw(); // force redraw after updating seed
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  
  // === Far Background: Leafy canopy ===
  background(leafColor); // soft leafy green
  for (let i = 0; i < 120; i++) {
    fill(140 + random(-20, 20), 180 + random(-20, 20), 140 + random(-20, 20), 80);
    noStroke();
    ellipse(random(width), random(height / 1.5), random(40, 90), random(30, 70));
  }

  // === Close Background: Grass field ===
  fill(grassColor);
  rect(0, height * 0.55, width, height * 0.45);

  for (let i = 0; i < 300; i++) {
    fill(random(60, 100), random(110, 160), random(60, 100), 120);
    ellipse(random(width), random(height * 0.55, height), random(3, 10));
  }

  // === Road ===
  drawPath();

  // === Trees ===
  stroke(treeColor);
  for (let i = 0; i < 9; i++) {
    let x = random(width);
    let y = height;
    let h = random(450, 780);
    let lean = random(-0.3, 0.3);
    strokeWeight(random(3, 6));
    drawTree(x, y, h, lean);
  }
}

function drawPath() {
  noStroke();
  fill(pathColor);

  beginShape();

  let pathTop = height * 0.5;
  let pathBottom = height;
  let steps = 30;
  let offset = random(100);

  // Left side of the path (from bottom to top)
  for (let i = 0; i <= steps; i++) {
    let t = i / steps;
    let y = lerp(pathBottom, pathTop, t);
    let curve = sin(y * 0.01 + offset) * 20;
    let pathWidth = lerp(120, 30, t); // wide at bottom, narrow at top
    let x = width / 2 + curve;
    vertex(x - pathWidth / 2, y);
  }

  // Right side of the path (from top to bottom)
  for (let i = steps; i >= 0; i--) {
    let t = i / steps;
    let y = lerp(pathBottom, pathTop, t);
    let curve = sin(y * 0.01 + offset) * 20;
    let pathWidth = lerp(120, 30, t);
    let x = width / 2 + curve;
    vertex(x + pathWidth / 2, y);
  }

  endShape(CLOSE);
}

function drawTree(x, y, len, lean) {
  let segments = int(len / 10);
  let angle = lean;
  let prevX = x;
  let prevY = y;

  for (let i = 0; i < segments; i++) {
    let nextX = prevX + sin(angle) * 5;
    let nextY = prevY - 10;
    line(prevX, prevY, nextX, nextY);
    prevX = nextX;
    prevY = nextY;
    angle += random(-0.05, 0.05);
  }
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
  redraw(); // allow interactivity if needed
}