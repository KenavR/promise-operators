export function pipe(
  this: any,
  ...operators: any
): (data: any) => Promise<any> {
  function reducer(this: any, acc: any, op: any) {
    return op.call(this, acc);
  }

  const pipeContext = { ...this, piped: true };
  return (data: any) => {
    return operators.reduce(reducer.bind(pipeContext), data);
  };
}
