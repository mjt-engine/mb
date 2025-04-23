import { PartialSubject } from "./PartialSubject";

export type ConnectionMap<
  S extends PartialSubject = string,
  Req = unknown,
  Resp = unknown,
  Header extends string = string
> = Record<
  S,
  { request: Req; response: Resp; headers?: Record<Header, string> }
>;
