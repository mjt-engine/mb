import type { ConnectionMap } from "./ConnectionMap";

export type ConnectionListener<CM extends ConnectionMap, S extends keyof CM> = (
  request: CM[S]["request"],
  meta: Partial<{
    headers?: CM[S]["headers"];
    signal?: AbortSignal;
  }>
) =>
  | CM[S]["response"]
  | Promise<CM[S]["response"] | void>
  | void
  | Promise<void>;
