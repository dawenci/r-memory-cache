import { Type, MemCache, LruInitOptions, LfuInitOptions, FifoInitOptions } from './types';
declare type InitOptions = LruInitOptions | LfuInitOptions | FifoInitOptions;
export declare function createCache<K = any, V = any>(type: Type, options?: Partial<InitOptions>): MemCache<K, V>;
export {};
