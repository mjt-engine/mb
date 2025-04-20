import { EventEmitter } from "events";
import { Channel, ChannelMessage } from "./Channels";

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
        const messageQueue: ChannelMessage<T>[] = [];
        const iterState = {
          resolve: undefined as ((value?: unknown) => void) | undefined,
        };
        const listener = (data: any) => {
          if (signal?.aborted) {
            return;
          }
          messageQueue.push(data);
          iterState.resolve?.();
          callback(data);
        };
        signal?.addEventListener("abort", () => {
          bus.off("message", listener);
        });
        bus.on("message", listener);

        return {
          [Symbol.asyncIterator]: async function* () {
            try {
              while (!signal?.aborted) {
                if (messageQueue.length > 0) {
                  yield messageQueue.shift()!;
                } else {
                  await new Promise((resolve) => {
                    iterState.resolve = resolve;
                  });
                }
              }
            } finally {
              bus.off("message", listener);
            }
          },
        } as AsyncIterable<ChannelMessage<T>>;
      };
    },
  });
};
