import { isPromise, isPiped } from '../utils';
import { PipedContext } from '../context';

export function parallel(
  ...workers: Function[]
): (value: any) => Promise<any[]> {
  function toPromise(value: any | Promise<any>): Promise<any> {
    return isPromise(value) ? value : Promise.resolve(value);
  }

  return function doWork(this: PipedContext, value: any): any | Promise<any> {
    if (isPiped(this) && this.chain) {
      const operator = this.chain.shift();
      const all$ = Promise.all(workers.map(p => p(value)).map(toPromise));
      return !!operator ? all$.then(operator.bind(this)) : all$;
    }
    return Promise.all(workers.map(p => p(value)).map(toPromise));
  };
}
