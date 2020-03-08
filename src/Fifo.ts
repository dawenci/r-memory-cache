import { MemCache, FifoInitOptions } from './types'
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

export default class FifoCahce<K = any, V = any> implements MemCache<K, V> {
  private _capacity: number
  private _length: number
  private _head: _Entry<K, V> | null
  private _tail: _Entry<K, V> | null
  private _store: Map<K, _Entry<K, V>>

  constructor(options: Partial<FifoInitOptions> = {}) {
    this._capacity = options.capacity || CAPACITY
    this._length = 0
    this._head = null
    this._tail = null
    this._store = new Map<K, _Entry<K, V>>()
  }

  get type() {
    return 'FIFO'
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
    return entry.value
  }

  put(key: K, value: V): void {
    const entry = this._store.get(key)
    // 修改
    if (entry) {
      entry.value = value
      return
    }

    // 新增，需要处理容量
    if (this._length >= this._capacity) {
      this._removeTail()
    }
    const newEntry = new _Entry(key, value)
    this._store.set(key, newEntry)
    this._addHead(newEntry)
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

  // 将条目插入到头部
  private _addHead(entry: _Entry<K, V>): void {
    // 非首次新增
    if (this._head) {
      this._head.prev = entry
      entry.next = this._head
      this._head = entry
    } else {
      // 首个新增结点
      this._head = this._tail = entry
    }
  }

  // 移除末项
  private _removeTail(): void {
    if (this._tail) this.del(this._tail.key)
  }
}
