import { isPromise } from '../utils';

export function parallel(
  ...promises: Function[]
): (value: any) => Promise<any[]> {
  function toPromise(value: any | Promise<any>): Promise<any> {
    return isPromise(value) ? value : Promise.resolve(value);
  }

  return (value: any) =>
    Promise.all(promises.map(p => p(value)).map(toPromise));
}
