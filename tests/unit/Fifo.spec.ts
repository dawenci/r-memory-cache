import Fifo from '../../src/Fifo'

describe('FIFO', () => {
  it('type', () => {
    const cache = new Fifo()
    expect(cache.type).toBe('FIFO')
  })

  it('put, get', () => {
    const cache = new Fifo()
    expect(cache.get(1)).toBe(undefined)
    cache.put(1, 1)
    expect(cache.get(1)).toBe(1)
    cache.put(1, 2)
    expect(cache.get(1)).toBe(2)
  })

  it('capacity', () => {
    const cache = new Fifo({ capacity: 1 })
    expect(cache.capacity).toBe(1)
    expect(cache.length).toBe(0)
    cache.put(1, 1)
    expect(cache.length).toBe(1)
    cache.put(2, 2)
    expect(cache.length).toBe(1)
  })

  it('replacement', () => {
    const cache = new Fifo({ capacity: 2 })
    cache.put(1, 1)
    cache.put(2, 2)
    cache.put(3, 3)
    expect(cache.get(1)).toBe(undefined)
    expect(cache.get(2)).toBe(2)
    expect(cache.get(3)).toBe(3)
    cache.put(4, 4)
    expect(cache.get(2)).toBe(undefined)
    expect(cache.get(3)).toBe(3)
    expect(cache.get(4)).toBe(4)
  })

  it('del', () => {
    const cache = new Fifo({ capacity: 3 })
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
    cache.put(1, 1)
    cache.put(2, 2)
    cache.del(2)
    expect(cache.get(1)).toBe(1)
    expect(cache.get(2)).toBe(undefined)
  })

  it('keys', () => {
    const cache = new Fifo({ capacity: 2 })
    expect(cache.keys()).toEqual([])
    cache.put(1, 1)
    cache.put('a', 'a')
    expect(cache.keys()).toEqual([1, 'a'])
  })

  it('clear', () => {
    const cache = new Fifo({ capacity: 1 })
    cache.put(1, 1)
    expect(cache.length).toBe(1)
    cache.clear()
    expect(cache.length).toBe(0)
  })
})
