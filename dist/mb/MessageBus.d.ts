import { Observe } from "@mjt-engine/observe";
import { Channel } from "../channel/Channel";
import type { ConnectionListener } from "./type/ConnectionListener";
import type { ConnectionMap } from "./type/ConnectionMap";
import { Msg } from "./type/Msg";
import { Serializer } from "./Serializer";
export type MessageBus<CM extends ConnectionMap, SerializedData> = {
    requestMany: <S extends keyof CM>(subject: S, request: CM[S]["request"], options?: Partial<{
        headers?: Record<keyof CM[S]["headers"], string>;
        timeoutMs: number;
        callback: (response: Msg<CM[S]["response"]>) => void | Promise<void>;
        signal?: AbortSignal;
    }>) => Promise<void>;
    request: <S extends keyof CM>(subject: S, request: CM[S]["request"], options?: Partial<{
        timeoutMs: number;
        headers?: Record<keyof CM[S]["headers"], string>;
    }>) => Promise<Msg<CM[S]["response"]>>;
    publish: <S extends keyof CM>(subject: S, request: CM[S]["request"], options?: Partial<{
        headers?: Record<keyof CM[S]["headers"], string>;
    }>) => Promise<void>;
    subscribe: <S extends keyof CM>(subject: S, listener: ConnectionListener<CM, S>, options?: Partial<{
        log: (message: unknown, ...extra: unknown[]) => void;
        signal?: AbortSignal;
    }>) => Promise<void>;
};
export declare const MessageBus: <CM extends ConnectionMap, SerializedData>({ channel, subscribers, options, obs, }: {
    channel: Channel<SerializedData>;
    subscribers?: Partial<{ [k in keyof CM]: ConnectionListener<CM, k>; }>;
    obs?: Observe;
    options?: Partial<{
        signal?: AbortSignal;
        defaultTimeoutMs: number;
        serializer: Serializer<SerializedData>;
    }>;
}) => Promise<MessageBus<CM, SerializedData>>;
