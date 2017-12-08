import _ from 'lodash';
import winston from 'winston';
import Direction from './direction';

class Toy {

  /**
   * Initialize toy within given boundaries
   *
   * @param {*} width
   * @param {*} height
   */
  constructor(width, height) {
    this.width = width;
    this.height = height;

    this.logger = new winston.Logger({
      transports: [
        new winston.transports.Console({
          timestamp: () => new Date().toString(),
          colorize: true
        })
      ]
    });
  }

  /**
   * Place toy at given coords facing direction
   *
   * @param {*} x
   * @param {*} y
   * @param {*} direction
   */
  place(x, y, direction) {
    if (!this.isValidX(x)) {
      this.logger.warn(`Ignoring placecement due to invalid x: ${x}`);
      return;
    }

    if (!this.isValidY(y)) {
      this.logger.warn(`Ignoring placecement due to invalid y: ${y}`);
      return;
    }

    if (!(direction instanceof Direction)) {
      this.logger.warn(`Ignoring placecement due to invalid direction: ${direction}`);
      return;
    }

    this.x = x;
    this.y = y;
    this.direction = direction;
  }

  /**
   * Use dynamic bindings to delegate movement to proper direction
   */
  move() {
    if (!this.isPlaced()) {
      this.logger.warn('Ignoring move before placement');
      return;
    }

    // Dynamic bindings: moveNorth, moveEast, moveSouth, moveWest
    this[`move${_.capitalize(this.direction.name)}`]();
  }

  moveNorth() {
    if (!this.isValidY(this.y + 1)) {
      this.logger.warn('Ignoring move north due to current placement');
      return;
    }

    this.y++;
  }

  moveEast() {
    if (!this.isValidX(this.x + 1)) {
      this.logger.warn('Ignoring move east due to current placement');
      return;
    }

    this.x++;
  }

  moveSouth() {
    if (!this.isValidY(this.y - 1)) {
      this.logger.warn('Ignoring move south due to current placement');
      return;
    }

    this.y--;
  }

  moveWest() {
    if (!this.isValidX(this.x - 1)) {
      this.logger.warn('Ignoring move west due to current placement');
      return;
    }

    this.x--;
  }

  /**
   * Turn left based on cyclic sequence of enum ordinals
   *
   *    N=0
   * W=3   E=1
   *    S=2
   */
  turnLeft() {
    if (!this.isPlaced()) {
      this.logger.warn('Ignoring turn before placement');
      return;
    }

    const i = this.direction.ordinal - 1;
    this.direction = Direction.enumValues[i >= 0 ? i : Direction.WEST.ordinal];
  }

  /**
   * Turn right based on cyclic sequence of enum ordinals
   *
   *    N=0
   * W=3   E=1
   *    S=2
   */
  turnRight() {
    if (!this.isPlaced()) {
      this.logger.warn('Ignoring turn before placement');
      return;
    }

    const i = this.direction.ordinal + 1;
    this.direction = Direction.enumValues[i <= Direction.WEST.ordinal ? i : 0];
  }

  /**
   * Return string representation of x,y,direction
   */
  report() {
    if (!this.isPlaced()) {
      this.logger.warn('Ignoring report before placement');
      return;
    }

    return `${this.x},${this.y},${this.direction.name}`;
  }

  isPlaced() {
    return _.isInteger(this.x) && _.isInteger(this.y) && this.direction instanceof Direction;
  }

  isValidX(x) {
    return _.isInteger(x) && x >= 0 && x < this.width;
  }

  isValidY(y) {
    return _.isInteger(y) && y >= 0 && y < this.height;
  }
}

export default Toy;
