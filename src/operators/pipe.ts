import { isPromise } from '../utils';

export function pipe(
  this: any,
  ...operators: any
): (data: any) => Promise<any> {
  return (data: any) => {
    const operator = operators.shift();
    const pipeContext = { ...this, piped: true, chain: operators };
    const result = !!operator ? operator.call(pipeContext, data) : data;
    return isPromise(result) ? result : Promise.resolve(result);
  };
}
