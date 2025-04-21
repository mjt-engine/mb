import { Bytes } from "@mjt-engine/byte";
import { isUndefined } from "@mjt-engine/object";
import { Channel } from "../channel/Channels";
import { connectConnectionListenerToSubject } from "./connectConnectionListenerToSubject";
import type { ConnectionListener } from "./type/ConnectionListener";
import type { ConnectionMap } from "./type/ConnectionMap";
import type { EventMap } from "./type/EventMap";
import { MqClient } from "./type/MqClient";
import { Msg } from "./type/Msg";
import type { PartialSubject } from "./type/PartialSubject";
import type { ValueOrError } from "./type/ValueOrError";

export const connect = async <CM extends ConnectionMap>({
  channel,
  subscribers = {},
  options = {},
  signal,
}: {
  channel: ReturnType<typeof Channel<Uint8Array>>;
  subscribers?: Partial<{ [k in keyof CM]: ConnectionListener<CM, k> }>;
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
      channel,
      subject,
      connectionListener: listener,
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
      onResponse: (response: Msg<CM[S]["response"]>) => void | Promise<void>;
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
      type MsgRequest = CM[S]["request"];
      type MsgResponse = CM[S]["response"];
      const requestData = Bytes.toMsgPack({
        data: request,
        meta: { headers },
      } satisfies Msg<MsgRequest>);
      const { timeoutMs = 60 * 1000 } = options;

      // TODO: add abort signal to meta
      // if (isDefined(signal)) {
      //   const abortSubject = `abort.${Date.now()}.${crypto.randomUUID()}`;
      //   meta["headers"] = meta["headers"] || {};
      //   meta.headers["abort-subject"] = abortSubject;
      //   signal.addEventListener("abort", () => {
      //     channel.postOn(abortSubject, {
      //       data: "abort",
      //     });
      //   });
      // }

      const channelItr = await channel.requestMany({
        operation: subject as string,
        request: requestData,
        options: {
          timeOutMs: timeoutMs,
        },
      });
      for await (const respChannelData of channelItr) {
        if (signal?.aborted) {
          return;
        }
        const responseObject =
          Bytes.msgPackToObject<Msg<MsgResponse>>(respChannelData);
        await onResponse(responseObject);
      }
    },

    request: async <S extends keyof CM>(props: {
      subject: S;
      request: CM[S]["request"];
      headers?: Record<keyof CM[S]["headers"], string>;
      options?: Partial<{ timeoutMs: number }>;
    }): Promise<Msg<CM[S]["response"]>> => {
      type MsgRequest = CM[S]["request"];
      type MsgResponse = CM[S]["response"];
      const { request, subject, headers, options = {} } = props;
      const { timeoutMs = defaultTimeoutMs } = options;

      const requestData = Bytes.toMsgPack({
        data: request,
        meta: { headers },
      } satisfies Msg<MsgRequest>);

      const resp = await channel.request(subject as string, requestData, {
        timeoutMs,
      });

      return Bytes.msgPackToObject<Msg<MsgResponse>>(resp);
    },
    publish: async <S extends PartialSubject, EM extends EventMap<S>>(props: {
      subject: S;
      payload: EM[S];
      headers?: Record<keyof CM[S]["headers"], string>;
    }): Promise<void> => {
      type MsgPayload = EM[S];
      const { payload, subject, headers } = props;
      const data = Bytes.toMsgPack({
        value: payload,
      } as ValueOrError);
      const channelData = Bytes.toMsgPack({
        data: payload,
        meta: { headers },
      } satisfies Msg<MsgPayload>);

      return channel.postOn(subject, channelData);
    },
  };
};
