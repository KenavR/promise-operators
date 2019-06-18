import { isPiped } from '../utils';

interface MapperFunc<U> {
  (value: any, index?: number, array?: any[]): U;
}

export function map(mapper: MapperFunc<any>): Function {
  return function pipeableApply(this: any, data: any): any | Promise<any> {
    function getResult(data: any) {
      if (Array.isArray(data)) {
        return data.map(mapper);
      }
      return mapper(data);
    }

    return isPiped(this) ? getResult(data) : Promise.resolve(getResult(data));
  };
}
