import { Channel } from "../channel/Channel";
import type { ConnectionListener } from "./type/ConnectionListener";
import type { ConnectionMap } from "./type/ConnectionMap";
import { Serializer } from "./type/Serializer";
export declare const connectConnectionListenerToSubject: <S extends keyof CM, CM extends ConnectionMap, SerializedData = unknown>({ channel, subject, connectionListener, serializer, options, }: {
    subject: S | string | RegExp;
    channel: ReturnType<typeof Channel<SerializedData>>;
    serializer: Serializer<SerializedData>;
    connectionListener: ConnectionListener<CM, S>;
    options?: Partial<{
        log: (message: unknown, ...extra: unknown[]) => void;
        signal?: AbortSignal;
    }>;
}) => Promise<void>;
