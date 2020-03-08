import { MemCache, FifoInitOptions } from './types';
export default class FifoCahce<K = any, V = any> implements MemCache<K, V> {
    private _capacity;
    private _length;
    private _head;
    private _tail;
    private _store;
    constructor(options?: Partial<FifoInitOptions>);
    get capacity(): number;
    get length(): number;
    get(key: K): V | undefined;
    put(key: K, value: V): void;
    del(key: K): void;
    keys(): K[];
    clear(): void;
    private _addHead;
    private _removeTail;
}
