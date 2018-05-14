import {
  boardConst as params,
  spriteConst as sprites,
} from '../constants';

const cellType = sprites.cell;

export default class Board {
  constructor() {
    this.layout = [];
    this.nextLayout = [];
    this.size = params.boardSize;
    this.playArea = [];
  }

  initBoard() {
    this.newBoard();
    this.scrambleBoard();
    this.setEdgeWall();

    // Quality check
    const startCell = this.getFirstAvailCell();
    this.getPlayableArea(startCell.r, startCell.c);

    const playableAreaRatio =
      this.playArea.length / (this.size * this.size);

    if (playableAreaRatio < params.playableAreaRatio) {
      this.initBoard();
    } else {
      this.fillInvalidCells();
    }
  }


  printMap(currCoor, isDarknessOn) {
    const { displaySizeX, displaySizeY } = params;
    const { row: currRow, col: currCol } = currCoor;
    const bounds = this.getViewBoundaries(currCoor);
    const zoomedBoard = [];

    if (isDarknessOn) {
      const zoomedCol = new Array(displaySizeX).fill(cellType.hidden);
      const cornerCells = [
        // top left corner
        { row: currRow - 6, col: currCol - 6 },
        { row: currRow - 6, col: currCol - 5 },
        { row: currRow - 6, col: currCol - 4 },
        { row: currRow - 5, col: currCol - 6 },
        { row: currRow - 5, col: currCol - 5 },
        { row: currRow - 4, col: currCol - 6 },

        // bottom left corner
        { row: currRow + 6, col: currCol - 6 },
        { row: currRow + 6, col: currCol - 5 },
        { row: currRow + 6, col: currCol - 4 },
        { row: currRow + 5, col: currCol - 6 },
        { row: currRow + 5, col: currCol - 5 },
        { row: currRow + 4, col: currCol - 6 },

        // top right corner
        { row: currRow - 6, col: currCol + 6 },
        { row: currRow - 6, col: currCol + 5 },
        { row: currRow - 6, col: currCol + 4 },
        { row: currRow - 5, col: currCol + 6 },
        { row: currRow - 5, col: currCol + 5 },
        { row: currRow - 4, col: currCol + 6 },

        // bottom right corner
        { row: currRow + 6, col: currCol + 6 },
        { row: currRow + 6, col: currCol + 5 },
        { row: currRow + 6, col: currCol + 4 },
        { row: currRow + 5, col: currCol + 6 },
        { row: currRow + 5, col: currCol + 5 },
        { row: currRow + 4, col: currCol + 6 },
      ];

      for (let i = 0; i < displaySizeY; i += 1) {
        zoomedBoard.push([...zoomedCol]);
      }

      const maxIndex = this.size - 1;
      const topBound = currRow - 6;
      const botBound = currRow + 6;
      const lftBound = currCol - 6;
      const rgtBound = currCol + 6;
      /* eslint-disable no-multi-spaces */
      const scanInitRow = topBound < 0          ? 0        : topBound;
      const scanInitCol = lftBound < 0          ? 0        : lftBound;
      const scanLastRow = botBound >= this.size ? maxIndex : botBound;
      const scanLastCol = rgtBound >= this.size ? maxIndex : rgtBound;
      /* eslint-enable no-multi-spaces */

      for (let i = scanInitRow; i <= scanLastRow; i += 1) {
        for (let j = scanInitCol; j <= scanLastCol; j += 1) {
          const targetCoor = { row: i, col: j };

          if (!Board.existsInCoorArray(targetCoor, cornerCells)) {
            const relativeXCoor = targetCoor.row - bounds.top;
            const relativeYCoor = targetCoor.col - bounds.left;
            zoomedBoard[relativeXCoor][relativeYCoor] =
              this.getCell(targetCoor.row, targetCoor.col);
          }
        }
      }

      return zoomedBoard;
    }


    // Get visible cells
    for (let i = bounds.top; i < bounds.bot; i += 1) {
      const zoomedCol = [];

      for (let j = bounds.left; j < bounds.right; j += 1) {
        zoomedCol.push(this.getCell(i, j));
      }
      zoomedBoard.push(zoomedCol);
    }

    return zoomedBoard;
  }


  /**
   * private methods
   */

  newBoard() {
    this.layout = [];
    this.playArea = [];

    while (this.layout.length < this.size) {
      this.layout.push(this.newRandomCol());
    }
  }


  newRandomCol() {
    const colArr = [];

    while (colArr.length < this.size) {
      colArr.push(Math.random() < params.cellWallToFreeRatio ?
        cellType.wall : cellType.empty);
    }

    return colArr;
  }


