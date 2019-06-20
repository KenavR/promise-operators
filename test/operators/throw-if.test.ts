import { throwIf, map, pipe, tap } from '../../src';

describe('throwIf', () => {
  it('should throw with default error', async () => {
    await expect(throwIf(() => true)(0)).rejects.toThrow(
      'Condition is not met!'
    );
  });

  it('should throw error with specific message', async () => {
    const specificErrorMsg = 'Specific error message';

    await expect(throwIf(() => true, specificErrorMsg)(0)).rejects.toThrow(
      specificErrorMsg
    );
  });

  it('should throw error with specific error', async () => {
    const specificError = new Error('My error');

    await expect(throwIf(() => true, specificError)(0)).rejects.toThrow(
      specificError
    );
  });

  it('should pass value through if condition is not met', () => {
    expect(throwIf(() => false)(0)).resolves.toEqual(0);
  });

  it('should be pipeable, break chain', () => {
    const uncalledMap = jest.fn(map(v => v + 1));

    const pipeContext = { piped: true, chain: [uncalledMap] };
    const pipedThrowIf = throwIf(() => true).bind(pipeContext);

    expect(pipedThrowIf(0)).rejects.toThrow();
    expect(uncalledMap).not.toHaveBeenCalled();
  });

  it('should be pipeable, chain', () => {
    const calledMap = jest.fn(map(v => v + 1));

    const pipeContext = { piped: true, chain: [calledMap] };
    const pipedThrowIf = throwIf(() => false).bind(pipeContext);

    expect(pipedThrowIf(0)).toEqual(1);
    expect(calledMap).toHaveBeenCalledTimes(1);
  });

  it('should work inside pipe, break chain', () => {
    const uncalledMap = jest.fn(map(v => v + 1));

    const initial = [1, 2, 3];
    const chain = Promise.resolve(initial).then(
      pipe(
        throwIf(() => true),
        uncalledMap,
        uncalledMap
      )
    );

    expect(chain).rejects.toThrow();
    expect(uncalledMap).not.toHaveBeenCalled();
  });

  it('should work inside pipe, chain', async () => {
    const calledMap = jest.fn(map(v => v + 1));

    const initial = [1, 2, 3];
    const expected = [3, 4, 5];
    const chain = Promise.resolve(initial).then(
      pipe(
        throwIf(() => false),
        calledMap,
        calledMap
      )
    );

    await expect(chain).resolves.toEqual(expected);
    expect(calledMap).toHaveBeenCalledTimes(2);
  });
});
