// project.js - purpose and description here
// Author: Peilin Huang
// Date: April 27 2025

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file



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


  
let rumiaImages = [];
let tileImageIndices = {}; 
let tileStates = {}; 
function p3_preload() {  
 
  rumiaImages.push(loadImage("img\\29360045.png"));
  rumiaImages.push(loadImage("img\\19455528.png"));
  rumiaImages.push(loadImage("img\\29551500.png"));
  rumiaImages.push(loadImage("img\\16667529.png"));
}

function p3_setup() {}

let worldSeed;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 38;
}

function p3_tileHeight() {
  return 47;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = `${i}_${j}`;
  clicks[key] = 1 + (clicks[key] | 0);

  tileStates[key] = !tileStates[key];
  setTimeout(() => {
    if (tileStates[key]) {
      tileImageIndices[key] = -1;
      redraw(); 
      setTimeout(() => {
        tileImageIndices[key] = rumiaImages.length - 1;
        redraw(); 
      }, 1000); 
    }
  }, 1000); 
}

function p3_drawBefore() {}

function p3_drawTile(i, j) {
  noStroke();

  if ((i + j) % 2 == 0) {
    fill(255, 255, 200);; 
  } else {
    fill(255); 
  }

  push();

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  // generate a key for this tile's image index
  let key = `${i}_${j}`;
  let hash = XXH.h32("tile:" + [i, j], worldSeed);

  // threshold value to determine if the tile should be empty
  let threshold = 0.4; 

  let norm = hash / (2 ** 32);
  if (norm < threshold) {
    tileImageIndices[key] = -1;
  } else {
    let remapped = map(norm, threshold, 1, 0, rumiaImages.length);
    let index = floor(constrain(remapped, 0, rumiaImages.length - 1));
    tileImageIndices[key] = index;
  }
  if (tileImageIndices[key] !== -1) {
    // Lift the image if the tile is clicked
    if (tileStates[key]) {
      translate(0, -10); 
    }
    image(rumiaImages[tileImageIndices[key]], -tw / 2, -th / 2, tw, th);
  }

  pop();
}