  scrambleBoard() {
    for (let c = 0; c < params.scrambleRounds; c += 1) {
      this.nextLayout = Board.cloneBoard(this.layout);

      for (let i = 0; i < this.size; i += 1) {
        for (let j = 0; j < this.size; j += 1) {
          this.updateCell(i, j);
        }
      }

      this.layout = Board.cloneBoard(this.nextLayout);
    }
  }


  updateCell(row, col) {
    const cellCount = this.getNeighCellCount(row, col);

    if (cellCount < 2) {
      // lonely cell
      this.nextLayout[row][col] = cellType.empty;
    } else if (cellCount >= 4) {
      // crowded cell
      this.nextLayout[row][col] = cellType.wall;
    }
  }


  setEdgeWall() {
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
      this.getCell(prevRow, prevCol), // top left
      this.getCell(prevRow, currCol), // top
      this.getCell(prevRow, nextCol), // top right
      this.getCell(currRow, prevCol), // left
      this.getCell(currRow, nextCol), // right
      this.getCell(nextRow, prevCol), // bottom left
      this.getCell(nextRow, currCol), // bottom
      this.getCell(nextRow, nextCol), // bottom right
    ];

    return neighCell
      .filter(cell => cell === cellType.wall)
      .length;
  }


  getFirstAvailCell() {
    for (let i = Math.ceil(this.size / 10); i < this.size; i += 1) {
      for (let j = Math.ceil(this.size / 10); j < this.size; j += 1) {
        if (this.getCell(i, j) === cellType.empty) {
          return { r: i, c: j };
        }
      }
    }

    throw new Error('No available cells');
  }


  getPlayableArea(currRow, currCol) {
    // If target-color is equal to replacement-color, return.
    // If the color of node is not equal to target-color, return.
    if (this.getCell(currRow, currCol) !== cellType.empty) {
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
      this.getPlayableArea(nextRow, currCol);
    }
    // Perform Flood-fill (north)
    if (currRow !== minIndex) {
      this.getPlayableArea(prevRow, currCol);
    }
    // Perform Flood-fill (west)
    if (currCol !== minIndex) {
      this.getPlayableArea(currRow, prevCol);
    }
    // Perform Flood-fill (east)
    if (currCol !== maxIndex) {
      this.getPlayableArea(currRow, nextCol);
    }
  }


  fillInvalidCells() {
    const colArr = new Array(this.size).fill(cellType.wall);
    this.layout = colArr.map(() => [...colArr]);

    this.playArea.forEach((cell) => {
      this.setCell(cell.row, cell.col, cellType.empty);
    });
  }


  movePlayer(currCoor, targetCoor) {
    this.setCell(currCoor.row, currCoor.col, cellType.empty);
    this.setCell(targetCoor.row, targetCoor.col, cellType.player);
  }


  getViewBoundaries(currCoor) {
    const { displaySizeX, displaySizeY } = params;
    const halfDisplaySizeX = displaySizeX / 2;
    const halfDisplaySizeY = displaySizeY / 2;
    const { row: currRow, col: currCol } = currCoor;

    let topBound   = currRow - halfDisplaySizeY;
    let botBound   = currRow + halfDisplaySizeY;
    let leftBound  = currCol - halfDisplaySizeX;
    let rightBound = currCol + halfDisplaySizeX;


    if (topBound < 0) {
      topBound = 0;
      botBound = displaySizeY;
    } else if (botBound > this.size) {
      topBound = this.size - displaySizeY;
      botBound = this.size;
    }

    if (leftBound < 0) {
      leftBound = 0;
      rightBound = displaySizeX;
    } else if (rightBound > this.size) {
      leftBound = this.size - displaySizeX;
      rightBound = this.size;
    }


    return {
      top  : topBound,
      bot  : botBound,
      left : leftBound,
      right: rightBound,
    };
  }


  /**
   * Helper methods
   */

  getCell(row, col) {
    if (
      row < 0 ||
      col < 0 ||
      row >= this.size ||
      col >= this.size
    ) {
      throw new Error('Row/Col out of bounds!');
    }

    return this.layout[row][col];
  }


  setCell(row, col, val) {
    this.layout[row][col] = val;
  }


  static cloneBoard(board) {
    return board.map(col => col.slice(0));
  }


  static existsInCoorArray(needle, haystack) {
    const { row: targetRow, col: targetCol } = needle;

    return haystack
      .filter(coor =>
        coor.row === targetRow && coor.col === targetCol)
      .length === 1;
  }
}
