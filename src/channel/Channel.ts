import { AbortablePoster } from "./type/AbortablePoster";
import { AbortableListener } from "./type/AbortableListener";
import { ChannelMessage } from "./type/ChannelMessage";

export type Channel<T> = {
  postOn: (
    subject: string,
    data: T,
    options?: Partial<{
      signal?: AbortSignal;
      reply: string;
    }>
  ) => void;
  listenOn: (
    subject: string,
    options?: Partial<{
      callback?: (
        data: T,
        meta: { finished: boolean }
      ) => T | void | AsyncIterable<T> | Promise<void> | Promise<T>;
      signal?: AbortSignal;
      once?: boolean;
    }>
  ) => AsyncIterable<T>;
  request: (
    operation: string,
    requestData: T,
    options?: Partial<{
      signal: AbortSignal;
      timeoutMs: number;
    }>
  ) => Promise<T>;
  requestMany: (
    operation: string,
    request: T,
    options?: Partial<{
      signal: AbortSignal;
      timeoutMs: number;
      callback?: (responseData: T) => void;
    }>
  ) => Promise<AsyncIterable<T>>;
};

export const Channel = <T>({
  posterProducer,
  listenerProducer,
}: {
  posterProducer: AbortablePoster<ChannelMessage<T>>;
  listenerProducer: AbortableListener<ChannelMessage<T>>;
}): Channel<T> => {
  const mod: Channel<T> = {
    postOn: (
      subject: string,
      data: T,
      options: Partial<{
        signal?: AbortSignal;
        reply: string;
      }> = {}
    ): void => {
      const { signal, reply } = options;
      posterProducer(signal)(subject)({ subject, data, reply });
    },
    listenOn: function (
      subject: string,
      options: Partial<{
        callback?: (
          data: T,
          meta: { finished: boolean }
        ) => T | void | AsyncIterable<T> | Promise<void> | Promise<T>;
        signal?: AbortSignal;
        once?: boolean;
      }> = {}
    ) {
      const { signal, once, callback } = options;
      const abortCotroller = new AbortController();
      if (signal?.aborted) {
        throw new Error(`listenOn: Signal is already aborted for ${subject}`);
      }
      signal?.addEventListener("abort", () => {
        abortCotroller.abort();
      });
      const itr = listenerProducer(abortCotroller.signal)(subject)(
        async (msg) => {
          if (
            msg.subject === subject
            // typeof subject === "string"
            // ? msg.subject === subject
            // : subject.test(msg.subject)
          ) {
            if (once) {
              abortCotroller.abort();
            }
            const resp = await callback?.(msg.data, {
              finished: msg.finished ?? false,
            });

            if (msg.reply && resp) {
              if (!isAsyncIterable(resp)) {
                posterProducer(abortCotroller.signal)(msg.reply)({
                  subject: msg.reply,
                  data: resp,
                  finished: true,
                });
              } else {
                (async () => {
                  for await (const item of resp) {
                    posterProducer(abortCotroller.signal)(msg.reply!)({
                      subject: msg.reply!,
                      data: item!,
                    });
                  }

                  // Send a finished/undefined data message to indicate completion
                  posterProducer(abortCotroller.signal)(msg.reply!)({
                    subject: msg.reply!,
                    data: undefined!,
                    finished: true,
                  });
                })();
              }
            }
            if (resp && !isAsyncIterable(resp)) {
              return { ...msg, data: resp };
            }
          }
          return msg;
        }
      );
      return (async function* () {
        for await (const msg of itr) {
          yield msg.data;
        }
      })();
    },
    request: async (
      operation: string,
      requestData: T,
      options: Partial<{ signal: AbortSignal; timeoutMs: number }> = {}
    ): Promise<T> => {
      const { signal, timeoutMs } = options;
      const responseSubject = `response-${Date.now()}-${crypto.randomUUID()}`;
      return new Promise((resolve, reject) => {
        if (signal?.aborted) {
          reject(
            new Error(`request: Signal is already aborted for ${operation}`)
          );
        }
        signal?.addEventListener("abort", () => {
          reject(new Error("Request aborted"));
        });

        let timeoutId: ReturnType<typeof setTimeout> | undefined;

        if (timeoutMs) {
          timeoutId = setTimeout(() => {
            reject(
              new Error(
                `request: Request timed out after ${timeoutMs}ms for ${operation}`
              )
            );
          }, timeoutMs);
        }

        mod.listenOn(responseSubject, {
          callback: (responseData) => {
            clearTimeout(timeoutId!);
            resolve(responseData);
          },
          signal,
          once: true,
        });
        mod.postOn(operation, requestData, { reply: responseSubject, signal });
      });
    },
    requestMany: async (
      operation: string,
      request: T,
      options: Partial<{
        signal: AbortSignal;
        timeoutMs: number;
        callback?: (responseData: T) => void;
      }> = {}
    ): Promise<AsyncIterable<T>> => {
      const { signal, timeoutMs, callback } = options;
      const responseSubject = `response-${Date.now()}-${crypto.randomUUID()}`;
      return new Promise((resolve, reject) => {
        if (signal?.aborted) {
          reject(
            new Error(`requestMany: Signal is already aborted for ${operation}`)
          );
        }
        signal?.addEventListener("abort", () => {
          reject(new Error("Request aborted"));
        });

        let timeoutId: ReturnType<typeof setTimeout> | undefined;

        if (timeoutMs) {
          timeoutId = setTimeout(() => {
            reject(
              new Error(
                `requestMany: Request timed out after ${timeoutMs}ms for ${operation}`
              )
            );
          }, timeoutMs);
        }

        const itr = mod.listenOn(responseSubject, {
          callback: (responseData, meta) => {
            if (responseData !== undefined) {
              callback?.(responseData);
            }
            if (meta.finished) {
              clearTimeout(timeoutId!);
              return resolve(itr);
            }
          },

          signal,
        });
        mod.postOn(operation, request, { reply: responseSubject, signal });
        return itr;
      });
    },
  };
  return mod;
};

function isAsyncIterable<T = unknown>(obj: any): obj is AsyncIterable<T> {
  return obj != null && typeof obj[Symbol.asyncIterator] === "function";
}
