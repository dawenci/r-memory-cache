# r-memory-cache

## Installation

```
npm install r-memory-cache --save
```

## Usage

```typescript
import { createCache } from 'r-memory-cache'
const cache = createCache('LRU', { capacity: 2 })

cache.type // 'LRU'
cache.capacity // 2
cache.length // 0

cache.put('key', 'value')
cache.get('key') // 'value'
cache.length // 1

cache.del('key')
cache.get('key') // undefined

cache.put('key1', 'value1')
cache.put('key2', 'value2')
cache.put('key3', 'value3')

cache.get('key1') // undefined
cache.get('key2') // 'value2'
cache.get('key3') // 'value3'

// empty the cache
cache.clear()
cache.length // 0

```

## API

### `createCache(type[, options])`

```typescript
import { createCache } from 'r-memory-cache'

const lruCache = createCache('LRU')
const lruCache2 = createCache('LRU', { capacity: 100 })
const lfuCache = createCache('LFU')
const fifoCache = createCache('FIFO')
```

#### type:

- 'LRU'
- 'LFU'
- 'FIFO'

#### options:

```typescript
{
  // default: 64
  capacity: number
}
```

### `put(key, value)`

The `put` method adds or updates an entry.

```typescript
const cache = createCache('LRU')
cache.put(1, 1)
```

### `get(key)`

The `get` method returns a specified entry by key.

```typescript
const cache = createCache('LRU')
cache.put(1, 1)
cache.get(1) // 1
```

### `del(key)`

The `del` method removes the specified entry by key.

```typescript
const cache = createCache('LRU')
cache.put(1, 1)
cache.get(1) // 1
cache.del(1)
cache.get(1) // undefined
```

### `keys()`

The `keys` method returns a array that contains the keys for each entry in the cache instance.

```typescript
const cache = createCache('LRU')
cache.put(1, 1)
cache.put('a', 'a')
cache.keys() // [1, 'a']
```

### `clear()`

The `clear` method removes all entries.

```typescript
const cache = createCache('LRU')
cache.put(1, 1)
cache.put(2, 2)
cache.clear()
cache.get(1) // undefined
cache.get(2) // undefined
```

### `length`

The `length` property returns the number of entries in a cache instance.

```typescript
const cache = createCache('LRU')
cache.length // 0
cache.put(1, 1)
cache.length // 1
```

### `capacity`

The `capacity` property returns the largest amount of entries that can be contained in a cache instance.

```typescript
const cache = createCache('LRU')
cache.capacity // 64

const cache2 = createCache('LRU', { capacity: 2 })
cache2.capacity // 2
cache2.put(1, 1)
cache2.put(2, 2)
cache2.put(3, 3)
cache2.get(1) // undefined
cache2.get(2) // 2
cache2.get(3) // 3
```
