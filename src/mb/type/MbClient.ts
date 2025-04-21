import type { ConnectionMap } from "./ConnectionMap";
import type { EventMap } from "./EventMap";
import { Msg } from "./Msg";
import type { PartialSubject } from "./PartialSubject";

export type MbClient<CM extends ConnectionMap> = {
  requestMany: <S extends keyof CM>(props: {
    subject: S;
    request: CM[S]["request"];
    headers?: Record<keyof CM[S]["headers"], string>;
    options?: Partial<{ timeoutMs: number }>;
    onResponse: (response: Msg<CM[S]["response"]>) => void | Promise<void>;
    signal?: AbortSignal;
  }) => Promise<void>;
  request: <S extends keyof CM>(props: {
    subject: S;
    request: CM[S]["request"];
    headers?: Record<keyof CM[S]["headers"], string>;
    options?: Partial<{ timeoutMs: number }>;
  }) => Promise<Msg<CM[S]["response"]>>;
  publish: <S extends PartialSubject, EM extends EventMap<S>>(props: {
    subject: S;
    payload: EM[S];
    headers?: Record<keyof CM[S]["headers"], string>;
  }) => Promise<void>;
};
