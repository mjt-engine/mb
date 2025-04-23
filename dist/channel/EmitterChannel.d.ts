import { ChannelMessage } from "./type/ChannelMessage";
export type Emitter<T = unknown> = {
    emit: (event: string, ...args: T[]) => void;
    on: (event: string, listener: (...args: T[]) => void | Promise<void>) => void;
    off: (event: string, listener: (...args: T[]) => void | Promise<void>) => void;
};
export declare const EmitterChannel: <T>(emitter: Emitter<ChannelMessage<T>>) => {
    postOn: (subject: string, data: T, options?: Partial<{
        signal?: AbortSignal;
        reply: string;
    }>) => void;
    listenOn: (subject: string, options?: Partial<{
        callback?: ((data: T, meta: {
            finished: boolean;
        }) => void | Promise<void> | T | AsyncIterable<T> | Promise<T>) | undefined;
        signal?: AbortSignal;
        once?: boolean;
    }>) => AsyncGenerator<Awaited<T>, void, unknown>;
    request: (operation: string, requestData: T, options?: Partial<{
        signal: AbortSignal;
        timeoutMs: number;
    }>) => Promise<T>;
    requestMany: (operation: string, request: T, options?: Partial<{
        signal: AbortSignal;
        timeoutMs: number;
        callback?: ((responseData: T) => void) | undefined;
    }>) => Promise<AsyncIterable<T>>;
};
