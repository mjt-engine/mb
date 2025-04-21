import { MsgMeta } from "./type/MsgMeta";
export const recordToMsgMeta = (headers?: Record<string, string>): MsgMeta => {
  return {
    headers,
  };
};
