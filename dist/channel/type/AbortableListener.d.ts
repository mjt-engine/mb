export type AbortableListener<T> = (signal?: AbortSignal) => (selector: string) => (callback: (value: T) => T | void | Promise<void> | Promise<T>) => AsyncIterable<T>;
