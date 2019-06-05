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

<dl>
<dt><a href="#map">map</a></dt>
<dd><p>Maps an array or value into a new one using a specified function</p></dd>
</dl>

### map
