import { map, pipe, filter } from '../../src';

interface Fullname {
  firstname: string;
  lastname: string;
}

describe('filter', () => {
  it('should handle array', () => {
    const initial = [1, 2, 3, 4, 5];
    const expected = [1, 2];

    expect(filter((v: number) => v < 3)(initial)).resolves.toEqual(expected);
  });

  it('should handle object, resolve', () => {
    const initial: Fullname = {
      firstname: 'John',
      lastname: 'Doe'
    };

    expect(
      filter((v: Fullname) => v.firstname === initial.firstname)(initial)
    ).resolves.toEqual(initial);
  });

  it('should handle object, reject', () => {
    const initial: Fullname = {
      firstname: 'John',
      lastname: 'Doe'
    };

    expect(
      filter((v: Fullname) => v.firstname === '')(initial)
    ).rejects.toThrow();
  });

  it('should handle object, reject with specific message', () => {
    const initial: Fullname = {
      firstname: 'John',
      lastname: 'Doe'
    };

    const specificMessage = 'Specific Message';

    expect(
      filter((v: Fullname) => v.firstname === '', specificMessage)(initial)
    ).rejects.toThrow(specificMessage);
  });

  it('should handle object, reject with specific error', () => {
    const initial: Fullname = {
      firstname: 'John',
      lastname: 'Doe'
    };

    const specificError = new Error('My error');

    expect(
      filter((v: Fullname) => v.firstname === '', specificError)(initial)
    ).rejects.toThrow(specificError);
  });

  it('should be pipeable, array - chain', () => {
    const calledMap = jest.fn(map(v => v + 1));

    const initial = [1, 2, 3, 4, 5];
    const expected = [2, 3];
    const pipeContext = {
      piped: true,
      chain: [calledMap]
    };

    const pipedFilter = filter((v: number) => v < 3).bind(pipeContext);
    const result = pipedFilter(initial);

    // console.log('RESULT:::: ', result);
    expect(result).toEqual(expected);
    expect(calledMap).toHaveBeenCalledTimes(1);
  });

  it('should be pipeable, object - break chain', () => {
    const uncalledMap = jest.fn(map((fn: Fullname) => fn.firstname));

    const initial: Fullname = {
      firstname: 'John',
      lastname: 'Doe'
    };
    const pipeContext = {
      piped: true,
      chain: [uncalledMap]
    };

    const pipedFilter = filter((fn: Fullname) => fn.firstname === '').bind(
      pipeContext
    );
    const result = pipedFilter(initial);

    expect(result).rejects.toThrow();
    expect(uncalledMap).not.toHaveBeenCalled();
  });

  it('should be pipeable, object - chain', () => {
    const calledMap = jest.fn(map((fn: Fullname) => fn.firstname));

    const initial: Fullname = {
      firstname: 'John',
      lastname: 'Doe'
    };
    const pipeContext = {
      piped: true,
      chain: [calledMap]
    };

    const pipedFilter = filter(
      (fn: Fullname) => fn.firstname === initial.firstname
    ).bind(pipeContext);
    const result = pipedFilter(initial);

    expect(result).toEqual(initial.firstname);
    expect(calledMap).toHaveBeenCalledTimes(1);
  });

  it('should work inside pipe, array', async () => {
    const calledMap = jest.fn(map(v => v + 1));

    const initial = [1, 2, 3];
    const expected = [] as number[];
    const chain = Promise.resolve(initial).then(
      pipe(
        filter((v: number) => v > 100),
        calledMap
      )
    );

    await expect(chain).resolves.toEqual(expected);
    expect(calledMap).toHaveBeenCalledTimes(1);
  });

  it('should work inside pipe, object', async () => {
    const calledMap = jest.fn(map((fn: Fullname) => fn.firstname));

    const initial: Fullname = {
      firstname: 'John',
      lastname: 'Doe'
    };

    const chain = Promise.resolve(initial).then(
      pipe(
        filter((fn: Fullname) => fn.firstname === initial.firstname),
        calledMap
      )
    );

    await expect(chain).resolves.toEqual(initial.firstname);
    expect(calledMap).toHaveBeenCalledTimes(1);
  });

  it('should work inside pipe, object - break chain', async () => {
    const uncalledMap = jest.fn(map((fn: Fullname) => fn.firstname));

    const initial: Fullname = {
      firstname: 'John',
      lastname: 'Doe'
    };

    const chain = Promise.resolve(initial).then(
      pipe(
        filter((fn: Fullname) => fn.firstname === ''),
        uncalledMap
      )
    );

    await expect(chain).rejects.toThrow();
    expect(uncalledMap).not.toHaveBeenCalled();
  });
});
