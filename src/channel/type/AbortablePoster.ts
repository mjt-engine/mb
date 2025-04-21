
export type AbortablePoster<T> = (signal?: AbortSignal) => (value: T) => void;

