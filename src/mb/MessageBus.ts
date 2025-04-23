import { Bytes } from "@mjt-engine/byte";
import { isUndefined } from "@mjt-engine/object";
import { Channel } from "../channel/Channel";
import { connectConnectionListenerToSubject } from "./connectConnectionListenerToSubject";
import type { ConnectionListener } from "./type/ConnectionListener";
import type { ConnectionMap } from "./type/ConnectionMap";
import { Msg } from "./type/Msg";
import { Observe } from "@mjt-engine/observe";

export type MessageBus<CM extends ConnectionMap> = {
  requestMany: <S extends keyof CM>(
    subject: S,
    request: CM[S]["request"],
    options?: Partial<{
      headers?: Record<keyof CM[S]["headers"], string>;
      timeoutMs: number;
      callback: (response: Msg<CM[S]["response"]>) => void | Promise<void>;
      signal?: AbortSignal;
    }>
  ) => Promise<void>;
  request: <S extends keyof CM>(
    subject: S,
    request: CM[S]["request"],
    options?: Partial<{
      timeoutMs: number;
      headers?: Record<keyof CM[S]["headers"], string>;
    }>
  ) => Promise<Msg<CM[S]["response"]>>;
  publish: <S extends keyof CM>(
    subject: S,
    request: CM[S]["request"],
    options?: Partial<{
      headers?: Record<keyof CM[S]["headers"], string>;
    }>
  ) => Promise<void>;
  subscribe: <S extends keyof CM>(
    subject: S,
    listener: ConnectionListener<CM, S>,
    options?: Partial<{
      log: (message: unknown, ...extra: unknown[]) => void;
      signal?: AbortSignal;
    }>
  ) => Promise<void>;
};

export const MessageBus = async <CM extends ConnectionMap>({
  channel,
  subscribers = {},
  options = {},
  obs = Observe(),
}: {
  channel: ReturnType<typeof Channel<Uint8Array>>;
  subscribers?: Partial<{ [k in keyof CM]: ConnectionListener<CM, k> }>;
  obs?: Observe;
  options?: Partial<{
    signal?: AbortSignal;
    defaultTimeoutMs: number;
  }>;
}): Promise<MessageBus<CM>> => {
  let span = obs.span("MessageBus");
  const { defaultTimeoutMs = 60 * 1000, signal } = options;
  const entries = Object.entries(subscribers);
  span.log("connect: subscribers: ", entries);
  for (const [subject, connectionListener] of entries) {
    if (isUndefined(connectionListener)) {
      continue;
    }
    connectConnectionListenerToSubject({
      channel,
      subject,
      connectionListener,
      options,
    });
  }

  return {
    requestMany: async <S extends keyof CM>(
      subject: S,
      request: CM[S]["request"],
      options: Partial<{
        timeoutMs: number;
        headers?: Record<keyof CM[S]["headers"], string>;
        callback: (response: Msg<CM[S]["response"]>) => void | Promise<void>;
        signal?: AbortSignal;
      }> = {}
    ) => {
      span = span.span("requestMany");
      type MsgRequest = CM[S]["request"];
      type MsgResponse = CM[S]["response"];
      const { timeoutMs = 60 * 1000, headers, callback } = options;
      const requestData = Bytes.toMsgPack({
        data: request,
        meta: { headers },
      } satisfies Msg<MsgRequest>);

      span = span.span("channel requestMany").log("start requestMany", subject);
      const channelItr = await channel.requestMany(
        subject as string,
        requestData,
        {
          timeoutMs,
        }
      );
      for await (const respChannelData of channelItr) {
        if (signal?.aborted) {
          return;
        }
        const responseObject =
          Bytes.msgPackToObject<Msg<MsgResponse>>(respChannelData);
        await callback?.(responseObject);
      }
      span.end();
    },

    request: async <S extends keyof CM>(
      subject: S,
      request: CM[S]["request"],
      options: Partial<{
        timeoutMs: number;
        headers?: Record<keyof CM[S]["headers"], string>;
      }> = {}
    ): Promise<Msg<CM[S]["response"]>> => {
      span = span.span("request").log("subject", subject);
      type MsgRequest = CM[S]["request"];
      type MsgResponse = CM[S]["response"];
      const { timeoutMs = defaultTimeoutMs, headers } = options;

      const requestData = Bytes.toMsgPack({
        data: request,
        meta: { headers },
      } satisfies Msg<MsgRequest>);

      const innerSpan = span
        .span("channel request")
        .log("requestData", requestData);
      const resp = await channel.request(subject as string, requestData, {
        timeoutMs,
      });
      innerSpan.end();
      span.end();

      return Bytes.msgPackToObject<Msg<MsgResponse>>(resp);
    },
    publish: async <S extends keyof CM>(
      subject: S,
      request: CM[S]["request"],
      options: Partial<{
        headers?: Record<keyof CM[S]["headers"], string>;
      }> = {}
    ): Promise<void> => {
      type MsgRequest = CM[S]["request"];
      const { headers } = options;
      const channelData = Bytes.toMsgPack({
        data: request,
        meta: { headers },
      } satisfies Msg<MsgRequest>);
      span.span("publish").log("subject", subject);

      return channel.postOn(subject as string, channelData);
    },
    subscribe: async <S extends keyof CM>(
      subject: S,
      connectionListener: ConnectionListener<CM, S>,
      options: Partial<{
        log: (message: unknown, ...extra: unknown[]) => void;
        signal?: AbortSignal;
      }> = {}
    ): Promise<void> => {
      span.span("subscribe").log("subject", subject);
      return connectConnectionListenerToSubject({
        channel,
        subject: subject as string,
        connectionListener,
        options,
      });
    },
  };
};
