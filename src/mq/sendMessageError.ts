import { Bytes } from "@mjt-engine/byte";
import { Errors } from "@mjt-engine/error";
import { Payload } from "./type/MqConnection";
import { Msg, MsgMeta } from "./type/Msg";

export const sendMessageError =
  (send: (value: Payload, meta: MsgMeta) => void) =>
  (message: Msg, meta: MsgMeta = {}) =>
  async (error: unknown) => {
    const errorDetail = await Errors.errorToErrorDetail({
      error,
      extra: [message],
    });
    send(Bytes.toMsgPack({ error: errorDetail }), {
      hasError: true,
      status: errorDetail.message,
      code: 500,
      ...meta,
    });
  };
