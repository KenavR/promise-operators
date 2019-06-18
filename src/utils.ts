export function isPiped(context: { piped?: boolean }) {
  return context && context.hasOwnProperty('piped') && context.piped;
}
