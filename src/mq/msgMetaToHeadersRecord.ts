import { Msg } from "./type/Msg";

export const msgMetaToHeadersRecord = (meta: Msg["meta"] = {}) => {
  const { headers = {} } = meta;
  return headers;
};
