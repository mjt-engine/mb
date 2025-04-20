import { Bytes } from "@mjt-engine/byte";
import { isDefined, isUndefined } from "@mjt-engine/object";
import { Errors } from "@mjt-engine/error";
import { msgMetaToHeadersRecord } from "./msgMetaToHeadersRecord";
import { sendMessageError } from "./sendMessageError";
import type { ConnectionListener } from "./type/ConnectionListener";
import type { ConnectionMap } from "./type/ConnectionMap";
import { MqRuntime } from "./type/MqConnection";
import type { ValueOrError } from "./type/ValueOrError";

export const connectConnectionListenerToSubject = async <
  S extends keyof CM,
  CM extends ConnectionMap,
  E extends Record<string, string>
>({
  connection,
  subject,
  listener,
  options = {},
  env = {},
  signal,
}: {
  subject: string;
  connection: MqRuntime;
  listener: ConnectionListener<CM, S, E>;
  options?: Partial<{
    queue?: string;
    maxMessages?: number;
    timeout?: number;
    log: (message: unknown, ...extra: unknown[]) => void;
  }>;
  env?: Partial<E>;
  signal?: AbortSignal;
}) => {
  const { log = () => {}, queue, maxMessages, timeout } = options;
  log("connectConnectionListenerToSubject: subject: ", subject);
  const subscription = connection.subscribe(subject, {
    queue,
    max: maxMessages,
    timeout,
  });

  if (isDefined(signal)) {
    if (signal.aborted) {
      subscription.unsubscribe();
      throw new Error("Signal already in aborted state");
    }
    signal.addEventListener("abort", () => {
      subscription.unsubscribe();
    });
  }

  for await (const message of subscription) {
    try {
      const valueOrError = Bytes.msgPackToObject<
        ValueOrError<CM[S]["request"]>
      >(message.data as Uint8Array);
      const requestHeaders = msgMetaToHeadersRecord(
        message.meta
      ) as CM[S]["headers"];
      const abortController = new AbortController();
      if (isDefined(requestHeaders?.["abort-subject"])) {
        const abortSubject = requestHeaders["abort-subject"];
        const abortSubscription = connection.subscribe(abortSubject, {
          max: 1,
          callback: () => {
            abortController.abort();
            abortSubscription.unsubscribe();
            message.respond(); // Acknowledge the abort
          },
        });
      }
      const send = (
        response?: CM[S]["response"],
        options: Partial<{
          code: number;
          codeDescription: string;
          headers: Record<string, string>;
        }> = {}
      ) => {
        if (isUndefined(response)) {
          connection.publish(message.reply!);
          return;
        }
        const responseMsg = Bytes.toMsgPack({
          value: response,
        } as ValueOrError);
        message.respond(responseMsg, {
          // headers: responseHeaders,

          meta: options.headers,
        });
      };

      const sendError = async (
        error: unknown,
        options: Partial<{
          code: number;
          codeDescription: string;
          headers: Record<string, string>;
        }> = {}
      ) => sendMessageError(message)(error, options);

      const unsubscribe = (maxMessages?: number) =>
        subscription.unsubscribe(maxMessages);

      if (isDefined(valueOrError.error)) {
        log(
          "Error: connectListenerToSubscription: valueOrError.error",
          valueOrError.error
        );
        continue;
      }

      const result = await listener({
        detail: valueOrError.value,
        headers: requestHeaders,
        env,
        signal: abortController.signal,
        send,
        sendError,
        unsubscribe,
      });
      const reply = message.reply;
      if (isUndefined(reply)) {
        continue;
      }
      send(result);
    } catch (error) {
      const errorDetail = await Errors.errorToErrorDetail({
        error,
        extra: [message.subject],
      });
      log(errorDetail);
      sendMessageError(message)(error);
    }
  }
};
