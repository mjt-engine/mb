import {
  MqRuntime,
  Payload,
  PublishOptions,
  SubscriptionOptions,
  Subscription,
  RequestOptions,
  RequestManyOptions,
} from "./type/MqConnection";
import { Msg } from "./type/Msg";

export const TsMqRuntime = (): MqRuntime => {
  const topics = new Map<string, Subscription[]>();

  return {
    publish: function (
      subject: string,
      payload?: Payload,
      options?: PublishOptions
    ): void {
      throw new Error("Function not implemented.");
    },
    subscribe: function (
      subject: string,
      opts?: SubscriptionOptions
    ): Subscription {
      if (!topics.has(subject)) {
        topics.set(subject, []);
      }

      const queue: Msg[] = [
        { subject, data: new Uint8Array(8), respond: () => false },
      ];
      const sub: Subscription = {
        unsubscribe: function (max?: number): void {
          throw new Error("unsubscribe not implemented.");
        },
        [Symbol.asyncIterator]: async function* (): AsyncIterator<Msg> {
          while (true) {
            if (queue.length > 0) {
              // opts?.callback?.(queue[0]);
              yield queue.shift()!;
            } else {
              await new Promise((resolve) => setTimeout(resolve, 50));
            }
          }
        },
      };

      topics.get(subject)!.push(sub);

      return sub;
    },
    request: function (
      subject: string,
      payload?: Payload,
      opts?: Partial<RequestOptions>
    ): Promise<Msg> {
      throw new Error("Function not implemented.");
    },
    requestMany: function (
      subject: string,
      payload?: Payload,
      opts?: Partial<RequestManyOptions>
    ): Promise<AsyncIterable<Msg>> {
      throw new Error("Function not implemented.");
    },
  };
};
