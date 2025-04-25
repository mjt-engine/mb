import { Channel } from "./Channel";
import { ChannelMessage } from "./type/ChannelMessage";
import { Emitter } from "./type/Emitter";
export declare const EmitterChannel: <T>(emitter: Emitter<ChannelMessage<T>>) => Channel<T>;
