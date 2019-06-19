import { isPiped } from '../utils';
import { PipedContext } from '../context';

export function tap(sideEffect: Function): (value: any) => any {
  return function doWork(this: PipedContext, value: any): any | Promise<any> {
    sideEffect(value);

    if (isPiped(this) && this.chain) {
      const operator = this.chain.shift();
      return !!operator ? operator.call(this, value) : value;
    }
    return Promise.resolve(value);
  };
}
