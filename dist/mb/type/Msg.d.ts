import { ErrorDetail } from "@mjt-engine/error";
import { MsgMeta } from "./MsgMeta";
export type Msg<T> = {
    data: T;
    meta?: MsgMeta;
};
export declare const isMsg: <T>(maybe: unknown) => maybe is Msg<T>;
export declare const isErrorMsg: (maybe: unknown) => maybe is Msg<ErrorDetail>;
