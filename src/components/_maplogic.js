function newBoard (size) {
  var subArr = [];
  var arr = [];
  
  for (var i=0; i<size; i++) {
    subArr[i] = 0;
  }
  for (var j=0; j<size; j++) {
    arr[j] = subArr.slice(0);
  }
  
  return arr;
}

function cloneBd (bd) {
  var clonedBd = [];
  
  bd.forEach(function(col, i){
    clonedBd[i] = col.slice(0);
  });
  
  return clonedBd;
}

export default class Board {
  constructor(size) {
    this.layout = newBoard(size);
    this.nextLayout = this.layout;
    this.gen = 0;
    this.size = size;
    this.playArea = [];
  }
  
  init() {
    this.layout = newBoard(this.size);
    this.gen = 0;
    this.randomize();
    for (var i = 0; i < 7; i++) { this.update(); }
    for (var j = 0; j < this.size; j++) {
      this.layout[0][j] = 1;
      this.layout[j][0] = 1;
      this.layout[this.size-1][j] = 1;
      this.layout[j][this.size-1] = 1;
    }

    //Quality check
    var startNode = this.getFirstAvailCell();
    this.checkPlayArea(startNode.r, startNode.c);
    //console.log(this.playArea.length);
    //console.log(this.playArea.length/this.size/this.size);
    if (this.playArea.length/this.size/this.size < 0.25) {
      this.init();
    } else {
      this.fillVoidCells();
    }
  }

  getLayout(currCoor) {
    let halfFieldSizeX = 30;
    let halfFieldSizeY = 20;
    var zoomedLayout = [];
    var topBound   = currCoor.r - halfFieldSizeY,
        botBound   = currCoor.r + halfFieldSizeY,
        leftBound  = currCoor.c - halfFieldSizeX,
        rightBound = currCoor.c + halfFieldSizeX;

    console.log(topBound, botBound, leftBound, rightBound);

    if (topBound < 0) {
      topBound = 0;
      botBound = halfFieldSizeY * 2;
    } else if (botBound > this.size) {
      topBound = this.size - (halfFieldSizeY * 2);
      botBound = this.size;
    } 

    if (leftBound < 0) {
      leftBound  = 0;
      rightBound = halfFieldSizeX * 2;
    } else if (rightBound > this.size) {
      leftBound  = this.size - (halfFieldSizeX * 2);
      rightBound = this.size;
    } 

    for (var i = topBound; i < botBound; i++) {
      var zoomedRow = [];
      for (var j = leftBound; j < rightBound; j++) {
        zoomedRow.push(this.getStat(i,j));
      }
      zoomedLayout.push(zoomedRow);
    }

    return zoomedLayout;
  }
  
  getStat(r, c) {
    return this.layout[r][c];
  }

  setCell(r, c, val) {
    this.layout[r][c] = val;
  }
  
  activeCellCount() {
    var activeCells = 0;
    
    this.layout.forEach(function(row){
      row.forEach(function(cell){
        if(cell > 0) {
          activeCells++;
        }
      });
    });
    
    return activeCells;
  }
  
  randomize() {
    for (var i=0; i<this.size; i++) {
      for (var j=0; j<this.size; j++) {
        if(Math.random() < 0.28) {
          this.setCell(i,j,1);
        }
      }
    }
  }

  checkPlayArea(r, c) {
    //If target-color is equal to replacement-color, return.
    //If the color of node is not equal to target-color, return.
    if (this.layout[r][c] !== 0){
      return;
    }

    //Set the color of node to replacement-color.
    this.layout[r][c] = 2;
    this.playArea.push({r, c});

    //Perform Flood-fill (south)
    if (r !== this.size-1) {
      this.checkPlayArea(r+1, c);
    }
    //Perform Flood-fill (north)
    if (r !== 0) {
      this.checkPlayArea(r-1, c);
    }
    //Perform Flood-fill (west)
    if (c !== 0) {
      this.checkPlayArea(r, c-1);
    }
    //Perform Flood-fill (east)
    if (c !== this.size-1) {
      this.checkPlayArea(r, c+1);
    }
  }

  getFirstAvailCell() {
    for (var i = Math.ceil(this.size/10); i < this.size; i++) {
      for (var j = Math.ceil(this.size/10); j < this.size; j++) {
        if(this.layout[i][j] === 0) {
          return {r: i, c: j};
        }
      }
    }
  }

  fillVoidCells() {
    for(var i=1; i<this.size-1; i++) {
      for(var j=1; j<this.size-1; j++) {
        this.layout[i][j] = 1;
      }
    }

    this.playArea.forEach((cell) => {
      this.layout[cell.r][cell.c] = 0;
    });
  }
  
  chkNeigh(currRow, currCol) {
    var neighCells = [];
    var prevRow, prevCol, nextRow, nextCol;
    var activeCells = 0;
    
    //loopback board
    if(currRow === 0){
      prevRow = this.size - 1;
    } else {
      prevRow = currRow - 1;
    }
    
    if(currRow === (this.size - 1)){
      nextRow = 0;
    } else {
      nextRow = currRow + 1;
    }
    
    if(currCol === 0){
      prevCol = this.size - 1;
    } else {
      prevCol = currCol - 1;
    }
    
    if(currCol === (this.size - 1)){
      nextCol = 0;
    } else {
      nextCol = currCol + 1;
    }
    
    //console.log(prevRow, nextRow, prevCol, nextCol);
    
    //scanning surrounding cells
    neighCells.push(this.getStat(prevRow, prevCol)); //topleft
    neighCells.push(this.getStat(prevRow, currCol)); //top
    neighCells.push(this.getStat(prevRow, nextCol)); //topright
    neighCells.push(this.getStat(currRow, prevCol)); //left
    neighCells.push(this.getStat(currRow, nextCol)); //right
    neighCells.push(this.getStat(nextRow, prevCol)); //botleft
    neighCells.push(this.getStat(nextRow, currCol)); //bot
    neighCells.push(this.getStat(nextRow, nextCol)); //botright
    //console.log(neighCells);
    
    neighCells.forEach(function(cell){
      if(cell){
        activeCells++;
      }
    });
    
    return activeCells;
  }
  
  updateCell(r, c) {
    var cellCount = this.chkNeigh(r, c);
    
    if (cellCount < 2) {
      //console.log('lonely');
      this.nextLayout[r][c] = 0;
    } else if (cellCount >= 4 ) {
      //console.log('crowded');
      this.nextLayout[r][c] = 1;
    }
  }
  
  update() {
    //create shadow layout
    this.nextLayout = cloneBd(this.layout);
    
    for(var i=0; i<this.size; i++) {
      for(var j=0; j<this.size; j++) {
        this.updateCell(i,j);
      }
    }
    
    this.layout = cloneBd(this.nextLayout);
    this.gen++;
  }

  movePlayer(currCoor, targetCoor) {
    //check targetCoor status
    var targetCellType = this.getStat(targetCoor.r, targetCoor.c);

    if (targetCellType === 0) {
      this.setCell(currCoor.r, currCoor.c, 0);
      this.setCell(targetCoor.r, targetCoor.c, 5);
      return true;
    } else {
      return false;
    }
  }
  
}