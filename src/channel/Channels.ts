import { Bytes } from "@mjt-engine/byte";

type AbortableProducer<T> = (signal?: AbortSignal) => (value: T) => void;
type AbortableListener<T> = (
  signal?: AbortSignal
) => (callback?: (value: T) => T | void) => AsyncIterable<T>;

export type ChannelMessage<T> = {
  subject: string;
  data: T;
  reply?: string;
  finished?: boolean;
};

export const Channel = <T>({
  posterProducer,
  listenerProducer,
}: {
  posterProducer: AbortableProducer<ChannelMessage<T>>;
  listenerProducer: AbortableListener<ChannelMessage<T>>;
}) => {
  const mod = {
    postOn: (
      subject: string,
      data: T,
      options: Partial<{
        signal?: AbortSignal;
        reply: string;
      }> = {}
    ): void => {
      const { signal, reply } = options;
      posterProducer(signal)({ subject, data, reply });
    },
    listenOn: function (
      subject: string | RegExp,
      callback?: (
        data: T,
        meta: { finished: boolean }
      ) => T | void | AsyncIterable<T>,
      options: Partial<{
        signal?: AbortSignal;
        once?: boolean;
      }> = {}
    ) {
      const { signal, once } = options;
      const abortCotroller = new AbortController();
      signal?.addEventListener("abort", () => {
        abortCotroller.abort();
      });
      const itr = listenerProducer(abortCotroller.signal)((msg) => {
        if (
          typeof subject === "string"
            ? msg.subject === subject
            : subject.test(msg.subject)
        ) {
          const resp = callback?.(msg.data, {
            finished: msg.finished ?? false,
          });
          if (msg.reply && resp) {
            if (!isAsyncIterable(resp)) {
              posterProducer(abortCotroller.signal)({
                subject: msg.reply,
                data: resp,
                finished: true,
              });
            } else {
              (async () => {
                for await (const item of resp) {
                  posterProducer(abortCotroller.signal)({
                    subject: msg.reply!,
                    data: item!,
                  });
                }

                // Send a finished/undefined data message to indicate completion
                posterProducer(abortCotroller.signal)({
                  subject: msg.reply!,
                  data: undefined!,
                  finished: true,
                });
              })();
            }
            if (once) {
              abortCotroller.abort();
            }
          }
          if (resp && !isAsyncIterable(resp)) {
            return { ...msg, data: resp };
          }
        }
        return msg;
      });
      return (async function* () {
        for await (const msg of itr) {
          if (
            typeof subject === "string"
              ? msg.subject === subject
              : subject.test(msg.subject)
          ) {
            yield msg.data;
          }
        }
      })();
    },
    request: async (
      operation: string,
      requestData: T,
      options: Partial<{ signal: AbortSignal; timeOutMs: number }> = {}
    ): Promise<T> => {
      const { signal, timeOutMs } = options;
      const responseSubject = `response-${Date.now()}-${crypto.randomUUID()}`;
      return new Promise((resolve, reject) => {
        signal?.addEventListener("abort", () => {
          reject(new Error("Request aborted"));
        });

        let timeoutId: ReturnType<typeof setTimeout> | undefined;

        if (timeOutMs) {
          timeoutId = setTimeout(() => {
            reject(new Error("Request timed out"));
          }, timeOutMs);
        }

        mod.listenOn(
          responseSubject,
          (responseData) => {
            clearTimeout(timeoutId!);
            if (responseData && responseData instanceof Uint8Array) {
              const r = Bytes.msgPackToObject<string>(
                responseData as Uint8Array
              );
              console.log("CHANNEL Response received:", r);
            }
            // .then((data) => {})
            // Bytes.msgPackToObject(responseData).then((data) => {
            //   console.log("Response received:", data);
            // });
            // Bytes.msgPackToObject([]).then((data) => {});
            // console.log("Response received:", await Bytes.msgPackToObject(responseData));
            resolve(responseData);
          },
          { signal, once: true }
        );
        mod.postOn(operation, requestData, { reply: responseSubject, signal });
      });
    },
    requestMany: async ({
      operation,
      request,
      callback,
      options = {},
    }: {
      operation: string;
      request: T;
      callback?: (responseData: T) => void;
      options?: Partial<{ signal: AbortSignal; timeOutMs: number }>;
    }): Promise<AsyncIterable<T>> => {
      const { signal, timeOutMs } = options;
      const responseSubject = `response-${Date.now()}-${crypto.randomUUID()}`;
      return new Promise((resolve, reject) => {
        signal?.addEventListener("abort", () => {
          reject(new Error("Request aborted"));
        });

        let timeoutId: ReturnType<typeof setTimeout> | undefined;

        if (timeOutMs) {
          timeoutId = setTimeout(() => {
            reject(new Error("Request timed out"));
          }, timeOutMs);
        }

        const itr = mod.listenOn(
          responseSubject,
          (responseData, meta) => {
            if (responseData !== undefined) {
              callback?.(responseData);
            }
            if (meta.finished) {
              clearTimeout(timeoutId!);
              return resolve(itr);
            }
          },
          { signal }
        );
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
