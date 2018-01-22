import Graph from './graph';

class Board {

  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.blockedCells = {};
  }

  buildGraph() {
    const graph = new Graph();

    for (let x=0; x<this.width - 1; x++) {
      for (let y=0; y<this.height - 1; y++) {
        if (this.isBlocked(x, y)) {
          continue;
        }

        const xPlus = x + 1;
        const yPlus = y + 1;

        if (xPlus < this.width && !this.isBlocked(xPlus, y)) {
          const u = `${x},${y}`;
          const v = `${xPlus},${y}`;
          graph.addEdge(u, v);
        }

        if (yPlus < this.height && !this.isBlocked(x, yPlus)) {
          const u = `${x},${y}`;
          const v = `${x},${yPlus}`;
          graph.addEdge(u, v);
        }
      }
    }

    return graph;
  }

  block(x, y) {
    this.blockedCells[`${x},${y}`] = true;
  }

  isBlocked(x, y) {
    return this.blockedCells[`${x},${y}`] || false;
  }
}

export default Board;
