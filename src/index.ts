import { Type, MemCache, LruInitOptions, LfuInitOptions, FifoInitOptions } from './types'
import LruCache from './Lru'
import FifoCache from './Fifo'
import LfuCache from './Lfu'

type InitOptions = LruInitOptions | LfuInitOptions | FifoInitOptions

export function createCache<K = any, V = any>(type: Type, options?: Partial<InitOptions>): MemCache<K, V> {
  switch (type.toUpperCase()) {
    case 'LRU':
      return new LruCache<K, V>(options)
    case 'FIFO':
      return new FifoCache<K, V>(options)
    case 'LFU':
      return new LfuCache<K, V>(options)
  }
  throw new Error('缓存类型无效')
}
