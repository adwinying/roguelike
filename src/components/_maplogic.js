function newBoard(size) {
  const subArr = [];
  const arr = [];

  for (let i = 0; i < size; i += 1) {
    subArr[i] = 0;
  }
  for (let j = 0; j < size; j += 1) {
    arr[j] = subArr.slice(0);
  }

  return arr;
}

function cloneBd(bd) {
  return bd.map(col => col.slice(0));
}

export default class Board {
  constructor(size) {
    this.layout = newBoard(size);
    this.nextLayout = cloneBd(this.layout);
    this.gen = 0;
    this.size = size;
    this.playArea = [];
  }

  init() {
    this.layout = newBoard(this.size);
    this.nextLayout = cloneBd(this.layout);
    this.gen = 0;
    this.randomize();
    this.playArea = [];
    for (let i = 0; i < 7; i += 1) { this.update(); }
    for (let j = 0; j < this.size; j += 1) {
      this.layout[0][j] = 1;
      this.layout[j][0] = 1;
      this.layout[this.size - 1][j] = 1;
      this.layout[j][this.size - 1] = 1;
    }

    // Quality check
    const startNode = this.getFirstAvailCell();
    this.checkPlayArea(startNode.r, startNode.c);
    // console.log(this.playArea.length);
    // console.log(this.playArea.length/this.size/this.size);
    if (this.playArea.length / this.size / this.size < 0.25) {
      this.init();
    } else {
      this.fillVoidCells();
    }
  }

