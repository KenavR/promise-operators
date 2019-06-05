export function reduce(reducer: Function, initialValue: any) {
  return (array: any) => Promise.resolve(array.reduce(reducer, initialValue));
}
