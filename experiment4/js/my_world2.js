// project.js - purpose and description here
// Author: Peilin Huang
// Date: April 27 2025

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

"use strict";

/* global XXH, loadImage */

let rumiaImages = [];

function p3_preload() {  
  rumiaImages.push(loadImage("img\\29360045.png"));
  rumiaImages.push(loadImage("img\\19455528.png"));
  rumiaImages.push(loadImage("img\\29551500.png"));
  rumiaImages.push(loadImage("img\\16667529.png"));
}

function p3_setup() {}

let worldSeed;
function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 46);  
  noiseSeed(worldSeed);  
  randomSeed(worldSeed);  
}

function p3_tileWidth() {
  return 24;
}

function p3_tileHeight() {
  return 36;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let placedRumias = {}; // store placed rumias by tile coordinates

function p3_tileClicked(i, j) {
  let key = `${i}_${j}`;
  // Randomly pick a rumia image
  placedRumias[key] = floor(random(rumiaImages.length));
}

function p3_drawBefore() {}

function p3_drawTile(i, j) {
  noStroke();

  let key = `${i}_${j}`;

  // Unified global bounce based on time
  let t = millis() * 0.002; // adjust speed
  let globalYOffset = sin(t) * 5; // up/down bounce

  // Determine terrain type using noise
  let terrainNoise = noise(i * 0.1, j * 0.1);
  let fillColor;
  let terrainYOffset = 0;
  
  if (terrainNoise < 0.33) {
    // Light orange, biggest offset
    fillColor = color(255, 220, 180);
    terrainYOffset = 48;
  } else if (terrainNoise < 0.66) {
    // Light yellow, medium offset
    fillColor = color(255, 255, 200);
    terrainYOffset = 24;
  } else {
    // White, no offset
    fillColor = color(255);
    terrainYOffset = 0;
  }

  fill(fillColor);

  push();
  beginShape();
  vertex(-tw, 0 + terrainYOffset + globalYOffset);
  vertex(0, th + terrainYOffset + globalYOffset);
  vertex(tw, 0 + terrainYOffset + globalYOffset);
  vertex(0, -th + terrainYOffset + globalYOffset);
  endShape(CLOSE);

  // Draw Rumia if placed on this tile
  if (placedRumias.hasOwnProperty(key)) {
    let rumiaIndex = placedRumias[key];
    let img = rumiaImages[rumiaIndex];
    if (img) {
      push();
      translate(0, terrainYOffset + globalYOffset - th / 2);
      image(img, -tw / 2, -th / 2, tw, th);
      pop();
    }
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
  textAlign(CENTER, CENTER);
  text(`tile ${i},${j}`, 0, 0);
}

function p3_drawAfter() {}
