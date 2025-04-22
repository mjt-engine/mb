import { Channel } from "../channel/Channel";
import type { ConnectionListener } from "./type/ConnectionListener";
import type { ConnectionMap } from "./type/ConnectionMap";
export declare const connectConnectionListenerToSubject: <S extends keyof CM, CM extends ConnectionMap>({ channel, subject, connectionListener, options, }: {
    subject: S | string | RegExp;
    channel: ReturnType<typeof Channel<Uint8Array>>;
    connectionListener: ConnectionListener<CM, S>;
    options?: Partial<{
        log: (message: unknown, ...extra: unknown[]) => void;
        signal?: AbortSignal;
    }>;
}) => Promise<void>;
