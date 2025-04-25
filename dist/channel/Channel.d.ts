import { AbortablePoster } from "./type/AbortablePoster";
import { AbortableListener } from "./type/AbortableListener";
import { ChannelMessage } from "./type/ChannelMessage";
export type Channel<T> = {
    postOn: (subject: string, data: T, options?: Partial<{
        signal?: AbortSignal;
        reply: string;
    }>) => void;
    listenOn: (subject: string, options?: Partial<{
        callback?: (data: T, meta: {
            finished: boolean;
        }) => T | void | AsyncIterable<T> | Promise<void> | Promise<T>;
        signal?: AbortSignal;
        once?: boolean;
    }>) => AsyncIterable<T>;
    request: (operation: string, requestData: T, options?: Partial<{
        signal: AbortSignal;
        timeoutMs: number;
    }>) => Promise<T>;
    requestMany: (operation: string, request: T, options?: Partial<{
        signal: AbortSignal;
        timeoutMs: number;
        callback?: (responseData: T) => void;
    }>) => Promise<AsyncIterable<T>>;
};
export declare const Channel: <T>({ posterProducer, listenerProducer, }: {
    posterProducer: AbortablePoster<ChannelMessage<T>>;
    listenerProducer: AbortableListener<ChannelMessage<T>>;
}) => Channel<T>;
