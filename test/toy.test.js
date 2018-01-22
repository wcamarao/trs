import { expect } from 'chai';
import sinon from 'sinon';
import Board from '../src/board';
import Toy from '../src/toy';
import Direction from '../src/direction';

describe('Toy', function () {
  let board;
  let toy;

  beforeEach(function () {
    board = new Board(5, 5);
    toy = new Toy(board);
    sinon.stub(toy.logger);
  });

  describe('#constructor', function () {
    it('stores width and height', function () {
      expect(toy.board).to.eql(board);
    });

    it('creates a logger', function () {
      expect(toy.logger).to.respondTo('info');
      expect(toy.logger).to.respondTo('error');
    });
  });

  describe('#place', function () {
    it('ignores placement when x is invalid', function () {
      toy.place(-1, 0, Direction.NORTH);
      expect(toy.x).to.be.undefined;
      toy.place(5, 0, Direction.NORTH);
      expect(toy.x).to.be.undefined;
    });

    it('ignores placement when y is invalid', function () {
      toy.place(0, -1, Direction.NORTH);
      expect(toy.y).to.be.undefined;
      toy.place(0, 5, Direction.NORTH);
      expect(toy.y).to.be.undefined;
    });

    it('ignores placement when direction is invalid', function () {
      toy.place(0, 4, 'NORTH');
      expect(toy.direction).to.be.undefined;
      toy.place(0, 4, null);
      expect(toy.direction).to.be.undefined;
    });

    it('stores coords and direction', function () {
      toy.place(0, 4, Direction.NORTH);
      expect(toy.x).to.eql(0);
      expect(toy.y).to.eql(4);
      expect(toy.direction).to.eql(Direction.NORTH);
    });
  });

  describe('#move', function () {
    it('ignores movement before placement', function () {
      toy.move();
      expect(toy.x).to.be.undefined;
      expect(toy.y).to.be.undefined;
      expect(toy.direction).to.be.undefined;
    });

    it('ignores movement when crossing north boundary', function () {
      toy.place(4, 4, Direction.NORTH);
      toy.move();
      expect(toy.y).to.eql(4);
    });

    it('ignores movement when crossing east boundary', function () {
      toy.place(4, 4, Direction.EAST);
      toy.move();
      expect(toy.x).to.eql(4);
    });

    it('ignores movement when crossing south boundary', function () {
      toy.place(0, 0, Direction.SOUTH);
      toy.move();
      expect(toy.y).to.eql(0);
    });

    it('ignores movement when crossing west boundary', function () {
      toy.place(0, 0, Direction.WEST);
      toy.move();
      expect(toy.x).to.eql(0);
    });

    it('ignores movement when stepping onto a blocked cell', function () {
      board.block(0, 1);
      toy.place(0, 0, Direction.NORTH);
      toy.move();
      expect(toy.y).to.eql(0);
    });

    it('increments y when facing north', function () {
      toy.place(0, 0, Direction.NORTH);
      toy.move();
      expect(toy.y).to.eql(1);
    });

    it('increments x when facing east', function () {
      toy.place(0, 0, Direction.EAST);
      toy.move();
      expect(toy.x).to.eql(1);
    });

    it('decrements y when facing south', function () {
      toy.place(4, 4, Direction.SOUTH);
      toy.move();
      expect(toy.y).to.eql(3);
    });

    it('decrements x when facing west', function () {
      toy.place(4, 4, Direction.WEST);
      toy.move();
      expect(toy.x).to.eql(3);
    });
  });

  describe('#turn{Left,Right}', function () {
    it('ignores left before placement', function () {
      toy.turnLeft();
      expect(toy.x).to.be.undefined;
      expect(toy.y).to.be.undefined;
      expect(toy.direction).to.be.undefined;
    });

    it('ignores right before placement', function () {
      toy.turnLeft();
      expect(toy.x).to.be.undefined;
      expect(toy.y).to.be.undefined;
      expect(toy.direction).to.be.undefined;
    });

    describe('when facing north', function () {
      beforeEach(function () {
        toy.place(0, 0, Direction.NORTH);
      });

      it('left is to the west', function () {
        toy.turnLeft();
        expect(toy.direction).to.eql(Direction.WEST);
      });

      it('right is to the east', function () {
        toy.turnRight();
        expect(toy.direction).to.eql(Direction.EAST);
      });
    });

    describe('when facing east', function () {
      beforeEach(function () {
        toy.place(0, 0, Direction.EAST);
      });

      it('left is to the north', function () {
        toy.turnLeft();
        expect(toy.direction).to.eql(Direction.NORTH);
      });

      it('right is to the south', function () {
        toy.turnRight();
        expect(toy.direction).to.eql(Direction.SOUTH);
      });
    });

    describe('when facing south', function () {
      beforeEach(function () {
        toy.place(0, 0, Direction.SOUTH);
      });

      it('left is to the east', function () {
        toy.turnLeft();
        expect(toy.direction).to.eql(Direction.EAST);
      });

      it('right is to the WEST', function () {
        toy.turnRight();
        expect(toy.direction).to.eql(Direction.WEST);
      });
    });

    describe('when facing west', function () {
      beforeEach(function () {
        toy.place(0, 0, Direction.WEST);
      });

      it('left is to the south', function () {
        toy.turnLeft();
        expect(toy.direction).to.eql(Direction.SOUTH);
      });

      it('right is to the north', function () {
        toy.turnRight();
        expect(toy.direction).to.eql(Direction.NORTH);
      });
    });
  });

  describe('#report', function () {
    it('ignores report before placement', function () {
      expect(toy.report()).to.be.undefined;
    });

    it('returns x,y,direction', function () {
      toy.place(0, 0, Direction.NORTH);
      expect(toy.report()).to.eql('0,0,NORTH');
    });
  });

  describe('#findPath', function () {

    /**
     * o o o o o
     * o o o o o
     * o o o o o
     * o o B o o
     * A o o o o
     */
    describe('when there are no blocked cells on the board', function () {
      it('returns straight path', function () {
        toy.place(0, 0, Direction.NORTH);
        expect(toy.findPath(2, 1)).to.eql([
          ['0,0', '1,0'],
          ['1,0', '1,1'],
          ['1,1', '2,1'],
        ]);
      });
    });

    /**
     * o o o o o
     * o o o o o
     * o X X o o
     * o X B o o
     * A X o o o
     */
    describe('when there are blocked cells on the board', function () {
      it('returns path surrounding blocked cells', function () {
        toy.place(0, 0, Direction.NORTH);
        board.block(1, 0);
        board.block(1, 1);
        board.block(1, 2);
        board.block(2, 2);
        expect(toy.findPath(2, 1)).to.eql([
          ['0,0', '0,1'],
          ['0,1', '0,2'],
          ['0,2', '0,3'],
          ['0,3', '1,3'],
          ['1,3', '2,3'],
          ['2,3', '3,3'],
          ['3,3', '3,2'],
          ['3,2', '3,1'],
          ['3,1', '2,1'],
        ]);
      });
    });
  });
});
