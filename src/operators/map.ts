import { isPiped } from '../utils';
import { PipedContext } from '../context';

interface MapperFunc<U> {
  (value: any, index?: number, array?: any[]): U;
}

export function map(
  mapper: MapperFunc<any>
): (data: any) => any | Promise<any> {
  return function doWork(this: PipedContext, data: any): any | Promise<any> {
    function getResult(data: any) {
      if (Array.isArray(data)) {
        return data.map(mapper);
      }
      return mapper(data);
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
