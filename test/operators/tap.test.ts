import { map, pipe, tap } from '../../src';

interface Fullname {
  firstname: string;
  lastname: string;
}

describe('tap', () => {
  it('should apply side effect', () => {
    let counter = 0;

    function increaseCounter() {
      counter += 1;
    }

    const expected = 1;

    tap(increaseCounter)(100).then(() => {
      expect(counter).toBe(expected);
    });
  });

  it('should return the value passed to it', () => {
    let counter = 0;

    function increaseCounter() {
      counter += 1;
    }

    const initial = 100;
    const expected = 100;

    tap(increaseCounter)(initial).then((val: number) => {
      expect(val).toBe(expected);
    });
  });

  it('should be pipeable', () => {
    let counter = 0;

    function increaseCounter() {
      counter += 1;
    }

    const initial = [1, 2, 3];
    const expected = [1, 2, 3];
    const pipeContext = { piped: true };

    const pipedTap = tap(increaseCounter).bind(pipeContext);

    expect(pipedTap(initial)).toEqual(expected);
  });

  it('should work inside pipe', () => {
    function addOne(val: number): number {
      return val + 1;
    }

    function increaseCounter() {
      counter += 1;
    }

    let counter = 0;
    const initial = [1, 2, 3];
    const expected = [3, 4, 5];
    const chain = Promise.resolve(initial).then(
      pipe(
        map(addOne),
        tap(increaseCounter),
        map(addOne)
      )
    );

    chain.then(val => {
      expect(val).toEqual(expected);
      expect(counter).toBe(1);
    });
  });
});
