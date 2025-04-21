
  function generateGrid(numCols, numRows) {
    let grid = [];
    let snowOrForestTiles = [];
  
    // 1. Generate base terrain and track valid spawn spots
    for (let i = 0; i < numRows; i++) {
      let row = [];
      for (let j = 0; j < numCols; j++) {
        let noiseVal = noise(i * 0.1, j * 0.1);
        let ch;
        if (noiseVal < 0.27) {
          ch = 'W'; // Lake
        } else if (noiseVal < 0.55) {
          ch = (random() < 0.4) ? 'F' : 'S'; // Forest or Snow
        } else {
          ch = 'S'; // Snow
        }
        row.push(ch);
        if (ch === 'S' || ch === 'F') {
          snowOrForestTiles.push([i, j]);
        }
      }
      grid.push(row);
    }
  
    // 2. Shuffle the valid positions
    shuffle(snowOrForestTiles, true);
  
    // 3. Place treasures
    for (let t = 0; t < 4 && t < snowOrForestTiles.length; t++) {
      let [i, j] = snowOrForestTiles[t];
      grid[i][j] = 'T';
    }
  
    // 4. Place houses
    for (let h = 4; h < 7 && h < snowOrForestTiles.length; h++) {
      let [i, j] = snowOrForestTiles[h];
      grid[i][j] = 'H';
    }
  
    return grid;
  }
//R L T B eagle of lake
function drawGrid(grid) {
  background(128);
  
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      let ch = grid[i][j];
      if (ch === 'S') {
        placeTile(i, j, floor(random(4)), 12); // Snow
        
        //placeTile(i, j, 1, 15); // Snow
        //drawEdge(i, j, grid);
      } else if (ch === 'W') {
        let t = frameCount / 155 + noise(i, j) * 10;
        let frameVariant = floor(t) % 4;

        placeTile(i, j, frameVariant, 13); // animate water per frame
      } else if (ch === 'F') {
        placeTile(i, j, 0, 12); // Snow
        placeTile(i, j,floor(random(15, 19)) , floor(random(13, 14))); // Forest floor(random(16, 19))
      }else if (ch === 'T') {
        // Randomly choose one of two treasure tiles
        let variants = [
          [0, 28], // treasure 1
          [3, 28]  // treasure 2
        ];
        let [ti, tj] = random(variants);
        placeTile(i, j, floor(random(4)), 12); // Snow
        placeTile(i, j, ti, tj);
      }
      
      else if (ch === 'H') {
        // Randomly choose one of two house tiles
        let variants = [
          [27, 0], // house 1
          [27, 1]  // house 2
        ];
        let [ti, tj] = random(variants);
        placeTile(i, j, floor(random(4)), 12); // Snow
        placeTile(i, j, ti, tj);
      }
    }


  }

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      let ch = grid[i][j];
      if (ch === 'S') {
        drawEdge(i, j, grid);
      }
    }
  }

  //l left top
  //return grid;
}

function drawEdge(i, j, grid) {
  
  //top
  
  if(i- 1 > 0 && grid[i - 1][j] === 'W') {
    placeTile(i- 1, j , 5, 14);
  }
  //bottom
  
  if(i + 1 < numCols && grid[i + 1][j] === 'W') {
    placeTile(i+ 1, j , 5, 12);
    //placeTile(i + 1, j , 0, 0);
  }

  //left
  if(j - 1 > 0 && grid[i][j - 1] === 'W') {
    placeTile(i, j- 1 , 6, 13);
  }
  //right
  if(j + 1 < numRows && grid[i ][j + 1] === 'W') {
    placeTile(i, j + 1, 4, 13);
  }
//placeTile(i- 1, j , 0, 0);

}

/**
 *  if (topleft)   placeTile(i, j, 4, 12);
  if (topright)  placeTile(i, j, 6, 12);
  if (botleft)   placeTile(i, j, 4, 14);
  if (botright)  placeTile(i, j, 6, 14);

  if (top && !topleft && !topright)       placeTile(i, j, 5, 12);
  if (bottom && !botleft && !botright)    placeTile(i, j, 5, 14);
  if (left && !topleft && !botleft)      placeTile(i, j, 4, 13);
  if (right && !topright && !botright)     placeTile(i, j, 6, 13);

 */



