export interface MemCache<K, V> {
    capacity: number;
    length: number;
    get: (key: K) => V | undefined;
    put: (key: K, value: V) => void;
    del: (key: K) => void;
    clear: () => void;
    keys: () => K[];
}
export interface LruInitOptions {
    capacity: number;
}
export interface LfuInitOptions {
    capacity: number;
}
export interface FifoInitOptions {
    capacity: number;
}
export declare type Type = 'LRU' | 'FIFO' | 'LFU';
