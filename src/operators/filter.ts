import { isPiped } from '../utils';
import { PipedContext } from '../context';

export function filter<T>(
  condition: (data: T) => boolean,
  error?: Error | string
): (data: any) => any | Promise<any> {
  return function doWork(this: PipedContext, data: any): any | Promise<any> {
    function getResult(data: any): Array<T> | boolean {
      if (Array.isArray(data)) {
        return data.filter(condition);
      }
      return condition(data);
    }

    function throwError(error?: Error | string) {
      if (error) {
        return Promise.reject(
          error instanceof Error ? error : new Error(error)
        );
      }

      return Promise.reject(new Error('Condition is not met!'));
    }

    function handleValidObject(this: PipedContext, data: T) {
      if (isPiped(this) && this.chain) {
        const operator = this.chain.shift();
        return !!operator ? operator.call(this, data) : data;
      }

      return Promise.resolve(data);
    }

    const result = getResult(data);

    // Object does not meet condition
    if (result === false) {
      return throwError(error);
    }

    // Object meets condition
    if (result === true) {
      return handleValidObject.call(this, data);
    }

    // Filtered Array
    if (result) {
      if (isPiped(this) && this.chain) {
        const operator = this.chain.shift();
        return !!operator ? operator.call(this, result) : result;
      }
    }

    return Promise.resolve(result);
  };
}
