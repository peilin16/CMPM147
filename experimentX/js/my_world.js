"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/
let boatImage;
let treeImage;
let houseImage;
let objectsToDraw = [];
let islandColors = {};
let tileObjects = {}; // key: "i,j" → value: "tree", "house", or "boat"
let worldSeed;
let islandEvelation = 0.65
let trimColor;
let clicks = {};


function p3_preload() {
    boatImage = loadImage('img\\boat.png');
    treeImage = loadImage('img\\tree.png');
    houseImage = loadImage('img\\house.png');
}

function p3_setup() {}


function fractalNoise(x, y) {
  return (
    0.6 * noise(x, y) +
    0.3 * noise(x * 2, y * 2) +
    0.1 * noise(x * 4, y * 4)
  );
}
function p3_worldKeyChanged(key) {
    islandColors = {};
    tileObjects = {}; // key: "i,j" → value: "tree", "house", or "boat"
    clicks = {};
    objectsToDraw = [];
    worldSeed = XXH.h32(key, 0);
    noiseSeed(worldSeed);
    randomSeed(worldSeed);
    
    trimColor = random(['red','#44ff88','#aaeeff']);
}

function p3_tileWidth() {
  return 32;
}
function p3_tileHeight() {
  return 16;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];



function p3_tileClicked(i, j) {
  let t = millis() / 1000.0;
  let nx = i * 0.1;
  let ny = j * 0.1;
  let elevation = noise(nx, ny);
  let isLand = elevation > islandEvelation;

  let key = `${i},${j}`;
  let current = tileObjects[key];

  if (isLand) {
    tileObjects[key] = random(['tree', 'house']);

  } else {
    tileObjects[key] = current === "boat" ? null : "boat";
  }
}

function p3_drawBefore() {}

function p3_drawTile(i, j) {
  noStroke();
  push();

  let t = millis() / 1000.0;
  let nx = i * 0.1;
  let ny = j * 0.1;
  let elevation = noise(nx, ny);

    let isLand = elevation > islandEvelation;
    if (isLand) {
    // Estimate the island's "core" coordinates by snapping to a larger grid
    let islandCoreX = Math.floor(nx * 0.3); // fewer clusters
    let islandCoreY = Math.floor(ny * 0.3);
    let islandKey = `${islandCoreX},${islandCoreY}`;

    if (!islandColors[islandKey]) {
        let hash = XXH.h32(islandKey, worldSeed);
        randomSeed(hash);
        islandColors[islandKey] = color(random(100, 255), random(100, 255), random(100, 255));
    }

    fill(islandColors[islandKey]);
    }
    else {
        // Animated water
        fill(100, 150, 233, 64 + 256 * noise(-t + i / 5, j / 5, t));
    }


  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);
  let key = `${i},${j}`;
  let obj = tileObjects[key];
  if (obj === "tree" && treeImage) {
    imageMode(CENTER);
    image(treeImage, 0, -th ); // position above tile
  } else if (obj === "house" && houseImage) {
    imageMode(CENTER);
    image(houseImage, 0, -th);
  } else if (obj === "boat" && boatImage) {
    imageMode(CENTER);
    image(boatImage, 0, -th);
  }

  pop();
}






function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {
  for (let { obj, x, y } of objectsToDraw) {
    push();
    translate(x, y - th); // center image above tile
    imageMode(CENTER);
    if (obj === "tree" && treeImage) {
      image(treeImage, 0, 0);
    } else if (obj === "house" && houseImage) {
      image(houseImage, 0, 0);
    } else if (obj === "boat" && boatImage) {
      image(boatImage, 0, 0);
    }
    pop();
  }
  // Clear the queue for the next frame
  objectsToDraw.length = 0;
}
