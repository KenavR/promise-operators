# Operators for Promise chains

The project includes a couple of rxjs inspired operators for promises

## Installation

```js
npm i @kenavr/promise-operators
```

```js
import { map } from '@kenavr/promise-operators';

Promise.resolve([1, 2, 3])
  .then(map(val => val + 1))
  .then(/*[2,3,4]*/);
```

## Operators

### Descriptions

All functions return a Promise making it simple to chain them.

<dl>
<dt><a href="#map">map</a></dt>
<dd><p>Maps an array or value into a new one using a specified function</p></dd>
<dt><a href="#pipe">pipe</a></dt>
<dd><p>Enables the use of operators without creating multiple Promises along the way</p></dd>
</dl>

### map

Take a mapping function and an array or object as value. If an array is passed it runs through the array and applies the mapping function to each value. If an object is passed the mapping function is applied once on the object.

| Param  | Type                  | Description                                                          |
| ------ | --------------------- | -------------------------------------------------------------------- |
| mapper | <code>Function</code> | The mapping function applied to the passed value, returns a function |
| value  | <code>\*</code>       | The data the mapping function should be applied on                   |

**Isolated Example**

```js
map(val => val + 1)(1).then(/* 2 */);
```

**Example**

```js
Promise.resolve([1, 2, 3])
  .then(map(val => val + 1))
  .then(/*[2,3,4]*/);
```

### pipe

Takes a list of operators and executes them sequentially.

| Param     | Type              | Description                                                                 |
| --------- | ----------------- | --------------------------------------------------------------------------- |
| operators | <code>List</code> | A comma seperated list of all operators that should be applied sequentially |
| value     | <code>\*</code>   | The data the piped operators should be applied on                           |

**Isolated Example**

```js
pipe(
  map(val => val * 10),
  filter(val => val < 30)
)([1, 2, 3, 4, 5]).then(/* [10,20] */);
```

**Example**

```js
Promise.resolve([1, 2, 3, 4, 5])
  .then(
    pipe(
      map(val => val * 10),
      filter(val => val < 30),
      reduce((acc, val) => acc + val, 0)
    )
  )
  .then(/* [30] */);
```
