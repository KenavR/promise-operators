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
<dt><a href="#filter">filter</a></dt>
<dd><p>Either filters an array or throws an error if an object doesn't pass the condition</p></dd>
<dt><a href="#reduce">reduce</a></dt>
<dd><p>Either reduces an array or runs the passed object through the reducer function</p></dd>
<dt><a href="#pipe">pipe</a></dt>
<dd><p>Enables the use of operators without creating unnecessary Promises along the way</p></dd>
<dt><a href="#flatMap">flatMap</a></dt>
<dd><p>Maps an array or value into a new one using a function that returns a Promise (the Promise gets resolved)</p></dd>
<dt><a href="#parallel">parallel</a></dt>
<dd><p>Runs multiple functions parallel all receiving the same initial value</p></dd>
<dt><a href="#throwIf">throwIf</a></dt>
<dd><p>Throws an error if the passed data doesn't meet the condition</p></dd>
<dt><a href="#tap">tap</a></dt>
<dd><p>Executes a side effect without modifying the passed data</p></dd>
</dl>

### map

Takes a mapping function and an array or object as value. If an array is passed it runs through the array and applies the mapping function to each value. If an object is passed the mapping function is applied once on the object.

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

### filter

Takes a filter function and an array or object as value. If an array is passed its values are filtered based on the condition. If an object is passed the filter function is applied once on the object.

| Param  | Type                  | Description                                                         |
| ------ | --------------------- | ------------------------------------------------------------------- |
| filter | <code>Function</code> | The filter function applied to the passed value, returns a function |
| value  | <code>\*</code>       | The data the filter function should be applied on                   |

**Isolated Example**

```js
filter(val => val < 10)([2, 3, 5, 7, 11, 13, 17, 19]).then(/* [2,3,5,7] */);
```

**Example**

```js
Promise.resolve([2, 3, 5, 7, 11, 13, 17, 19])
  .then(filter(val => val < 10))
  .then(/*[2,3,5,7]*/);
```

### reduce

Takes a reducer function with an initial value and an array or object as value. If an array is passed the function is applied on the array and return a single value. If an object is passed the reducer function is applied once on the object.

| Param        | Type                                                 | Description                                       |
| ------------ | ---------------------------------------------------- | ------------------------------------------------- |
| reducer      | <code>Function</code> <code>(acc, val) => acc</code> | The reducer function applied to the passed value  |
| initialValue | <code>\*</code>                                      | The value the reducer function starts with        |
| value        | <code>\*</code>                                      | The data the filter function should be applied on |

**Isolated Example**

```js
reduce((sum, val) => sum + val, 0)([1, 2, 3, 4, 5]).then(/* 15 */);
```

**Example**

```js
Promise.resolve([5, 4, 3, 2, 1])
  .then(reduce((product, val) => product * val, 1))
  .then(/* 120 */);
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
      map(val => val * 10), // [10, 20, 30, 40, 50]
      filter(val => val < 30), // [10, 20]
      reduce((acc, val) => acc + val, 0) // 30
    )
  )
  .then(/* 30 */);
```

### flatMap

Takes a mapping function that returns a Promise and an array or object as value. If an array is passed it runs through the array and applies the mapping function to each value. If an object is passed the mapping function is applied once on the object. The inner promises are resolved before returning a single Promise.

| Param  | Type                  | Description                                                         |
| ------ | --------------------- | ------------------------------------------------------------------- |
| mapper | <code>Function</code> | The mapping function applied to the passed value, returns a Promise |
| value  | <code>\*</code>       | The data the mapping function should be applied on                  |

**Isolated Example**

```js
flatMap(val => Promise.resolve(val + 1))(1).then(/* 2 */);
```

**Example**

```js
Promise.resolve([1, 2, 3])
  .then(flatMap(val => Promise.resolve(val + 1)))
  .then(/*[2,3,4]*/);
```

### parallel

Takes an array of functions and runs them parallel all receiving the same initial value

| Param   | Type                    | Description                      |
| ------- | ----------------------- | -------------------------------- |
| workers | <code>Function[]</code> | Array of functions               |
| value   | <code>\*</code>         | The data passed to each function |

**Isolated Example**

```js
const addOne = val => val + 1;
const subOneAsync = val => Promise.resolve(val - 1);

parallel([addOne, subOneAsync])(1).then(/* [2, 0]*/);
```

**Example**

```js
const sum = array => array.reduce((sum, val) => sum + val, 0);
const multiply = array => array.reduce((sum, val) => sum * val, 1);

Promise.resolve([2, 3, 4])
  .then(parallel([sum, multiply]))
  .then(/*[ 9, 24 ]*/);
```

### throwIf

Throws an error if the passed data doesn't meet the condition

| Param    | Type                                    | Description                                                                      |
| -------- | --------------------------------------- | -------------------------------------------------------------------------------- |
| function | <code>Function</code>                   | Condition the passed value needs to meet                                         |
| error    | <code>Error \| string</code> _optional_ | An optional Error or error message which is thrown when the condition is not met |
| value    | <code>\*</code>                         | The data that needs to meet the criteria                                         |

**Isolated Example**

```js
throwIf(val <= 5, 'Value is larger than 5')(10)
  .then(/**/)
  .catch(error => /* 'Value is larger than 5' */);
```

**Example**

```js
Promise.resolve([2, 3, 4])
  .then(throwIf(array => array.length < 5, new Error('Array is too small!')))
  .then(/**/)
  .catch(error => /* 'Array is too small!' */);
```

### tap

Executes a side effect without modifying the passed data

| Param    | Type                  | Description                    |
| -------- | --------------------- | ------------------------------ |
| function | <code>Function</code> | Function executing side effect |
| value    | <code>\*</code>       | Data passed to the function    |

**Isolated Example**

```js
tap(val => console.log('Value: ', val))(10) // Value: 10
  .then(/* 10 */);
```

**Example**

```js
let counter = 0;

Promise.resolve([2, 3, 4])
  .then(tap(val => counter++))
  .then(/* [2, 3, 4] */);
```
