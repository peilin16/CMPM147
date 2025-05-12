
"use strict";

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


let tileIds = [];
let worldSeed;
let rumia;
let direction = 'north';
let num = 0;
let eatNum = 0;
let participantsImages = [];
let grassImages =[];
let rumiaImages = [];
let meatImage;
function p3_preload() {

  rumiaImages["left"] = loadImage("img/rumiaLeft.png");
  rumiaImages["right"] = loadImage("img/rumiaRight.png");
  meatImage = loadImage("img\\meat.png");


  participantsImages.push(loadImage("img\\crino.png"));
  participantsImages.push(loadImage("img\\KawashiroSecondState.png"));
  participantsImages.push(loadImage("img\\Daiyousei-nothing1.png"));
  participantsImages.push(loadImage("img\\crino-fly1.png"));
  participantsImages.push(loadImage("img\\LilyWhite1.png"));
  participantsImages.push(loadImage("img\\MaidFairy1_2.png"));
  participantsImages.push(loadImage("img\\MaidFairy2_1.png"));
  participantsImages.push(loadImage("img\\MaidFairy3_1.png"));
  participantsImages.push(loadImage("img\\Luna2.png"));
  participantsImages.push(loadImage("img\\LilyBlack1.png"));
  participantsImages.push(loadImage("img\\reimu-fly-left1.png"));
  participantsImages.push(loadImage("img\\reimu-idle1.png"));
  participantsImages.push(loadImage("img\\roseFairy1.png"));
  participantsImages.push(loadImage("img\\StarSapphire1.png"));
  participantsImages.push(loadImage("img\\sunflowerFairy1.png"));
  participantsImages.push(loadImage("img\\SunnyMilk1.png"));
  participantsImages.push(loadImage("img\\Wriggle3.png"));
  participantsImages.push(loadImage("img\\MystiaLorelei1.png"));

  grassImages.push(loadImage("img\\glass1.png"));
  grassImages.push(loadImage("img\\glass2.png"));
  grassImages.push(loadImage("img\\glass3.png"));
  grassImages.push(loadImage("img\\glass4.png"));
  grassImages.push(loadImage("img\\glass5.png"));
  grassImages.push(loadImage("img\\glass6.png"));
}

function p3_setup() {}


function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
  tileIds = [];
  rumia = { i:0, j: 0, altitude:0 };
  //if (version === 3) {
    eatNum = 0;
  //}
  
  camera_offset.set(-width / 2, height / 2); // Set camera offset back to initial position


}

function p3_tileWidth() {
  return 66;
}
function p3_tileHeight() {
  return 66;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  if (getParticipantTileId(i, j) !== null) {
    return; // blocked
  }
    // Calculate the difference in indices between the rumia's current position and the clicked tile
    const di = i - rumia.i;
    const dj = j - rumia.j;

    if (Math.abs(di) <= 1 && Math.abs(dj) <= 1 && (di !== 0 || dj !== 0)) {
      // Update the rumia's position to the clicked tile
      rumia.i = i;
      rumia.j = j;

      // Determine the movement direction based on the difference in indices
      let movementX = 0;
      let movementY = 0;

      if (di > 0 && dj === 0) {
        // Move up
        direction = 'south';
        movementX = -tw * .1 / 2;
        movementY = -th * .1 / 2;
      } else if (di < 0 && dj === 0) {
        // Move down
        direction = 'north';
        movementX = tw * .1 / 2;
        movementY = th * .1 / 2;
      } else if (di === 0 && dj > 0) {
        // Move right
        direction = 'east';
        movementX = tw * .1 / 2;
        movementY = -th * .1 / 2;
      } else if (di === 0 && dj < 0) {
        // Move left
        direction = 'west';
        movementX = -tw * .1 / 2;
        movementY = th * .1 / 2;
      } else if (di > 0 && dj < 0) {
        // Move up-left (diagonal)
        direction = 'southwest';
        movementX = -tw * .1;
      } else if (di > 0 && dj > 0) {
        // Move up-right (diagonal)
        // direction = 'southeast';
        movementY = -th * .1;

      } else if (di < 0 && dj < 0) {
        // Move down-left (diagonal)
        // direction = 'northwest';
        movementY = th * .1;
      } else if (di < 0 && dj > 0) {
        // Move down-right (diagonal)
        direction = 'northeast';
        movementX = tw * .1;
      }

      // Adjust camera velocity based on the movement direction
      camera_velocity.x += movementX;
      camera_velocity.y += movementY;
    }
  
}

function p3_drawBefore() {
  background(100, 200, 100); // green background
}

