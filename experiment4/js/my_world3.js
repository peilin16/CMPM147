// project.js - purpose and description here
// Author: Peilin Huang
// Date: April 27 2025

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file


"use strict";

/* global XXH, loadImage */
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
  return 40;
}

function p3_tileHeight() {
  return 56;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = `${i}_${j}`;
  clicks[key] = 1 + (clicks[key] | 0);

  tileStates[key] = !tileStates[key];

  if (tileStates[key]) {
  
    let index = floor(random(rumiaImages.length));
    tileImageIndices[key] = index;
  } else {

    tileImageIndices[key] = undefined;
  }

  redraw(); 
}

function p3_drawBefore() {
  background(255); // simulate white column background
}

function p3_drawTile(i, j) {
  noStroke();
  rectMode(CENTER);

  let key = `${i}_${j}`;

  // Animate zoom in/out per tile
  let t = millis() * 0.003;
  let bounce = sin(t + (i + j) * 0.5) * 5;

  // Use hash to consistently assign tile color
  let hash = XXH.h32("tilecolor:" + key, worldSeed);
  let isYellow = (hash % 2 === 0); // even = yellow, odd = orange

  if (isYellow) {
    fill(255, 255, 200); // light yellow
  } else {
    fill(255, 220, 180); // light orange
  }

  rect(0, 0, tw + bounce, th + bounce);

  // Draw Rumia if placed
  if (tileImageIndices[key] !== undefined) {
    image(rumiaImages[tileImageIndices[key]], -tw / 2, -th / 2, tw, th);
  }
}
