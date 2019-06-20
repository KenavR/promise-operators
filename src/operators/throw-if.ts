import { PipedContext } from '../context';
import { isPiped } from '../utils';

export function throwIf<T>(
  condition: (data: T) => boolean,
  error?: Error | string
): (data: any) => Promise<any> {
  return function doWork(this: PipedContext, data: any): Promise<any> {
    const shouldThrow = condition(data);

    if (shouldThrow) {
      if (error) {
         return Promise.reject(error instanceof Error ? error : new Error(error));
      }

      return Promise.reject(new Error('Condition is not met!'));
    }

    if (isPiped(this) && this.chain) {
      const operator = this.chain.shift();
      return !!operator ? operator.call(this, data) : data;
    }
    return Promise.resolve(data);
  };
}
