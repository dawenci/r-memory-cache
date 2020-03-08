import Lru from '../../src/Lru'

describe('LRU', () => {
  it('type', () => {
    const cache = new Lru()
    expect(cache.type).toBe('LRU')
  })

  it('put, get', () => {
    const cache = new Lru()
    expect(cache.get(1)).toBe(undefined)
    cache.put(1, 1)
    expect(cache.get(1)).toBe(1)
  })

  it('capacity', () => {
    const cache = new Lru({ capacity: 1 })
    expect(cache.capacity).toBe(1)
    expect(cache.length).toBe(0)
    cache.put(1, 1)
    expect(cache.length).toBe(1)
    cache.put(2, 2)
    expect(cache.length).toBe(1)
  })

  it('adjust', () => {
    const cache1 = new Lru({ capacity: 2 })
    cache1.put(1, 1)
    cache1.put(2, 2)
    cache1.put(3, 3)
    expect(cache1.get(1)).toBe(undefined)
    expect(cache1.get(2)).toBe(2)
    expect(cache1.get(3)).toBe(3)

    // get 调整
    const cache2 = new Lru({ capacity: 2 })
    cache2.put(1, 1)
    cache2.put(2, 2)
    cache2.get(1)
    cache2.put(3, 3)
    expect(cache2.get(1)).toBe(1)
    expect(cache2.get(2)).toBe(undefined)
    expect(cache2.get(3)).toBe(3)

    // put 调整
    const cache3 = new Lru({ capacity: 2 })
    cache3.put(1, 1)
    cache3.put(2, 2)
    cache3.put(1, 10)
    cache3.put(3, 3)
    expect(cache3.get(1)).toBe(10)
    expect(cache3.get(2)).toBe(undefined)
    expect(cache3.get(3)).toBe(3)
  })

  it('del', () => {
    const cache = new Lru({ capacity: 3 })
    cache.put(1, 1)
    cache.put(2, 2)
    cache.put(3, 3)
    expect(cache.length).toBe(3)
    cache.del(1)
    expect(cache.get(1)).toBe(undefined)
    expect(cache.get(2)).toBe(2)
    expect(cache.get(3)).toBe(3)
    cache.del(2)
    expect(cache.get(1)).toBe(undefined)
    expect(cache.get(2)).toBe(undefined)
    expect(cache.get(3)).toBe(3)
    cache.del(3)
    expect(cache.get(1)).toBe(undefined)
    expect(cache.get(2)).toBe(undefined)
    expect(cache.get(3)).toBe(undefined)
  })

  it('keys', () => {
    const cache = new Lru({ capacity: 2 })
    expect(cache.keys()).toEqual([])
    cache.put(1, 1)
    cache.put('a', 'a')
    expect(cache.keys()).toEqual([1, 'a'])
  })

  it('clear', () => {
    const cache = new Lru({ capacity: 1 })
    cache.put(1, 1)
    expect(cache.length).toBe(1)
    cache.clear()
    expect(cache.length).toBe(0)
  })
})
