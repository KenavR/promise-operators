import { map } from "./map";

interface MapperFunc<U> {
  (value: any, index?: number, array?: any[]): U;
}

export function flatMap(mapper: MapperFunc<any>) {
  return (data: any) => {
    if (Array.isArray(data)) {
      return Promise.all(data.map(map(mapper) as any)).then(res => res);
    }

    return map(mapper)(data).then((res: any) => res);
  };
}

export const mergeMap = flatMap;
