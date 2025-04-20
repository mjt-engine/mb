import { ErrorLike } from "@mjt-engine/object";
import { Msg, MsgMeta } from "./Msg";

export type Payload = Uint8Array | string;

export type PublishOptions = {
  /**
   * An optional subject where a response should be sent.
   * Note you must have a subscription listening on this subject
   * to receive the response.
   */
  reply?: string;
  /**
   * Optional headers to include with the message.
   */
  meta?: MsgMeta;
};

export interface RequestOptions {
  /**
   * number of milliseconds before the request will timeout.
   */
  timeout: number;
  /**
   * MsgHdrs to include with the request.
   */
  meta?: MsgMeta;
}

/**
 * Subscription Options
 */
export interface SubOpts<T> {
  /**
   * Optional maximum number of messages to deliver to the subscription
   * before it is auto-unsubscribed.
   */
  max?: number;
  /**
   * Optional maximum number of milliseconds before a timer raises an error. This
   * useful to monitor a subscription that is expected to yield messages.
   * The timer is cancelled when the first message is received by the subscription.
   */
  timeout?: number;
  /**
   * An optional function that will handle messages. Typically, messages
   * are processed via an async iterator on the subscription. If this
   * option is provided, messages are processed by the specified function.
   * @param err
   * @param msg
   */
  callback?: (props: { error?: ErrorLike; msg?: T }) => void;
}
/**
 * Basic interface to a Subscription type
 */
export interface Sub<T> extends AsyncIterable<T> {
  /**
   * Stop the subscription from receiving messages. You can optionally
   * specify that the subscription should stop after the specified number
   * of messages have been received. Note this count is since the lifetime
   * of the subscription.
   * @param max
   */
  unsubscribe(max?: number): void;
}

export type RequestManyOptions = {
  maxWait: number;
  meta?: MsgMeta;
};

export type SubscriptionOptions = SubOpts<Msg>;
export type Subscription = Sub<Msg>;
export type MqRuntime = {
  /**
   * Publishes the specified data to the specified subject.
   * @param subject
   * @param payload
   * @param options
   */
  publish(subject: string, payload?: Payload, options?: PublishOptions): void;
  /**
   * Publishes using the subject of the specified message, specifying the
   * data, headers and reply found in the message if any.
   * @param msg
   */
  /**
   * Subscribe expresses interest in the specified subject. The subject may
   * have wildcards. Messages are delivered to the {@link SubOpts#callback |SubscriptionOptions callback}
   * if specified. Otherwise, the subscription is an async iterator for {@link Msg}.
   *
   * @param subject
   * @param opts
   */
  subscribe(subject: string, opts?: SubscriptionOptions): Subscription;
  /**
   * Publishes a request with specified data in the specified subject expecting a
   * response before {@link RequestOptions#timeout} milliseconds. The api returns a
   * Promise that resolves when the first response to the request is received. If
   * there are no responders (a subscription) listening on the request subject,
   * the request will fail as soon as the server processes it.
   *
   * @param subject
   * @param payload
   * @param opts
   */
  request(
    subject: string,
    payload?: Payload,
    opts?: Partial<RequestOptions>
  ): Promise<Msg>;
  /**
   * Publishes a request expecting multiple responses back. Several strategies
   * to determine when the request should stop gathering responses.
   * @param subject
   * @param payload
   * @param opts
   */
  requestMany(
    subject: string,
    payload?: Payload,
    opts?: Partial<RequestManyOptions>
  ): Promise<AsyncIterable<Msg>>;
};
