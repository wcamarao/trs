import _ from 'lodash';
import winston from 'winston';
import Direction from './direction';
import Toy from './toy';

class App {

  /**
   * Initialize toy with 5 by 5 boundaries
   */
  constructor() {
    this.toy = new Toy(5, 5);

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
   * Process input and return output
   * @param {*} input
   */
  process(input) {
    _.each(input.split('\n'), (line) => this.exec(line.trim()));
  }

  exec(line) {
    if (line.startsWith('PLACE ')) {
      const parts = line.split(' ');
      const params = parts[1].split(',');
      const x = _.toInteger(params[0]);
      const y = _.toInteger(params[1]);
      const direction = Direction[params[2]];

      this.toy.place(x, y, direction);
    }

    if (line === 'MOVE') {
      this.toy.move();
    }

    if (line === 'LEFT') {
      this.toy.turnLeft();
    }

    if (line === 'RIGHT') {
      this.toy.turnRight();
    }

    if (line === 'REPORT') {
      this.logger.info(this.toy.report());
    }
  }

}

export default App;
