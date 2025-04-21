export type AbortableListener<T> = (signal?: AbortSignal) => (callback?: (value: T) => T | void | Promise<void> | Promise<T>) => AsyncIterable<T>;
