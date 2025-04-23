
export type Emitter<T = unknown> = {
  emit: (event: string, ...args: T[]) => void;
  on: (event: string, listener: (...args: T[]) => void | Promise<void>) => void;
  off: (
    event: string,
    listener: (...args: T[]) => void | Promise<void>
  ) => void;
  removeAllListeners: () => void;
};
