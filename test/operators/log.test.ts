import { log, pipe } from '../../src';

describe('log', () => {
  it('should log string', () => {
    const value = 1;

    expect(log(d => `The number is ${d}`)(value)).resolves.toEqual(value);
  });


  it('should be pipeable', () => {
    const values = [1, 2, 3];
    const pipeContext = { piped: true, chain: [] };

    const pipedLog = log(d => `The number is ${d}`).bind(pipeContext);
    const result = pipedLog(values);

    expect(result).toEqual(values);
  });

  it('should work inside pipe', () => {
    const values = [1, 2, 3];
    const chain = Promise.resolve(values).then(
      pipe(
        log(d => `The numbers are ${d}`),
        log(_ => `Why put the numbers out again?` )
      )
    );

    expect(chain).resolves.toEqual(values);
  });
});
