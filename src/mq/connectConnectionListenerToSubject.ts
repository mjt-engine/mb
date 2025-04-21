import { Bytes } from "@mjt-engine/byte";
import { Errors } from "@mjt-engine/error";
import { Channel } from "../channel/Channels";
import type { ConnectionListener } from "./type/ConnectionListener";
import type { ConnectionMap } from "./type/ConnectionMap";
import { Msg } from "./type/Msg";
import { isError, type ValueOrError } from "./type/ValueOrError";

export const connectConnectionListenerToSubject = async <
  S extends keyof CM,
  CM extends ConnectionMap
>({
  channel,
  subject,
  connectionListener,
  options = {},
  signal,
}: {
  subject: string;
  channel: ReturnType<typeof Channel<Msg>>;
  connectionListener: ConnectionListener<CM, S>;
  options?: Partial<{
    log: (message: unknown, ...extra: unknown[]) => void;
  }>;
  signal?: AbortSignal;
}) => {
  const { log = () => {} } = options;
  log("connectConnectionListenerToSubject: subject: ", subject);

  // endless loop
  // transform the raw request message to the result of the connectionListener
  for await (const message of channel.listenOn(subject, async (rawReqMsg) => {
    const { data, meta } = rawReqMsg;

    const valueOrError = Bytes.msgPackToObject<ValueOrError<CM[S]["request"]>>(
      data as Uint8Array
    );
    if (isError(valueOrError)) {
      console.error("Error in message: ", valueOrError);
      throw new Error(
        "connectConnectionListenerToSubject: Error in request body"
      );
    }

    try {
      const result = await connectionListener(valueOrError.value, {
        headers: meta?.headers,
        signal,
      });
      const responseMsg = Bytes.toMsgPack({
        value: result,
      } as ValueOrError);
      return {
        data: responseMsg,
      };
    } catch (error) {
      const responseMsg = Bytes.toMsgPack({
        error: Errors.errorToErrorDetail({ error }),
      } as ValueOrError);
      return {
        data: responseMsg,
      };
    }
  })) {
    // we don't want the GC to clean up the channel
  }
};
