import { MemCache, LruInitOptions } from './types'
import { CAPACITY } from './config'

class _Entry<K, V> {
  key: K
  value: V
  prev: _Entry<K, V> | null
  next: _Entry<K, V> | null
  constructor(key: K, value: V) {
    this.key = key
    this.value = value
    this.prev = null
    this.next = null
  }
}

export default class LruCache<K = any, V = any> implements MemCache<K, V> {
  private _capacity: number
  private _length: number
  private _head: _Entry<K, V> | null
  private _tail: _Entry<K, V> | null
  private _store: Map<K, _Entry<K, V>>

  constructor(options: Partial<LruInitOptions> = {}) {
    this._capacity = options.capacity || CAPACITY
    this._length = 0
    this._head = null
    this._tail = null
    this._store = new Map<K, _Entry<K, V>>()
  }

  get type() {
    return 'LRU'
  }

  get capacity() {
    return this._capacity
  }

  get length() {
    return this._length
  }

  get(key: K): V | undefined {
    const entry = this._store.get(key)
    if (!entry) return undefined
    this._moveToTail(entry)
    return entry.value
  }

  put(key: K, value: V): void {
    const entry = this._store.get(key)
    // 修改
    if (entry) {
      entry.value = value
      this._moveToTail(entry)
      return
    }

    // 新增，需要处理容量
    if (this._length >= this._capacity) {
      this._removeHead()
    }
    const newEntry = new _Entry(key, value)
    this._store.set(key, newEntry)
    this._moveToTail(newEntry)
    this._length += 1
  }

  del(key: K): void {
    const entry = this._store.get(key)
    if (entry) {
      this._store.delete(key)
      const { prev, next } = entry
      if (prev) {
        prev.next = next
      }
      if (next) {
        next.prev = prev
      }
      if (entry === this._head) {
        this._head = next
      }
      if (entry === this._tail) {
        this._tail = prev
      }
      this._length -= 1
    }
  }

  keys(): K[] {
    return [...this._store.keys()]
  }

  clear(): void {
    this._length = 0
    this._head = null
    this._tail = null
    this._store.clear()
  }

  // 将条目移动到末尾（最后被删）
  private _moveToTail(entry: _Entry<K, V>): void {
    // entry 已经是最后一个结点了
    if (this._tail === entry) return

    const { prev, next } = entry

    // entry 有前驱，则链接前驱和后继
    if (prev) {
      prev.next = next
      if (next) next.prev = prev
    } else if (this._head === entry) {
      // entry 无前驱，（且自身为第一项，即非新增结点）
      // 则挪走后，原本的后继作为第一项
      if (next) next.prev = null
      this._head = next
    }

    // 其他情况，包括新插入结点
    entry.prev = null
    entry.next = null

    if (this._tail) {
      this._tail.next = entry
      entry.prev = this._tail
      this._tail = entry
    } else {
      // 首个新增结点
      this._head = this._tail = entry
    }
  }

  private _removeHead(): void {
    if (this._head) this.del(this._head.key)
  }
}
