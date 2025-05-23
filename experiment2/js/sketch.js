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
const screenWidth = 400;
let ifredraw = true;
let trees = [];
let swayingEllipses = [];
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
  reimage(); // p5 function to force re-drawing
});


function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}


function setup() {
  canvas = createCanvas(400, 700);
  canvas.parent("picture-container");
  
  // Generate animated ellipse data


  // Enable animation
  //frameRate(60);
  //noloop(); // remove noLoop if it's still in place
}
function reimage(){
  seed++;
  ifredraw = true;
  draw(); // force redraw after updating seed
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  //randomSeed(seed);
  // === Far Background: Leafy canopy ===
  randomSeed(seed);



/*
for (let i = 0; i < 100; i++) {
  swayingEllipses.push({
    baseX: random(screenWidth),
    baseY: random(height * 0.55, height),
    size: random(3, 10),
    swaySpeed: random(0.01, 0.03),
    swayRange: random(5, 15),
    color: color(random(60, 100), random(110, 160), random(60, 100), 120)
  });
}*/




  background(leafColor); // soft leafy green
  for (let i = 0; i < 120; i++) {
    fill(140 + random(-20, 20), 180 + random(-20, 20), 140 + random(-20, 20), 80);
    noStroke();
    ellipse(random(screenWidth), random(height / 1.5), random(40, 90), random(30, 70));
  }

  // === Close Background: Grass field ===
  fill(grassColor);
  //rect(0, height * 0.55, width, height * 0.45);
  rect(0, 500, 1000, 420);
  // Draw wildflowers on the meadow using simple ellipses with a subtle sway effect
  for (let i = 0; i < 300; i++) {
    fill(random(60, 100), random(110, 120), random(60, 100), 120);
    let x = random(screenWidth);
    let sway = sin(frameCount / 20 + i) * 5;
    x += sway
    ellipse(x, random(height * 0.43, height), random(3, 10));
  }
  //alert(width)

  // === Animated swaying ellipses in the grass ===
  for (let i = 0; i < swayingEllipses.length; i++) {
    let e = swayingEllipses[i];
    let offsetX = sin(frameCount * e.swaySpeed + i) * e.swayRange;
    fill(e.color);
    noStroke();
    ellipse(e.baseX + offsetX, e.baseY, e.size);
  }


  // === Trees ===
  /*if(ifredraw == false)
    return;
  ifredraw = false;*/
  // === Road ===
  drawPath();
  stroke(treeColor);
  for (let i = 0; i < 9; i++) {
    let x = random(screenWidth);
    if(x > 100 && x < 300){
      i -= 1;
      continue;
    }
    let y = random(height - 300, height); ;
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
  let pathBottom = height;
  let forkY = height * 0.5;
  let steps = 30;
  let offset = random(100);

  // ===== Main path (bottom to fork point) =====
  for (let i = 0; i <= steps; i++) {
    let t = i / steps;
    let y = lerp(pathBottom, forkY, t);
    let curve = sin(y * 0.01 + offset) * 20;
    let pathWidth = lerp(120, 40, t);
    let x = width / 2 + curve;
    vertex(x - pathWidth / 2, y);
  }

  // === Left fork branch ===
  for (let i = 0; i <= 10; i++) {
    let t = i / 10;
    let y = lerp(forkY, forkY - 60, t);
    let x = width / 2 - 20 - 50 * t; // branch left
    let w = lerp(50, 20, t);
    vertex(x + w / 2, y);
  }

  // === Right fork branch ===
  for (let i = 10; i >= 0; i--) {
    let t = i / 10;
    let y = lerp(forkY, forkY - 60, t);
    let x = width / 2 + 20 + 50 * t; // branch right
    let w = lerp(40, 20, t);
    vertex(x - w / 2, y);
  }

  // === Back to bottom of the path ===
  for (let i = steps; i >= 0; i--) {
    let t = i / steps;
    let y = lerp(pathBottom, forkY, t);
    let curve = sin(y * 0.01 + offset) * 20;
    let pathWidth = lerp(120, 40, t);
    let x = width / 2 + curve;
    vertex(x + pathWidth / 2, y);
  }

  endShape(CLOSE);

  // === Stone Tablet ===
  fill("#999");
  let stoneW = 40;
  let stoneH = 50;
  let stoneX = width / 2;
  let stoneY = forkY - 60;
  rectMode(CENTER);
  rect(stoneX, stoneY, stoneW, stoneH, 5); // rounded corners for style
}

function drawTree(x, y, len, baseLean) {
  let segments = int(len / 10);
  let prevX = x;
  let prevY = y;

  // Default sway
  let angle = baseLean;

  // Check mouse proximity (adjust radius as needed)
  let distance = dist(mouseX, mouseY, x, y);
  if (distance < 70) {
    let swing = sin(frameCount * 0.1) * 0.4; // swinging motion
    angle += swing/4;
  }

  for (let i = 0; i < segments; i++) {
    let dx = sin(angle) * 5;
    let dy = -10;

    let nextX = prevX + dx;
    let nextY = prevY + dy;

    line(prevX, prevY, nextX, nextY);

    prevX = nextX;
    prevY = nextY;

    angle += random(-0.03, 0.03); // natural curvature
  }
}




// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
  
  //alert(x)


  reimage(); // allow interactivity if needed
}