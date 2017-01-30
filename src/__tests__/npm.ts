import test from 'ava';
import { createReservedNames } from '../npm';

test('create reserved names', t => {
  t.plan(1);

  const reservedNames = createReservedNames({
    total_rows: 2,
    rows: [{ id: 'a' }, { id: 'b' }, { id: 'c' }]
  });

  t.deepEqual(Array.from(reservedNames).sort(), ['a', 'b', 'c']);
});
