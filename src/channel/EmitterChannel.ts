import { isDefined } from "@mjt-engine/object";
import { Channel } from "./Channel";
import { ChannelMessage } from "./type/ChannelMessage";

export type Emitter<T = unknown> = {
  emit: (event: string, ...args: T[]) => void;
  on: (event: string, listener: (...args: T[]) => void | Promise<void>) => void;
  off: (
    event: string,
    listener: (...args: T[]) => void | Promise<void>
  ) => void;
};

export const EmitterChannel = <T>(
  emitter: Emitter<ChannelMessage<T>>,
  eventName = "channel_message"
) => {
  return Channel<T>({
    posterProducer: (signal) => {
      return (msg) => {
        if (signal?.aborted) {
          return;
        }
        emitter.emit(eventName, msg);
      };
    },
    listenerProducer: (signal) => {
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
