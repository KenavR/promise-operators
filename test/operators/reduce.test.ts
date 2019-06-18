import { reduce, pipe, map } from '../../src';

interface Fullname {
  firstname: string;
  lastname: string;
}

describe('reduce', () => {
  it('should handle array', () => {
    function sum(acc: number, val: number): number {
      return acc + val;
    }

    const initial = [1, 2, 3];
    const expected = 6;

    expect(reduce(sum, 0)(initial)).resolves.toEqual(expected);
  });

  it('should handle object', () => {
    function merge(acc: Object, val: Fullname): Object {
      return { ...acc, ...val };
    }

    const reduceInitial = { nickname: 'Reducer' };
    const initial: Fullname = { firstname: 'John', lastname: 'Doe' };

    const expected = { ...reduceInitial, ...initial };

    expect(reduce(merge, reduceInitial)(initial)).resolves.toEqual(expected);
  });

  it('should be pipeable', () => {
    // map() used inside pipe() does not return a promise

    function sum(acc: number, val: number): number {
      return acc + val;
    }

    const initial = [1, 2, 3];
    const expected = 6;
    const pipeContext = { piped: true };

    const pipedReduce = reduce(sum, 0).bind(pipeContext);

    expect(pipedReduce(initial)).toEqual(expected);
  });

  it('should work inside pipe', () => {
    function addOne(val: number): number {
      return val + 1;
    }

    function sum(acc: number, val: number): number {
      return acc + val;
    }

    const initial = [1, 2, 3];
    const expected = 10;
    const chain = Promise.resolve(initial).then(
      pipe(
        map(addOne),
        reduce(sum, 1)
      )
    );

    expect(chain).resolves.toEqual(expected);
  });
});
