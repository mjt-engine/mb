import { Channel } from "./Channel";
import { ChannelMessage } from "./type/ChannelMessage";
import { Emitter } from "./type/Emitter";
export declare const EmitterChannel: <T = unknown>(emitter: Emitter<ChannelMessage<T>>) => Channel<T>;
