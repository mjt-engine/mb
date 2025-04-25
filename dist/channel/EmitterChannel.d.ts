import { Channel } from "./Channel";
import { ChannelMessage } from "./type/ChannelMessage";
import { Emitter } from "./type/Emitter";
import { Observe } from "@mjt-engine/observe";
export declare const EmitterChannel: <T = unknown>(emitter: Emitter<ChannelMessage<T>>, obs: Observe) => Channel<T>;
