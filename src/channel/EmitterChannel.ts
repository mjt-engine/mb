import { isDefined } from "@mjt-engine/object";
import { Channel } from "./Channel";
import { ChannelMessage } from "./type/ChannelMessage";
import { Emitter } from "./type/Emitter";
import { Observe } from "@mjt-engine/observe";

export const EmitterChannel = <T = unknown>(
  emitter: Emitter<ChannelMessage<T>>,
  obs: Observe
) => {
  return Channel<T>({
    obs,
    posterProducer: (signal) => (eventName) => {
      return (msg) => {
        if (signal?.aborted) {
          return;
        }
        emitter.emit(eventName, msg);
      };
    },
    listenerProducer: (signal) => (eventName) => {
      return (callback) => {
        const messageQueue: ChannelMessage<T>[] = [];
        const iterState = {
          resolve: undefined as ((value?: unknown) => void) | undefined,
        };
        const listener = async (data: ChannelMessage<T>) => {
          if (signal?.aborted) {
            return;
          }
          const resp = await callback?.(data);
          const queueData = isDefined(resp) ? resp : data;
          messageQueue.push(queueData!);
          iterState.resolve?.();
        };
        signal?.addEventListener("abort", () => {
          emitter.off(eventName, listener);
        });
        emitter.on(eventName, listener);

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