function p3_drawTile(i, j) {
  const tileIdentifier = `tile:${i},${j}`;
  const tileHash = XXH.h32(tileIdentifier, worldSeed);
  push();
  resetMatrix(); // use screen coordinates
  fill(0);
  textSize(20);
  textAlign(LEFT, TOP);
  text("Eatting: " + eatNum, 10, 10);
  pop();
  
  
    let meatTile = false;
    let grassTile = false;
    let tileId;
    let tileId2;
    let grassIndex;
    
    // noStroke();

    if (tileHash % 75 == 0) { 
      tileId = getMeatTileId(i, j); 
      if (!tileId) {
        
        tileId = 0;
        setMeatTileId(i, j, tileId); // Store the unique ID for this tile
      }
      meatTile = true;
      num++;
    }
    
    else if (tileHash % 5 == 0) { // draw stars
      tileId2 = getGrassTileId(i, j);
      if (tileId2 === null) {
        // Assign a new unique ID to this tile
        grassIndex = num % 10; // set starid, rgb
        fill(255, 0, 0);
        setGrassTileId(i, j, grassIndex); // Store the unique ID for this tile
      }
      grassTile = true;
      num++;
    }

    push();
    
    if (grassTile) {
      drawGrass(tileId2);
    }
    
    if (meatTile) {
      drawMeat(tileId);
      
      if (tileId === 0 && rumia.i === i && rumia.j === j) {
        setMeatTileId(i, j, 1);
        eatNum++;
      }
    }

    if (rumia.i == i && rumia.j == j) {
      drawRumia(0, 0,direction);
    }


// draw Participant
    let participantId = getParticipantTileId(i, j);
    let hasMeat = meatTile;
    let isRumia = (rumia.i === i && rumia.j === j);
    
    if (participantId === null && !hasMeat && !isRumia) {
      const hash = XXH.h32(`participant:${i},${j}`, worldSeed);
      const chance = hash % 100;
    
      if (chance < 8) {
        const index = hash % participantsImages.length;
        setParticipantTileId(i, j, index);
        participantId = index;
      }
    }
    
    if (participantId !== null) {
      image(participantsImages[participantId], -tw / 2, -th / 2, tw, th);
    }



    pop();
  
}

function p3_drawSelectedTile(i, j) {
  
    const di = i - rumia.i;
    const dj = j - rumia.j;
    
    const isMoveable = Math.abs(di) <= 1 && Math.abs(dj) <= 1 && (di !== 0 || dj !== 0);
    
    if (!isMoveable) {
      stroke(255, 0, 0, 128); // Red stroke
      fill(255, 0, 0, 64); // Red fill
    } else {
      // Valid moveable tile within 1 tile of the rumia
      stroke(0, 255, 0, 128); // Green stroke
      fill(0, 255, 0, 64); // Green fill
    }

    // Draw the selected tile shape
    beginShape();
    vertex(-tw, 0);
    vertex(0, th);
    vertex(tw, 0);
    vertex(0, -th);
    endShape(CLOSE);

    // Reset stroke and fill settings for subsequent drawing
    noStroke();
    fill(0);
    //text("tile " + [i, j], 0, 0);
  
}

function p3_drawAfter() {}


function drawRumia(x, y, direction) {
  push();
  translate(x, y);
  let img;
  if (direction === "north" || direction === "northeast" || direction === "northwest" || direction === "east") {
  img = rumiaImages["right"];
  }else if (direction === "south" || direction === "southeast" || direction === "southwest" || direction === "west") {
    img =rumiaImages["left"];
  }

  image(img, -tw / 2, -th / 2, tw, th);
  pop();
}


function drawMeat(eaten) {
  push();
  if (eaten === 1) {
    // maybe shrink or fade if eaten
    tint(255, 128); 
  } else {
    noTint();
  }
  image(meatImage, -28, -13, 56, 26); 
  pop();
}

// Function to retrieve tile ID from the tileIds map
function getMeatTileId(i, j) {
  const key = `${i},${j}`;
  return tileIds[key] || null;
}

// Function to set tile ID in the tileIds map
function setMeatTileId(i, j, tileId) {
  const key = `${i},${j}`;
  tileIds[key] = tileId;
}

function drawGrass(index) {
  push();
  if (grassImages[index]) {
    image(grassImages[index], -tw / 2, -th / 2, tw, th);
  }
  pop();
}

// Function to retrieve tile ID from the tileIds map
function getGrassTileId(i, j) {
  const key = `${i},${j}`;
  return tileIds[key] || null;
}

function setGrassTileId(i, j, tileId) {
  const key = `${i},${j}`;
  tileIds[key] = tileId;
}
function getParticipantTileId(i, j) {
  const key = `participant:${i},${j}`;
  return tileIds[key] ?? null;
}

function setParticipantTileId(i, j, id) {
  const key = `participant:${i},${j}`;
  tileIds[key] = id;
}