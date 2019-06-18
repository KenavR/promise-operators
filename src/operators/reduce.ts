import { isPiped } from '../utils';

interface ReducerFunc {
  (acc: any, val: any): any;
}

export function reduce(reducer: ReducerFunc, initialValue: any) {
  return function pipeableApply(
    this: any,
    data: Object | Array<any>
  ): any | Promise<any> {
    function getResult(data: Object | Array<any>): any {
      if (Array.isArray(data)) {
        return data.reduce(reducer, initialValue);
      }

      return reducer(initialValue, data);
    }

    return isPiped(this) ? getResult(data) : Promise.resolve(getResult(data));
  };
}
