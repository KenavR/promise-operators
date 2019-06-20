import { flatMap, pipe } from '../../src';

interface Fullname {
  firstname: string;
  lastname: string;
}

function addOne(val: number): Promise<number> {
  return Promise.resolve(val + 1);
}

function getLastname(name: Fullname): Promise<string> {
  return Promise.resolve(name.lastname);
}

describe('flatMap', () => {
  it('should handle array', () => {
    const initial = [1, 2, 3];
    const expected = [2, 3, 4];

    expect(flatMap(addOne)(initial)).resolves.toEqual(expected);
  });

  it('should handle object', () => {
    const expected = 'Doe';
    const initial: Fullname = {
      firstname: 'John',
      lastname: expected
    };

    expect(flatMap(getLastname)(initial)).resolves.toEqual(expected);
  });

  it('should be pipeable', () => {
    const initial = [1, 2, 3];
    const expected = [2, 3, 4];
    const pipeContext = { piped: true, chain: [] };

    const pipedFlatMap = flatMap(addOne).bind(pipeContext);
    const result = pipedFlatMap(initial);

    expect(result).resolves.toEqual(expected);
  });

  it('should work inside pipe', () => {
    const initial = [1, 2, 3];
    const expected = [3, 4, 5];
    const chain = Promise.resolve(initial).then(
      pipe(
        flatMap(addOne),
        flatMap(addOne)
      )
    );

    expect(chain).resolves.toEqual(expected);
  });
});
