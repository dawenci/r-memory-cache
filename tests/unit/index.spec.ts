import { createCache } from '../../src'
import Lru from '../../src/Lru'
import Lfu from '../../src/Lfu'
import Fifo from '../../src/Fifo'

describe('create', () => {
  it('type', () => {
    expect(createCache('LRU') instanceof Lru).toBe(true)
    expect(createCache('LFU') instanceof Lfu).toBe(true)
    expect(createCache('FIFO') instanceof Fifo).toBe(true)
    expect(() => createCache('OTHER' as any)).toThrowError(Error)
  })
})
