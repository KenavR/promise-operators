export function parallel(...promises: Function[]) {
  return (value: any) => Promise.all(promises.map(p => p(value)));
}
