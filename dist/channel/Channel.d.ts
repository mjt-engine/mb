import { AbortablePoster } from "./type/AbortablePoster";
import { AbortableListener } from "./type/AbortableListener";
import { ChannelMessage } from "./type/ChannelMessage";
export declare const Channel: <T>({ posterProducer, listenerProducer, }: {
    posterProducer: AbortablePoster<ChannelMessage<T>>;
    listenerProducer: AbortableListener<ChannelMessage<T>>;
}) => {
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
    }>) => AsyncGenerator<Awaited<T>, void, unknown>;
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
