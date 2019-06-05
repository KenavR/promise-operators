export function tap(sideEffect: Function) {
  return (value: any) => {
    sideEffect(value);
    return Promise.resolve(value);
  };
}
