import _ from 'lodash';

/**
 * Symmetric directed graph
 */
class Graph {
  constructor() {
    this.edges = {};
  }

  addEdge(u, v) {
    this.edges[u] = this.edges[u] || new Set();
    this.edges[v] = this.edges[v] || new Set();
    this.edges[u].add(v);
    this.edges[v].add(u);
  }

  findShortestPath(source, target) {
    if (source === target || !this.edges[source] || !this.edges[target]) {
      return [];
    }

    const prev = this.dijkstra(source)[1];
    let u = prev[target];

    if (!u) {
      return [];
    }

    let v = target;
    const path = [[u, v]];

    while (u !== source) {
      v = u;
      u = prev[u];
      path.unshift([u, v]);
    }

    return path;
  }

  dijkstra(source) {
    const nodes = new Set();
    const dist = {};
    const prev = {};

    for (let node of Object.keys(this.edges)) {
      dist[node] = Infinity;
      nodes.add(node);
    }

    dist[source] = 0;

    while (nodes.size > 0) {
      const u = _.minBy(Array.from(nodes), (node) => dist[node]);
      nodes.delete(u);

      for (let v of this.edges[u]) {
        const alt = dist[u] + 1;

        if (alt < dist[v]) {
          dist[v] = alt;
          prev[v] = u;
        }
      }
    }

    return [dist, prev];
  }
}

export default Graph;
