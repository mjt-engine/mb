import type { ConnectionMap } from "./ConnectionMap";
import type { EventMap } from "./EventMap";
import { Msg } from "./Msg";
import type { PartialSubject } from "./PartialSubject";

export type MbClient<CM extends ConnectionMap> = {
  requestMany: <S extends keyof CM>(
    subject: S,
    request: CM[S]["request"],
    options?: Partial<{
      headers?: Record<keyof CM[S]["headers"], string>;
      timeoutMs: number;
      callback: (response: Msg<CM[S]["response"]>) => void | Promise<void>;
      signal?: AbortSignal;
    }>
  ) => Promise<void>;
  request: <S extends keyof CM>(
    subject: S,
    request: CM[S]["request"],
    options?: Partial<{
      timeoutMs: number;
      headers?: Record<keyof CM[S]["headers"], string>;
    }>
  ) => Promise<Msg<CM[S]["response"]>>;
  publish: <S extends PartialSubject, EM extends EventMap<S>>(
    subject: S,
    payload: EM[S],
    options?: Partial<{
      headers?: Record<keyof CM[S]["headers"], string>;
    }>
  ) => Promise<void>;
};
