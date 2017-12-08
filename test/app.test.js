/* eslint-disable no-console */

import _ from 'lodash';
import { expect } from 'chai';
import sinon from 'sinon';
import App from '../src/app';

describe('App', function () {
  let app;

  function print(input) {
    _.each(input, (line) => {
      console.log(`\t\x1b[2m${line}\x1b[0m`);
    });
  }

  beforeEach(function () {
    app = new App();
    sinon.stub(app.logger);
  });

  describe('Test case A:', function () {
    it('Output: 0,1,NORTH', function () {
      const input = [
        'PLACE 0,0,NORTH',
        'MOVE',
        'REPORT'
      ];

      print(input);
      app.process(input.join('\n'));
      expect(app.toy.report()).to.eql('0,1,NORTH');
    });
  });

  describe('Test case B:', function () {
    it('Output: 0,0,WEST', function () {
      const input = [
        'PLACE 0,0,NORTH',
        'LEFT',
        'REPORT'
      ];

      print(input);
      app.process(input.join('\n'));
      expect(app.toy.report()).to.eql('0,0,WEST');
    });
  });

  describe('Test case C:', function () {
    it('Output: 3,3,NORTH', function () {
      const input = [
        'PLACE 1,2,EAST',
        'MOVE',
        'MOVE',
        'LEFT',
        'MOVE',
        'REPORT'
      ];

      print(input);
      app.process(input.join('\n'));
      expect(app.toy.report()).to.eql('3,3,NORTH');
    });
  });
});
