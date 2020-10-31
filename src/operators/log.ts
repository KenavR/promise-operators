import { PipedContext } from '../context';
import { isPiped } from '../utils';

interface LogFunc {
  (value: any): string;
}

export function log(logger: LogFunc): (data: any) => Promise<any> {
  return function doWork(this: PipedContext, data: any): any | Promise<any> {
    function log(data: any): any {
      console.log(logger(data));
      return data;
    }

    if (isPiped(this) && this.chain) {
      const operator = this.chain.shift();
      return !!operator ? operator.call(this, log(data)) : log(data);
    }

    return Promise.resolve(data);
  };
}
