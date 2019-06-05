interface MapperFunc<U> {
  (value: any, index?: number, array?: any[]): U;
}

export function map(mapper: MapperFunc<any>): Function {
  return (data: any): Promise<any> => {
    if (Array.isArray(data)) {
      return Promise.resolve(data.map(mapper));
    }

    return Promise.resolve(mapper(data));
  };
}