  getLayout(currCoor, isDarknessOn) {
    const halfFieldSizeX = 30;
    const halfFieldSizeY = 20;
    const { r, c } = currCoor;
    const zoomedLayout = [];
    const visibleCell = [];
    let zoomedRow = [];
    let topBound   = r - halfFieldSizeY;
    let botBound   = r + halfFieldSizeY;
    let leftBound  = c - halfFieldSizeX;
    let rightBound = c + halfFieldSizeX;

    function isCorner(i, j) {
      if ((i === r-6 || i === r+6) && (j < c-3 || j > c+3)) {
        return true;
      } else if ((i === r-5 || i === r+5) && (j < c-4 || j > c+4)) {
        return true;
      } else if ((i === r-4 || i === r+4) && (j < c-5 || j > c+5)) {
        return true;
      }

      return false;
    }

    function visibleCellIndex(i, j) {
      for (let k = 0; k < visibleCell.length; k += 1) {
        if (visibleCell[k].r === i && visibleCell[k].c === j) {
          return k;
        }
      }

      return -1;
    }

    for (let i = r-6; i <= r+6; i += 1) {
      for (let j = c-6; j <= c+6; j += 1) {
        if (!isCorner(i, j)) {
          visibleCell.push({ r: i, c: j });
        }
      }
    }

    // console.log(topBound, botBound, leftBound, rightBound);

    if (topBound < 0) {
      topBound = 0;
      botBound = halfFieldSizeY * 2;
    } else if (botBound > this.size) {
      topBound = this.size - (halfFieldSizeY * 2);
      botBound = this.size;
    }

    if (leftBound < 0) {
      leftBound = 0;
      rightBound = halfFieldSizeX * 2;
    } else if (rightBound > this.size) {
      leftBound = this.size - (halfFieldSizeX * 2);
      rightBound = this.size;
    }

    if (isDarknessOn) {
      for (let i = topBound; i < botBound; i += 1) {
        zoomedRow = [];
        for (let j = leftBound; j < rightBound; j += 1) {
          if (visibleCellIndex(i, j) !== -1) {
            zoomedRow.push(this.getStat(i, j));
          } else {
            zoomedRow.push(8);
          }
        }
        zoomedLayout.push(zoomedRow);
      }
    } else {
      for (let i = topBound; i < botBound; i += 1) {
        zoomedRow = [];
        for (let j = leftBound; j < rightBound; j += 1) {
          zoomedRow.push(this.getStat(i, j));
        }
        zoomedLayout.push(zoomedRow);
      }
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
    let activeCells = 0;

    this.layout.forEach((row) => {
      row.forEach((cell) => {
        if (cell > 0) {
          activeCells += 1;
        }
      });
    });

    return activeCells;
  }

  randomize() {
    for (let i = 0; i < this.size; i += 1) {
      for (let j = 0; j < this.size; j += 1) {
        if (Math.random() < 0.28) {
          this.setCell(i, j, 1);
        }
      }
    }
  }

  checkPlayArea(r, c) {
    // If target-color is equal to replacement-color, return.
    // If the color of node is not equal to target-color, return.
    if (this.layout[r][c] !== 0) {
      return;
    }

    // Set the color of node to replacement-color.
    this.layout[r][c] = 2;
    this.playArea.push({ r, c });

    // Perform Flood-fill (south)
    if (r !== this.size - 1) {
      this.checkPlayArea(r+1, c);
    }
    // Perform Flood-fill (north)
    if (r !== 0) {
      this.checkPlayArea(r-1, c);
    }
    // Perform Flood-fill (west)
    if (c !== 0) {
      this.checkPlayArea(r, c-1);
    }
    // Perform Flood-fill (east)
    if (c !== this.size-1) {
      this.checkPlayArea(r, c+1);
    }
  }

  getFirstAvailCell() {
    for (let i = Math.ceil(this.size / 10); i < this.size; i += 1) {
      for (let j = Math.ceil(this.size / 10); j < this.size; j += 1) {
        if (this.layout[i][j] === 0) {
          return { r: i, c: j };
        }
      }
    }
  }

  fillVoidCells() {
    for (let i = 1; i < this.size - 1; i += 1) {
      for (let j = 1; j < this.size - 1; j += 1) {
        this.layout[i][j] = 1;
      }
    }

    this.playArea.forEach((cell) => {
      this.layout[cell.r][cell.c] = 0;
    });
  }

  chkNeigh(currRow, currCol) {
    const neighCells = [];
    let prevRow;
    let prevCol;
    let nextRow;
    let nextCol;
    let activeCells = 0;

    // loopback board
    if (currRow === 0) {
      prevRow = this.size - 1;
    } else {
      prevRow = currRow - 1;
    }

    if (currRow === (this.size - 1)) {
      nextRow = 0;
    } else {
      nextRow = currRow + 1;
    }

    if (currCol === 0) {
      prevCol = this.size - 1;
    } else {
      prevCol = currCol - 1;
    }

    if (currCol === (this.size - 1)) {
      nextCol = 0;
    } else {
      nextCol = currCol + 1;
    }

    // console.log(prevRow, nextRow, prevCol, nextCol);

    // scanning surrounding cells
    neighCells.push(this.getStat(prevRow, prevCol)); // topleft
    neighCells.push(this.getStat(prevRow, currCol)); // top
    neighCells.push(this.getStat(prevRow, nextCol)); // topright
    neighCells.push(this.getStat(currRow, prevCol)); // left
    neighCells.push(this.getStat(currRow, nextCol)); // right
    neighCells.push(this.getStat(nextRow, prevCol)); // botleft
    neighCells.push(this.getStat(nextRow, currCol)); // bot
    neighCells.push(this.getStat(nextRow, nextCol)); // botright
    // console.log(neighCells);

    neighCells.forEach((cell) => {
      if (cell) {
        activeCells += 1;
      }
    });

    return activeCells;
  }

  updateCell(r, c) {
    const cellCount = this.chkNeigh(r, c);

    if (cellCount < 2) {
      // console.log('lonely');
      this.nextLayout[r][c] = 0;
    } else if (cellCount >= 4) {
      // console.log('crowded');
      this.nextLayout[r][c] = 1;
    }
  }

  update() {
    // create shadow layout
    this.nextLayout = cloneBd(this.layout);

    for (let i = 0; i < this.size; i += 1) {
      for (let j = 0; j < this.size; j += 1) {
        this.updateCell(i, j);
      }
    }

    this.layout = cloneBd(this.nextLayout);
    this.gen += 1;
  }

  movePlayer(currCoor, targetCoor) {
    this.setCell(currCoor.r, currCoor.c, 0);
    this.setCell(targetCoor.r, targetCoor.c, 5);
  }
}
