import { isPiped } from '../utils';

export function tap(sideEffect: Function) {
  return function pipeableApply(this: any, value: any): any | Promise<any> {
    sideEffect(value);
    return isPiped(this) ? value : Promise.resolve(value);
  };
}
