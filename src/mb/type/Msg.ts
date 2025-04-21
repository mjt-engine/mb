import { ErrorDetail } from "@mjt-engine/error";
import { MsgMeta } from "./MsgMeta";

export type Msg<T> = {
  data: T;
  meta?: MsgMeta;
};

export const isMsg = <T>(maybe: unknown): maybe is Msg<T> => {
  const straw = maybe as Msg<T>;
  return typeof straw === "object" && straw !== null && "data" in straw;
};

export const isErrorMsg = (maybe: unknown): maybe is Msg<ErrorDetail> => {
  const straw = maybe as Msg<ErrorDetail>;
  return (isMsg<ErrorDetail>(maybe) && straw.meta?.hasError) || false;
};
