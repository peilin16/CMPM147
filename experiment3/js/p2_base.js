/* exported preload, setup, draw, placeTile */
// Author: Peilin Huang
// Date: April 21 2025
/* global generateGrid drawGrid */

let seed = 0;
let tilesetImage;
let currentGrid = [];
let numRows, numCols;
let worldCanvas;
let isDrawDungeon = false;

function preload() {
  
  tilesetImage = loadImage(
    "img\\tileset.png"
  );
}

function reseed() {
  
  seed = (seed | 0) + 1109;
  randomSeed(seed);
  noiseSeed(seed);
  select("#seedReport").html("seed " + seed);
  regenerateGrid();
}

function regenerateGrid() {
  if(!isDrawDungeon)
    select("#asciiBox").value(gridToString(generateGrid(numCols, numRows)));
  else
    select("#asciiBox").value(gridToString(generateDungeon(numCols, numRows)));
  //select("#dungeonBox").value(gridToString(generateGrid(numCols, numRows)));
  reparseGrid();
}

function reparseGrid() {
  currentGrid = stringToGrid(select("#asciiBox").value());
  //dungeonGrid = stringToGrid(select("#dungeonBox").value());
}

function gridToString(grid) {
  let rows = [];
  for (let i = 0; i < grid.length; i++) {
    rows.push(grid[i].join(""));
  }
  return rows.join("\n");
}

function stringToGrid(str) {
  let grid = [];
  let lines = str.split("\n");
  for (let i = 0; i < lines.length; i++) {
    let row = [];
    let chars = lines[i].split("");
    for (let j = 0; j < chars.length; j++) {
      row.push(chars[j]);
    }
    grid.push(row);
  }
  return grid;
}

function setup() {
  numCols = select("#asciiBox").attribute("rows") | 0;
  numRows = select("#asciiBox").attribute("cols") | 0;

  // Create main canvas and place it into #canvasContainer
  worldCanvas = createCanvas(16 * numCols, 16 * numRows)
  select("#worldCanvasContainer").elt.appendChild(worldCanvas.canvas);
  // Create separate dungeon canvas using createGraphics and attach to DOM manually
  /*
  dungeonCanvas = createCanvas(16 * numCols, 16 * numRows);
  select("#dungeonCanvasContainer").elt.appendChild(dungeonCanvas.canvas);
  */

  // Optional: disable smoothing for retro pixel style
  select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;

  select("#reseedButton").mousePressed(reseed);
  //select("#dungeonBox").input(reparseGrid);
  select("#asciiBox").input(reparseGrid);
  select("#drawButton").mousePressed(changeMode);

  reseed();
}
function changeMode(){
  if(isDrawDungeon){
    isDrawDungeon = false;
    select("#drawButton").html("Draw World");
  }
    
  else{
    select("#drawButton").html("Draw Dungeon");
    isDrawDungeon = true;
  }

  reseed();
}

function draw() {
  //alert("grid")
  
  randomSeed(seed);
  if(!isDrawDungeon)
    drawGrid(currentGrid);
  else
    drawDungeon(currentGrid);
  //drawGrid(dungeonGrid);
  //regenerateGrid();
}

function placeTile(i, j, ti, tj) {
  image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
}
function placeBlendedTile(i, j, baseTi, baseTj, edgeTi, edgeTj) {
  // Draw background base tile first
  image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * baseTi, 8 * baseTj, 8, 8);
  // Draw edge tile on top
  image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * edgeTi, 8 * edgeTj, 8, 8);
}