import { isPiped } from '../utils';

interface MapperFunc<U> {
  (value: any, index?: number, array?: any[]): U;
}

interface PipedContext {
  piped?: boolean;
  chain?: any[];
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
      const res = !!operator
        ? operator.call(this, getResult(data))
        : getResult(data);

      //console.log('PIPED: ', res);
      return res;
    }
    return Promise.resolve(getResult(data));
  };
}
