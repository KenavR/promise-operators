import { map } from './map';
import { PipedContext } from '../context';
import { isPiped } from '../utils';

interface FlatMapperFunc<U> {
  (value: any, index?: number, array?: any[]): Promise<U>;
}

export function flatMap(
  mapper: FlatMapperFunc<any>
): (data: any) => Promise<any> | any {
  return function doWork(this: PipedContext, data: any): any | Promise<any> {
    function apply(data: any): Promise<any> {
      if (Array.isArray(data)) {
        return Promise.all(data.map(map(mapper) as any)).then(res => res);
      }

      return map(mapper)(data).then((res: any) => res);
    }

    if (isPiped(this) && this.chain) {
      const operator = this.chain.shift();
      const result$ = apply(data);
      return !!operator ? result$.then(operator.bind(this)) : result$;
    }

    return apply(data);
  };
}

export const mergeMap = flatMap;
