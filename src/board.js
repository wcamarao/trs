class Board {

  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.blockedCells = {};
  }

  block(x, y) {
    this.blockedCells[`${x},${y}`] = true;
  }

  isBlocked(x, y) {
    return this.blockedCells[`${x},${y}`] || false;
  }
}

export default Board;
