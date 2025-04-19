import { Bytes } from "@mjt-engine/byte";
import type { ValueOrError } from "./type/ValueOrError";
import { isDefined } from "@mjt-engine/object";
import { Errors } from "@mjt-engine/error";
import { Msg } from "./type/Msg";

export const msgToResponseData = async ({
  msg,
  subject,
  request,
  log,
}: {
  msg: Msg;
  subject: unknown;
  request: unknown;
  log: (message: unknown, ...extra: unknown[]) => void;
}) => {
  const responseData = Bytes.msgPackToObject<ValueOrError>(
    new Uint8Array(msg.data)
  );
  if (msg.meta?.hasError) {
    log("Error: msgToResponseData: msg.headers.hasError", {
      headers: msg.meta,
      responseData,
    });
    throw new Error(`Message Error on subject: ${subject as string}`, {
      cause: await Errors.errorToErrorDetail({
        error: responseData,
        extra: [request],
      }),
    });
  }
  if (isDefined(responseData.error)) {
    log("Error: msgToResponseData: responseData.error", responseData.error);
    throw new Error(`Error on subject: ${subject as string}`, {
      cause: await Errors.errorToErrorDetail({
        error: responseData.error,
        extra: [request],
      }),
    });
  }
  return responseData.value;
};
