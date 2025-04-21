import { Payload, PublishOptions } from "./MqConnection";

export declare enum Match {
  Exact = 0,
  CanonicalMIME = 1,
  IgnoreCase = 2,
}

// export type MsgHeaders = Record<string, string>;

export type MsgMeta = Partial<{
  hasError: boolean;
  status: string;
  code: number;
  description: string;
  headers: Record<string, string>;
  // get(k: string, match?: Match): string;
  // set(k: string, v: string, match?: Match): void;
  // append(k: string, v: string, match?: Match): void;
  // has(k: string, match?: Match): boolean;
  // keys(): string[];
  // values(k: string, match?: Match): string[];
  // delete(k: string, match?: Match): void;
  // last(k: string, match?: Match): string;
}>;

export type Msg = {
  /**
   * The subject the message was sent to
   */
  // subject: string;
  /**
   * A possible subject where the recipient may publish a reply (in the cases
   * where the message represents a request).
   */
  // reply?: string;
  /**
   * The message's data (or payload)
   */
  data: Payload;
  /**
   * Possible headers that may have been set by the server or the publisher.
   */
  meta?: MsgMeta;
};
