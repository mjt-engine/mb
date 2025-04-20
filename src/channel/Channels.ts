type AbortableProducer<T> = (signal?: AbortSignal) => (value: T) => void;
type AbortableListener<T> = (
  signal?: AbortSignal
) => (callback: (value: T) => void) => void;

type Msg<T> = {
  subject: string;
  data: T;
  reply?: string;
  finished?: boolean;
};

export const Channel = <T>({
  posterProducer,
  listenerProducer,
}: {
  posterProducer: AbortableProducer<Msg<T>>;
  listenerProducer: AbortableListener<Msg<T>>;
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
    listenOn: (
      subject: string | RegExp,
      callback: (
        data: T,
        meta: { finished: boolean }
      ) => T | void | AsyncIterable<T>,
      options: Partial<{
        signal?: AbortSignal;
        once?: boolean;
      }> = {}
    ) => {
      const { signal, once } = options;
      const abortCotroller = new AbortController();
      signal?.addEventListener("abort", () => {
        abortCotroller.abort();
      });
      listenerProducer(abortCotroller.signal)((msg) => {
        if (
          typeof subject === "string"
            ? msg.subject === subject
            : subject.test(msg.subject)
        ) {
          const resp = callback(msg.data, { finished: msg.finished ?? false });
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

                // Send an undefined message to indicate completion
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
        }
      });
      return signal;
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
            resolve(responseData);
          },
          { signal, once: true }
        );
        mod.postOn(operation, requestData, { reply: responseSubject, signal });
      });
    },
    requestMany: async ({
      operation,
      requestData,
      callback,
      options = {},
    }: {
      operation: string;
      requestData: T;
      callback: (responseData: T) => void;
      options?: Partial<{ signal: AbortSignal; timeOutMs: number }>;
    }): Promise<void> => {
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
          (responseData, meta) => {
            if (responseData !== undefined) {
              callback(responseData);
            }
            if (meta.finished) {
              clearTimeout(timeoutId!);
              return resolve();
            }
          },
          { signal }
        );
        mod.postOn(operation, requestData, { reply: responseSubject, signal });
      });
    },
  };
  return mod;
};
function isAsyncIterable<T = unknown>(obj: any): obj is AsyncIterable<T> {
  return obj != null && typeof obj[Symbol.asyncIterator] === "function";
}
