import { Bytes } from "@mjt-engine/byte";
import { isDefined, isUndefined } from "@mjt-engine/object";
import { connectConnectionListenerToSubject } from "./connectConnectionListenerToSubject";
import { msgToResponseData } from "./msgToResponseData";
import { recordToMsgMeta } from "./recordToMsgMeta";
import type { ConnectionListener } from "./type/ConnectionListener";
import type { ConnectionMap } from "./type/ConnectionMap";
import type { EventMap } from "./type/EventMap";
import { MqRuntime } from "./type/MqConnection";
import type { PartialSubject } from "./type/PartialSubject";
import type { ValueOrError } from "./type/ValueOrError";

export type MqClient<CM extends ConnectionMap> = {
  requestMany: <S extends keyof CM>(props: {
    subject: S;
    request: CM[S]["request"];
    headers?: Record<keyof CM[S]["headers"], string>;
    options?: Partial<{ timeoutMs: number }>;
    onResponse: (response: CM[S]["response"]) => void | Promise<void>;
    signal?: AbortSignal;
  }) => Promise<void>;
  request: <S extends keyof CM>(props: {
    subject: S;
    request: CM[S]["request"];
    headers?: Record<keyof CM[S]["headers"], string>;
    options?: Partial<{ timeoutMs: number }>;
  }) => Promise<CM[S]["response"]>;
  publish: <S extends PartialSubject, EM extends EventMap<S>>(props: {
    subject: S;
    payload: EM[S];
    headers?: Record<keyof CM[S]["headers"], string>;
  }) => Promise<void>;
};

export const connect = async <
  CM extends ConnectionMap,
  E extends Record<string, string> = Record<string, string>
>({
  runtime,
  subscribers = {},
  options = {},
  signal,
}: {
  runtime: MqRuntime;
  subscribers?: Partial<{ [k in keyof CM]: ConnectionListener<CM, k, E> }>;
  signal?: AbortSignal;
  options?: Partial<{
    log: (message: unknown, ...extra: unknown[]) => void;
    defaultTimeoutMs: number;
  }>;
}): Promise<MqClient<CM>> => {
  const { log = () => {}, defaultTimeoutMs = 60 * 1000 } = options;
  const entries = Object.entries(subscribers);
  log("connect: subscribers: ", entries);
  for (const [subject, listener] of entries) {
    if (isUndefined(listener)) {
      continue;
    }
    connectConnectionListenerToSubject({
      connection: runtime,
      subject,
      listener,
      options,
      signal,
    });
  }

  return {
    requestMany: async <S extends keyof CM>(props: {
      subject: S;
      request: CM[S]["request"];
      headers?: Record<keyof CM[S]["headers"], string>;
      options?: Partial<{ timeoutMs: number }>;
      onResponse: (response: CM[S]["response"]) => void | Promise<void>;
      signal?: AbortSignal;
    }) => {
      const {
        request,
        subject,
        headers,
        options = {},
        onResponse,
        signal,
      } = props;
      const requestMsg = Bytes.toMsgPack({
        value: request,
      } as ValueOrError);
      const { timeoutMs = 60 * 1000 } = options;

      const hs = recordToMsgMeta(headers);
      if (isDefined(signal)) {
        const abortSubject = `abort.${Date.now()}.${crypto.randomUUID()}`;
        hs["headers"] = hs["headers"] || {};
        hs.headers["abort-subject"] = abortSubject;
        signal.addEventListener("abort", () => {
          runtime.publish(abortSubject);
        });
      }

      const iterable = await runtime.requestMany(
        subject as string,
        requestMsg,
        {
          maxWait: timeoutMs,
          meta: hs,
        }
      );
      for await (const resp of iterable) {
        iterable;
        if (signal?.aborted) {
          return;
        }
        if (isUndefined(resp.data) || resp.data.byteLength === 0) {
          break;
        }
        const responseData = await msgToResponseData({
          msg: resp,
          subject,
          request,
          log,
        });
        await onResponse(responseData);
      }
    },

    request: async <S extends keyof CM>(props: {
      subject: S;
      request: CM[S]["request"];
      headers?: Record<keyof CM[S]["headers"], string>;
      options?: Partial<{ timeoutMs: number }>;
    }): Promise<CM[S]["response"]> => {
      const { request, subject, headers, options = {} } = props;
      const requestMsg = Bytes.toMsgPack({
        value: request,
      } as ValueOrError);
      const { timeoutMs = defaultTimeoutMs } = options;

      const meta = recordToMsgMeta(headers);

      const resp = await runtime.request(subject as string, requestMsg, {
        timeout: timeoutMs,
        meta,
      });
      if (isUndefined(resp.data) || resp.data.byteLength === 0) {
        return undefined;
      }
      return msgToResponseData({ msg: resp, subject, request, log });
    },
    publish: async <S extends PartialSubject, EM extends EventMap<S>>(props: {
      subject: S;
      payload: EM[S];
      headers?: Record<keyof CM[S]["headers"], string>;
    }): Promise<void> => {
      const { payload, subject, headers } = props;
      const msg = Bytes.toMsgPack({
        value: payload,
      } as ValueOrError);

      return runtime.publish(subject as string, msg, {
        meta: headers,
      });
    },
  };
};
