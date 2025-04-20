import { EventEmitter } from "events";
import { Channel } from "./Channels";

export const EventEmitterChannel = <T>() => {
  const bus = new EventEmitter();
  return Channel<T>({
    posterProducer: (signal) => {
      return (msg) => {
        if (signal?.aborted) {
          return;
        }
        bus.emit("message", msg);
      };
    },
    listenerProducer: (signal) => {
      return (callback) => {
        const listener = (data: any) => {
          if (signal?.aborted) {
            return;
          }
          callback(data);
        };
        signal?.addEventListener("abort", () => {
          bus.off("message", listener);
        });
        bus.on("message", listener);
      };
    },
  });
};
