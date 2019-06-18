import { parallel, reduce, pipe } from '../../src';

function generateNumberArraySync(n: number): number[] {
  return [...Array(n).keys()].map(val => val + 1);
  // [ 1, 2, 3, 4, 5, 6, 7 ]
}

function generateNumberArrayAsync(n: number): Promise<number[]> {
  return Promise.resolve(generateNumberArraySync(n));
}

function secondsPerDaysSync(days: number): number {
  return days * 24 * 60 * 60; // 604 800
}

function secondsPerDaysAsync(days: number): Promise<number> {
  return Promise.resolve(secondsPerDaysSync(days));
}

function divide([seconds, numbers]: Array<any>): Promise<number> {
  return reduce((result: number, divider: number) => result / divider, seconds)(
    numbers
  );
}
describe('parallel', () => {
  it('should handle two synchronous functions', () => {
    const expected = 120;

    const chain = Promise.resolve(7)
      .then(parallel(secondsPerDaysSync, generateNumberArraySync))
      .then(divide);

    expect(chain).resolves.toEqual(expected);
  });

  it('should handle multiple async functions returning promises', () => {
    const expected = 120;

    const chain = Promise.resolve(7)
      .then(parallel(secondsPerDaysAsync, generateNumberArrayAsync))
      .then(divide);

    expect(chain).resolves.toEqual(expected);
  });

  it('should handle mixed functions', () => {
    const expected = 120;

    const chain = Promise.resolve(7)
      .then(parallel(secondsPerDaysSync, generateNumberArrayAsync))
      .then(divide);

    expect(chain).resolves.toEqual(expected);
  });

  /*it('should be pipeable', () => {
    function addOne(val: number): number {
      return val + 1;
    }

    const initial = 7;
    const expected = 120;
    const pipeContext = { piped: true };

    const pipedParallel = parallel(
      secondsPerDaysSync,
      generateNumberArrayAsync
    ).bind(pipeContext);

    expect(pipedParallel(initial)).toEqual(expected);
  });

  it('should work inside pipe', () => {
    const expected = 120;

    const chain = Promise.resolve(7)
      .then(pipe(parallel(secondsPerDaysSync, generateNumberArrayAsync)))
      .then(divide);

    expect(chain).resolves.toEqual(expected);
  });*/
});
