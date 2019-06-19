import { isPiped } from '../utils';
import { PipedContext } from '../context';

interface ReducerFunc {
  (acc: any, val: any): any;
}

export function reduce(reducer: ReducerFunc, initialValue: any): (data: Object | Array<any>) => any | Promise<any> {
  return function doWork(
    this: PipedContext,
    data: Object | Array<any>
  ): any | Promise<any> {
    function getResult(data: Object | Array<any>): any {
      if (Array.isArray(data)) {
        return data.reduce(reducer, initialValue);
      }

      return reducer(initialValue, data);
    }

    if (isPiped(this) && this.chain) {
      const operator = this.chain.shift();
      return !!operator
        ? operator.call(this, getResult(data))
        : getResult(data);
    }
    return Promise.resolve(getResult(data));
  };
}
