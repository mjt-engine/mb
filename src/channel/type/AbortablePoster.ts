export type AbortablePoster<T> = (
  signal?: AbortSignal
) => (selector: string) => (value: T) => void;
