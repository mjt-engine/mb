import { Msg } from "./type/Msg";


export const FakeBytes = () => {
  return {
    msgPackToObject: <T>(data: any): Msg<T> => {
      return data as unknown as Msg<T>;
    },
    toMsgPack: <T>(data: Msg<T>): Uint8Array => {
      return data as unknown as Uint8Array;
    },
  } as const;
};
