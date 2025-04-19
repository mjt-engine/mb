import { MsgMeta } from "./type/Msg";
export const recordToMsgMeta = (headers?: Record<string, string>): MsgMeta => {
  return {
    headers,
  };
};
