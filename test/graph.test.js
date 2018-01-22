import { expect } from 'chai';
import Graph from '../src/graph';

describe('Graph', function () {
  let graph;

  beforeEach(function () {
    graph = new Graph();
  });

  describe('#addEdge', function () {
    it('maps nodes to list of connected nodes', function () {
      graph.addEdge('foobar', 'foo');
      graph.addEdge('foobar', 'bar');
      expect(graph.edges.foobar).to.include('foo');
      expect(graph.edges.foobar).to.include('bar');
      expect(graph.edges.foo).to.include('foobar');
      expect(graph.edges.bar).to.include('foobar');
    });
  });

  describe('#findShortestPath', function () {
    beforeEach(function () {
      //  A--B--C--D
      //  |     |  |    I--J
      //  E--F--G--H
      graph.addEdge('A', 'B');
      graph.addEdge('A', 'E');
      graph.addEdge('B', 'C');
      graph.addEdge('C', 'D');
      graph.addEdge('C', 'G');
      graph.addEdge('D', 'H');
      graph.addEdge('E', 'F');
      graph.addEdge('F', 'G');
      graph.addEdge('G', 'H');
      graph.addEdge('I', 'J');
    });

    it('finds no path from A to A', function () {
      expect(graph.findShortestPath('A', 'A')).to.eql([]);
    });

    it('finds no path from H to I', function () {
      expect(graph.findShortestPath('H', 'I')).to.eql([]);
    });

    it('finds shortest path from I to J', function () {
      expect(graph.findShortestPath('I', 'J')).to.eql([
        ['I', 'J'],
      ]);
    });

    it('finds shortest path from A to C', function () {
      expect(graph.findShortestPath('A', 'C')).to.eql([
        ['A', 'B'],
        ['B', 'C'],
      ]);
    });

    it('finds shortest path from A to E', function () {
      expect(graph.findShortestPath('A', 'E')).to.eql([
        ['A', 'E'],
      ]);
    });

    it('finds shortest path from B to E', function () {
      expect(graph.findShortestPath('B', 'E')).to.eql([
        ['B', 'A'],
        ['A', 'E'],
      ]);
    });

    it('finds shortest path from B to G', function () {
      expect(graph.findShortestPath('B', 'G')).to.eql([
        ['B', 'C'],
        ['C', 'G'],
      ]);
    });

    it('finds shortest path from B to H', function () {
      expect(graph.findShortestPath('B', 'H')).to.eql([
        ['B', 'C'],
        ['C', 'D'],
        ['D', 'H'],
      ]);
    });

    it('finds shortest path from C to E', function () {
      expect(graph.findShortestPath('C', 'E')).to.eql([
        ['C', 'B'],
        ['B', 'A'],
        ['A', 'E'],
      ]);
    });
  });
});
