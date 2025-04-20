import { Channel } from "../channel/Channels";
import { EventEmitterChannel } from "../channel/EventEmitterChannel";
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

export const TsMqRuntime = (
  channel: ReturnType<typeof EventEmitterChannel<Payload | undefined>>
): MqRuntime => {
  // const topics = new Map<string, Subscription[]>();

  return {
    publish: function (
      subject: string,
      payload?: Payload,
      options?: PublishOptions
    ): void {
      return channel.postOn(subject, payload, { reply: options?.reply });
    },
    subscribe: function (
      subject: string,
      opts?: SubscriptionOptions
    ): Subscription {
      const { callback, timeout } = opts || {};
      channel.listenOn(subject, (msg) => {
        console.log("subscribe: ", msg);
        if (msg === undefined) {
          return;
        }
        callback?.({
          msg: {
            respond: (data) => {
              return true;
            },
            subject: subject,
            data: msg,
          },
        });
        return msg;
      });
      throw new Error("Function not implemented.");
      // return channel.requestMany({
      //   callback: (msg) => {
      //     console.log("subscribe: ", msg);
      //     return msg;
      //   },operation:subject,

      // })
      // return sub;
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
