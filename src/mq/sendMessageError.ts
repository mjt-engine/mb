import { Bytes } from "@mjt-engine/byte";
import { Errors } from "@mjt-engine/error";
import { Msg, MsgMeta } from "./type/Msg";

export const sendMessageError =
  (message: Msg) =>
  async (error: unknown, meta: MsgMeta = {}) => {
    const errorDetail = await Errors.errorToErrorDetail({
      error,
      extra: [message.subject],
    });
    message.respond(Bytes.toMsgPack({ error: errorDetail }), {
      meta,
    });
  };
