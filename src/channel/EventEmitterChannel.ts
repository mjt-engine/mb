import { EventEmitter } from "events";
import { Channel, ChannelMessage } from "./Channels";
import { isDefined } from "@mjt-engine/object";

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
        const listener = (data: ChannelMessage<T>) => {
          if (signal?.aborted) {
            return;
          }
          const resp = callback?.(data);
          const queueData = isDefined(resp) ? resp : data;

          messageQueue.push(queueData!);
          iterState.resolve?.();
        };
        signal?.addEventListener("abort", () => {
          bus.off("message", listener);
        });
        bus.on("message", listener);

        return {
          [Symbol.asyncIterator]: async function* () {
            while (!signal?.aborted) {
              if (messageQueue.length > 0) {
                yield messageQueue.shift()!;
              } else {
                await new Promise((resolve) => {
                  iterState.resolve = resolve;
                });
              }
            }
          },
        } as AsyncIterable<ChannelMessage<T>>;
      };
    },
  });
};
