import { Enum } from 'enumify';

class Direction extends Enum {
}

Direction.initEnum([
  'NORTH',
  'EAST',
  'SOUTH',
  'WEST'
]);

export default Direction;
