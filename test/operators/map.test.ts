import { map, pipe } from '../../src';

interface Fullname {
  firstname: string;
  lastname: string;
}

describe('map', () => {
  it('should handle array', () => {
    function addOne(val: number): number {
      return val + 1;
    }

    const initial = [1, 2, 3];
    const expected = [2, 3, 4];

    expect(map(addOne)(initial)).resolves.toEqual(expected);
  });

  it('should handle object', () => {
    function toLastname(val: Fullname): string {
      return val.lastname;
    }

    const expected = 'Doe';
    const initial: Fullname = { firstname: 'John', lastname: expected };

    expect(map(toLastname)(initial)).resolves.toEqual(expected);
  });

  it('should be pipeable', () => {
    // map() used inside pipe() does not return a promise

    function addOne(val: number): number {
      return val + 1;
    }

    const initial = [1, 2, 3];
    const expected = [2, 3, 4];
    const pipeContext = { piped: true, chain: [] };

    const pipedMap = map(addOne).bind(pipeContext);
    const result = pipedMap(initial);

    // console.log('RESULT:::: ', result);
    expect(result).toEqual(expected);
  });

  it('should work inside pipe', () => {
    function addOne(val: number): number {
      return val + 1;
    }

    const initial = [1, 2, 3];
    const expected = [3, 4, 5];
    const chain = Promise.resolve(initial).then(
      pipe(
        map(addOne),
        map(addOne)
      )
    );

    expect(chain).resolves.toEqual(expected);
  });
});
