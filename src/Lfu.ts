import { MemCache, LfuInitOptions } from './types'
import { CAPACITY } from './config'

class _Entry<K, V> {
  key: K
  value: V
  freq: number
  constructor(key: K, value: V) {
    this.key = key
    this.value = value
    // 使用次数
    this.freq = 1
  }
}

export default class LfuCache<K = any, V = any> implements MemCache<K, V> {
  private _length: number
  private _capacity: number
  // 小顶堆
  private _heap: _Entry<K, V>[]
  // key 和数据在小顶堆中的 index 的映射
  private _store: Map<K, number>

  constructor(options: Partial<LfuInitOptions> = {}) {
    this._capacity = options.capacity || CAPACITY
    this._heap = new Array(this._capacity)
    this._store = new Map<K, number>()
    this._length = 0
  }

  get type() {
    return 'LFU'
  }

  get capacity() {
    return this._capacity
  }

  get length() {
    return this._length
  }

  get(key: K): V | undefined {
    const index = this._store.get(key)
    if (index == null) return undefined

    const entry = this._heap[index]

    // 使用次数 +1，并调整堆
    entry.freq += 1
    this._shiftDown(index)

    return entry.value
  }

  put(key: K, value: V): void {
    // 数据已存在，修改
    const index = this._store.get(key)
    if (index != null) {
      const entry = this._heap[index]
      entry.value = value

      // 使用次数 +1，并调整堆
      entry.freq += 1
      this._shiftDown(index)

      return
    }

    // 新增
    const entry = new _Entry(key, value)

    // 容量不足，则使用新条目替换掉堆顶条目，并下沉
    if (this._length >= this._capacity) {
      // 更新堆顶，以及 map
      const oldTop = this._heap[0]
      this._heap[0] = entry
      this._store.delete(oldTop.key)
      this._store.set(key, 0)

      // 下沉处理
      this._shiftDown(0)

      return
    }

    // 容量足够，则插入到末尾，然后上浮
    const lastIndex = this._length
    this._heap[lastIndex] = entry
    this._store.set(key, lastIndex)

    // 上浮
    this._shiftUp(lastIndex)

    this._length += 1
  }

  del(key: K): void {
    const index = this._store.get(key)
    if (index != null) {
      const lastIndex = this._length - 1
      this._swap(index, lastIndex)
      delete this._heap[lastIndex]
      this._store.delete(key)
      this._length -= 1
      this._shiftDown(index)
    }
  }

  keys(): K[] {
    return [...this._store.keys()]
  }

  clear(): void {
    this._length = 0
    this._heap = new Array(this._capacity)
    this._store.clear()
  }

  private _parentIndex(index: number) {
    return Math.floor((index - 1) / 2)
  }

  private _leftIndex(index: number) {
    return index * 2 + 1
  }

  // 交换堆中两个位置的数据
  private _swap(i1: number, i2: number) {
    const entry1 = this._heap[i1]
    const entry2 = this._heap[i2]

    this._heap[i1] = entry2
    this._store.set(entry2.key, i1)

    this._heap[i2] = entry1
    this._store.set(entry1.key, i2)
  }

  // 上浮逻辑
  private _shiftUp(index: number) {
    while (true) {
      // 已上浮到顶部了，停止
      if (index === 0) break
      const parentIndex = this._parentIndex(index)
      // 已经比父节点大了，停止
      // 跟父节点一样大，也停止（后插入的结点，晚删除）
      if (this._heap[index].freq >= this._heap[parentIndex].freq) break
      // 父子交换位置
      this._swap(index, parentIndex)
      index = parentIndex
    }
  }

  // 下沉逻辑
  private _shiftDown(index: number) {
    const size = this._length
    while (true) {
      const leftIndex = this._leftIndex(index)
      // 左孩子都不存在，则当前已经是堆底，调整完毕
      if (leftIndex >= size) break

      // 较小的子结点 index
      let childIndex = leftIndex

      // 检测是否存在右孩子
      if (leftIndex < size - 1) {
        const rightIndex = leftIndex + 1
        // 找出比较小的孩子的序号
        if (this._heap[leftIndex].freq > this._heap[rightIndex].freq) childIndex = rightIndex
      }

      // 父节点已经小于两个孩子，则已经找到合适的位置，调整完毕
      // 等于的时候，也交换，新插入或最近使用的晚删
      if (this._heap[index].freq < this._heap[childIndex].freq) break

      // 交换父子
      this._swap(index, childIndex)
      index = childIndex
    }
  }
}
