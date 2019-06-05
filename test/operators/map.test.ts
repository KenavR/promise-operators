import { map } from '../../src';

it('should handle array', () => {
  function addOne(val: number): number {
    return val + 1;
  }

  const initial = [1, 2, 3];
  const expected = [2, 3, 4];

  expect(map(addOne)(initial)).resolves.toEqual(expected);
});
