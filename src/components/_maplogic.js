import {
  boardConst as params,
  spriteConst as sprites,
} from '../constants';

const cellType = sprites.cell;

export default class Board {
  constructor() {
    this.layout = [];
    this.nextLayout = [];
    this.gen = 0;
    this.size = params.boardSize;
    this.playArea = [];
  }

  newBoard() {
    this.layout = [];

    while (this.layout.length < this.size) {
      this.layout.push(this.newRandomCol());
    }
  }

  init() {
    this.newBoard();
    this.randomizeBoard();
    this.setWall();

    // Quality check
    const startCell = this.getFirstAvailCell();
    this.checkPlayableArea(startCell.r, startCell.c);

    const playableAreaRatio =
      this.playArea.length / (this.size * this.size);

    if (playableAreaRatio < params.playableAreaRatio) {
      this.init();
    } else {
      this.fillInvalidCells();
    }
  }


  /**
   * private methods
   */

  newRandomCol() {
    const colArr = [];

    while (colArr.length < this.size) {
      colArr.push(Math.random() < params.randomizerThreshold ?
        cellType.wall : cellType.free);
    }

    return colArr;
  }


  randomizeBoard() {
    for (let c = 0; c < params.randomizeCount; c += 1) {
      this.nextLayout = Board.cloneBoard(this.layout);

      for (let i = 0; i < this.size; i += 1) {
        for (let j = 0; j < this.size; j += 1) {
          this.updateCell(i, j);
        }
      }

      this.layout = Board.cloneBoard(this.nextLayout);
      this.gen += 1;
    }
  }


  setWall() {
    const maxIndex = this.size - 1;

    // Vertical wall
    this.layout[0].fill(1);
    this.layout[maxIndex].fill(1);

    // Horizontal wall
    for (let j = 0; j < this.size; j += 1) {
      this.setCell(j, 0, 1);
      this.setCell(j, maxIndex, 1);
    }
  }


  getNeighCellCount(currRow, currCol) {
    const maxIndex = this.size - 1;
    const prevRow = currRow === 0 ? maxIndex : currRow - 1;
    const prevCol = currCol === 0 ? maxIndex : currCol - 1;
    const nextRow = currRow === maxIndex ? 0 : currRow + 1;
    const nextCol = currCol === maxIndex ? 0 : currCol + 1;

    const neighCell = [
      this.getCell(prevRow, prevCol),
      this.getCell(prevRow, currCol),
      this.getCell(prevRow, nextCol),
      this.getCell(currRow, prevCol),
      this.getCell(currRow, nextCol),
      this.getCell(nextRow, prevCol),
      this.getCell(nextRow, currCol),
      this.getCell(nextRow, nextCol),
    ];

    return neighCell.filter(cell =>
      cell === cellType.wall).length;
  }


  getFirstAvailCell() {
    for (let i = Math.ceil(this.size / 10); i < this.size; i += 1) {
      for (let j = Math.ceil(this.size / 10); j < this.size; j += 1) {
        if (this.getCell(i, j) === cellType.free) {
          return { r: i, c: j };
        }
      }
    }

    throw new Error('No available cells');
  }


  checkPlayableArea(currRow, currCol) {
    // If target-color is equal to replacement-color, return.
    // If the color of node is not equal to target-color, return.
    if (this.getCell(currRow, currCol) !== cellType.free) {
      return;
    }

    const minIndex = 0;
    const maxIndex = this.size - 1;
    const prevRow  = currRow - 1;
    const nextRow  = currRow + 1;
    const prevCol  = currCol - 1;
    const nextCol  = currCol + 1;

    // Set the color of node to replacement-color.
    this.layout[currRow][currCol] = 2;
    this.playArea.push({
      row: currRow,
      col: currCol,
    });

    // Perform Flood-fill (south)
    if (currRow !== maxIndex) {
      this.checkPlayableArea(nextRow, currCol);
    }
    // Perform Flood-fill (north)
    if (currRow !== minIndex) {
      this.checkPlayableArea(prevRow, currCol);
    }
    // Perform Flood-fill (west)
    if (currCol !== minIndex) {
      this.checkPlayableArea(currRow, prevCol);
    }
    // Perform Flood-fill (east)
    if (currCol !== maxIndex) {
      this.checkPlayableArea(currRow, nextCol);
    }
  }


  fillInvalidCells() {
    const colArr = new Array(this.size).fill(cellType.wall);
    this.layout = colArr.map(() => [...colArr]);

    this.playArea.forEach((cell) => {
      this.setCell(cell.row, cell.col, cellType.free);
    });
  }

  movePlayer(currCoor, targetCoor) {
    this.setCell(currCoor.row, currCoor.col, cellType.free);
    this.setCell(targetCoor.row, targetCoor.col, cellType.player);
  }


  /**
   * Helper methods
   */

  getCell(r, c) {
    return this.layout[r][c];
  }

  setCell(r, c, val) {
    this.layout[r][c] = val;
  }

  static cloneBoard(board) {
    return board.map(col => col.slice(0));
  }

  /**
   *
   *
   *
   */

  getLayout(currCoor, isDarknessOn) {
    const { fieldSizeX, fieldSizeY } = params;
    const halfFieldSizeX = fieldSizeX / 2;
    const halfFieldSizeY = fieldSizeY / 2;
    const { row: r, col: c } = currCoor;
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
            zoomedRow.push(this.getCell(i, j));
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
          zoomedRow.push(this.getCell(i, j));
        }
        zoomedLayout.push(zoomedRow);
      }
    }

    return zoomedLayout;
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

  updateCell(r, c) {
    const cellCount = this.getNeighCellCount(r, c);

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
    this.nextLayout = Board.cloneBoard(this.layout);

    for (let i = 0; i < this.size; i += 1) {
      for (let j = 0; j < this.size; j += 1) {
        this.updateCell(i, j);
      }
    }

    this.layout = Board.cloneBoard(this.nextLayout);
    this.gen += 1;
  }
}