function getAdjacentTypes(grid, i, j) {
  let types = [];
  let dirs = [
    [-1, 0], [1, 0], [0, -1], [0, 1] // top, bottom, left, right
  ];
  for (let [di, dj] of dirs) {
    let ni = i + di, nj = j + dj;
    if (ni >= 0 && ni < grid.length && nj >= 0 && nj < grid[0].length) {
      types.push(grid[ni][nj]);
    }
  }
  return types;
}
function generateDungeon(numCols, numRows) {
  let grid = [];

  // Step 1: Fill grid with walls
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push('#');
    }
    grid.push(row);
  }
  // Step 2: Generate rooms
  let rooms = [];
  let maxRooms = 6;
  let minRooms = 3;
  let maxAttempts = 100;
  let attempts = 0;
  let buffer = 2; // space between rooms
  while (rooms.length < maxRooms && attempts < maxAttempts) {
    let roomW = floor(random(6, 10));
    let roomH = floor(random(4, 8));
    let roomX = floor(random(1, numCols - roomW - 1));
    let roomY = floor(random(1, numRows - roomH - 1));
  
    let newRoom = { x: roomX, y: roomY, w: roomW, h: roomH };
  
    let overlaps = rooms.some(r =>
      roomX < r.x + r.w + buffer &&
      roomX + roomW + buffer > r.x &&
      roomY < r.y + r.h + buffer &&
      roomY + roomH + buffer > r.y
    );
  
    if (!overlaps) {
      for (let y = roomY; y < roomY + roomH; y++) {
        for (let x = roomX; x < roomX + roomW; x++) {
          grid[y][x] = '+';
        }
      }
  
      rooms.push(newRoom);
    }
  
    attempts++;
  }
  
  // After loop, check if we got enough rooms
  if (rooms.length < minRooms) {
    console.warn("Failed to place minimum number of rooms.");
    return generateDungeon(numCols, numRows); // try again
  }

  // Step 3: Connect all rooms with L-shaped corridors
  for (let i = 1; i < rooms.length; i++) {
    let prev = rooms[i - 1];
    let curr = rooms[i];

    let prevCenter = {
      x: floor(prev.x + prev.w / 2),
      y: floor(prev.y + prev.h / 2)
    };
    let currCenter = {
      x: floor(curr.x + curr.w / 2),
      y: floor(curr.y + curr.h / 2)
    };

    if (random() < 0.5) {
      // Horizontal then vertical
      carveHLine(grid, prevCenter.x, currCenter.x, prevCenter.y);
      carveVLine(grid, prevCenter.y, currCenter.y, currCenter.x);
    } else {
      // Vertical then horizontal
      carveVLine(grid, prevCenter.y, currCenter.y, prevCenter.x);
      carveHLine(grid, prevCenter.x, currCenter.x, currCenter.y);
    }
  }
  // Step 4: Place 3 treasures (T) and 3 totems (O)
  let floorSpots = [];

  // Collect all available floor positions
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      if (grid[i][j] === '+' && isValidPlacement(grid, i, j)) {
        floorSpots.push([i, j]);
      }
    }
  }

  // Shuffle and pick unique locations
  shuffle(floorSpots, true);

  // Place treasures
  for (let t = 0; t < 3 && t < floorSpots.length; t++) {
    let [i, j] = floorSpots[t];
    grid[i][j] = 'T';
  }

  // Place totems
  for (let o = 3; o < 6 && o < floorSpots.length; o++) {
    let [i, j] = floorSpots[o];
    grid[i][j] = 'O';
  }
  return grid;
}
function isValidPlacement(grid, i, j) {
  let wallCount = 0;
  let rows = grid.length;
  let cols = grid[0].length;

  let dirs = [
    [-1, 0], // up
    [1, 0],  // down
    [0, -1], // left
    [0, 1]   // right
  ];

  for (let [di, dj] of dirs) {
    let ni = i + di;
    let nj = j + dj;
    if (ni < 0 || nj < 0 || ni >= rows || nj >= cols) continue;
    if (grid[ni][nj] === '#') wallCount++;
  }

  return wallCount <= 1; // Only allow if 0 or 1 adjacent wall
}

// Helper: Carve horizontal corridor
function carveHLine(grid, x1, x2, y) {
  for (let x = min(x1, x2); x <= max(x1, x2); x++) {
    if (grid[y][x] === '#') grid[y][x] = '+';
  }
}

// Helper: Carve vertical corridor
function carveVLine(grid, y1, y2, x) {
  for (let y = min(y1, y2); y <= max(y1, y2); y++) {
    if (grid[y][x] === '#') grid[y][x] = '+';
  }
}

function drawDungeon(grid) {
  background(0); // dark

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      let ch = grid[i][j];

      if (ch === '#') {
        // Wall tile: brown tile, maybe (2, 27)
        //placeTile(i, j, 29, 0);
        placeTile(i, j, floor(random(0, 4)), 15);
      } else if (ch === '+') {
        // Floor tile: stone, maybe (4, 27)
        placeTile(i, j, floor(random(0, 4)), 16);
        
        drawDungeonEdge(i,j,grid);
      }else if (ch === 'T') {
        placeTile(i, j, 4, 28); // Treasure
      }
      else if (ch === 'O') {
        placeTile(i, j, 29, 1); // Totem
        placeTile(i-1, j, 29, 0); // Totem
      }
    }
  }
}
function drawDungeonEdge(i,j,grid){
  if(i- 1 > 0 && grid[i - 1][j] === '#') {
    placeTile(i, j, 10, 15);
  }
  //bottom
  //right
  if(j + 1 < numRows && grid[i ][j + 1] === '#') {
    placeTile(i, j , 11, 16);
  }
}  
  
  