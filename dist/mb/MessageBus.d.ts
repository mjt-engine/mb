import { Channel } from "../channel/Channel";
import type { ConnectionListener } from "./type/ConnectionListener";
import type { ConnectionMap } from "./type/ConnectionMap";
import { MbClient } from "./type/MbClient";
export declare const MessageBus: <CM extends ConnectionMap>({ channel, subscribers, options, }: {
    channel: ReturnType<typeof Channel<Uint8Array>>;
    subscribers?: Partial<{ [k in keyof CM]: ConnectionListener<CM, k>; }>;
    options?: Partial<{
        signal?: AbortSignal;
        log: (message: unknown, ...extra: unknown[]) => void;
        defaultTimeoutMs: number;
    }>;
}) => Promise<MbClient<CM>>;
