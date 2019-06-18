export function isPiped(context: { piped?: boolean }) {
  return context && context.hasOwnProperty('piped') && context.piped;
}

export function isPromise(value: any | Promise<any>): boolean {
  return Promise.resolve(value) == value;
}
