import { Msg } from "./type/Msg";
export declare const FakeBytes: () => {
    readonly msgPackToObject: <T>(data: any) => Msg<T>;
    readonly toMsgPack: <T>(data: Msg<T>) => Uint8Array;
};
