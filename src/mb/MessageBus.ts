import { Bytes } from "@mjt-engine/byte";
import { isUndefined } from "@mjt-engine/object";
import { Channel } from "../channel/Channel";
import { connectConnectionListenerToSubject } from "./connectConnectionListenerToSubject";
import type { ConnectionListener } from "./type/ConnectionListener";
import type { ConnectionMap } from "./type/ConnectionMap";
import { MbClient } from "./type/MbClient";
import { Msg } from "./type/Msg";

export const MessageBus = async <CM extends ConnectionMap>({
  channel,
  subscribers = {},
  options = {},
}: {
  channel: ReturnType<typeof Channel<Uint8Array>>;
  subscribers?: Partial<{ [k in keyof CM]: ConnectionListener<CM, k> }>;
  options?: Partial<{
    signal?: AbortSignal;
    log: (message: unknown, ...extra: unknown[]) => void;
    defaultTimeoutMs: number;
  }>;
}): Promise<MbClient<CM>> => {
  const { log = () => {}, defaultTimeoutMs = 60 * 1000, signal } = options;
  const entries = Object.entries(subscribers);
  log("connect: subscribers: ", entries);
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
      type MsgRequest = CM[S]["request"];
      type MsgResponse = CM[S]["response"];
      const { timeoutMs = 60 * 1000, headers, callback } = options;
      const requestData = Bytes.toMsgPack({
        data: request,
        meta: { headers },
      } satisfies Msg<MsgRequest>);

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
    },

    request: async <S extends keyof CM>(
      subject: S,
      request: CM[S]["request"],
      options: Partial<{
        timeoutMs: number;
        headers?: Record<keyof CM[S]["headers"], string>;
      }> = {}
    ): Promise<Msg<CM[S]["response"]>> => {
      type MsgRequest = CM[S]["request"];
      type MsgResponse = CM[S]["response"];
      // const { request, subject, headers, options = {} } = props;
      const { timeoutMs = defaultTimeoutMs, headers } = options;

      const requestData = Bytes.toMsgPack({
        data: request,
        meta: { headers },
      } satisfies Msg<MsgRequest>);

      const resp = await channel.request(subject as string, requestData, {
        timeoutMs,
      });

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
      return connectConnectionListenerToSubject({
        channel,
        subject: subject as string,
        connectionListener,
        options,
      });
    },
  };
};
