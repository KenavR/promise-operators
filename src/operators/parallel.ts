import { isPromise, isPiped } from '../utils';
import { PipedContext } from '../context';

export function parallel(
  ...promises: Function[]
): (value: any) => Promise<any[]> {
  function toPromise(value: any | Promise<any>): Promise<any> {
    return isPromise(value) ? value : Promise.resolve(value);
  }

  return function doWork(this: PipedContext, value: any): any | Promise<any> {
    if (isPiped(this) && this.chain) {
      const operator = this.chain.shift();
      const all$ = Promise.all(promises.map(p => p(value)).map(toPromise));
      return !!operator ? all$.then(operator.bind(this)) : all$;
    }
    return Promise.all(promises.map(p => p(value)).map(toPromise));
  };
}
