import { Bytes } from "@mjt-engine/byte";
import { ErrorDetail, Errors } from "@mjt-engine/error";
import { Channel } from "../channel/Channel";
import type { ConnectionListener } from "./type/ConnectionListener";
import type { ConnectionMap } from "./type/ConnectionMap";
import { isErrorMsg, Msg } from "./type/Msg";

export const connectConnectionListenerToSubject = async <
  S extends keyof CM,
  CM extends ConnectionMap
>({
  channel,
  subject,
  connectionListener,
  options = {},
}: {
  subject: S | string | RegExp;
  channel: ReturnType<typeof Channel<Uint8Array>>;
  connectionListener: ConnectionListener<CM, S>;
  options?: Partial<{
    log: (message: unknown, ...extra: unknown[]) => void;
    signal?: AbortSignal;
  }>;
}) => {
  const { log = () => {}, signal } = options;
  log("connectConnectionListenerToSubject: subject: ", subject);

  type MsgRequest = CM[S]["request"];
  // endless loop
  // transform the raw request message to the result of the connectionListener
  for await (const message of channel.listenOn(subject as string, {
    callback: async (channelData) => {
      const msg = Bytes.msgPackToObject<Msg<MsgRequest>>(channelData);
      const { data, meta } = msg;

      if (isErrorMsg(msg)) {
        console.error("Error in message: ", msg);
        throw new Error(
          `connectConnectionListenerToSubject: Unexpected error in request message: ${msg?.data?.message}`
        );
      }

      try {
        const result = await connectionListener(data, {
          headers: meta?.headers,
          signal,
        });
        return Bytes.toMsgPack({
          data: result,
        });
      } catch (error) {
        const errorDetail = Errors.errorToErrorDetail({ error });
        return Bytes.toMsgPack({
          data: errorDetail,
          meta: {
            hasError: true,
            code: 500,
            status: errorDetail.message,
          },
        } satisfies Msg<ErrorDetail>);
      }
    },
  })) {
    // we don't want the GC to clean up the channel
    // TODO stats for the connection-listener?
  }
};
