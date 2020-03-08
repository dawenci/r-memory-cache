import { MemCache, LfuInitOptions } from './types';
export default class LfuCache<K = any, V = any> implements MemCache<K, V> {
    private _length;
    private _capacity;
    private _heap;
    private _store;
    constructor(options?: Partial<LfuInitOptions>);
    get capacity(): number;
    get length(): number;
    get(key: K): V | undefined;
    put(key: K, value: V): void;
    del(key: K): void;
    keys(): K[];
    clear(): void;
    private _parentIndex;
    private _leftIndex;
    private _swap;
    private _shiftUp;
    private _shiftDown;
}
