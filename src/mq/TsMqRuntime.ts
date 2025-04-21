// import { Bytes } from "@mjt-engine/byte";
// import { Channel } from "../channel/Channels";
// import {
//   MqRuntime,
//   Payload,
//   PublishOptions,
//   RequestManyOptions,
//   RequestOptions,
//   Subscription,
//   SubscriptionOptions,
// } from "./type/MqConnection";
// import { Msg } from "./type/Msg";

// export const TsMqRuntime = (
//   channel: ReturnType<typeof Channel<Payload>>
// ): MqRuntime => {
//   return {
//     publish: function (
//       subject: string,
//       payload: Payload,
//       options?: PublishOptions
//     ): void {
//       return channel.postOn(subject, payload, { reply: options?.reply });
//     },
//     subscribe: function (
//       subject: string,
//       opts?: SubscriptionOptions
//     ): Subscription {
//       const { callback, timeout } = opts || {};
//       const abortController = new AbortController();
//       const itr = channel.listenOn(
//         subject,
//         (msg) => {
//           if (msg === undefined) {
//             return;
//           }

//           callback?.({
//             msg: {
//               respond: (data) => {
//                 throw new Error("callback respond Function not implemented.");
//               },
//               subject: subject,
//               data: msg,
//             },
//           });
//           return msg;
//         },
//         {
//           signal: abortController.signal,
//         }
//       );

//       const sub: Subscription = {
//         unsubscribe: () => {
//           abortController.abort();
//         },
//         [Symbol.asyncIterator]: function (): AsyncIterator<Msg> {
//           const payloadToMsg = async function* () {
//             for await (const data of itr) {
//               yield {
//                 subject,
//                 data: data!,
//                 respond: function (): boolean {
//                   throw new Error("Function not implemented.");
//                 },
//               } satisfies Msg;
//             }
//           };
//           return payloadToMsg();
//         },
//       };
//       return sub;
//     },
//     request: async function (
//       subject: string,
//       payload: Payload,
//       opts?: Partial<RequestOptions>
//     ) {
//       const result = await channel.request(subject, payload, {
//         timeOutMs: opts?.timeout,
//       });
//       console.log(
//         "CHANNEL REQUEST RESULT",
//         await Bytes.msgPackToObject(result as Uint8Array)
//       );
//       return {
//         subject: subject,
//         data: result!,
//         respond: (data) => {
//           throw new Error("Function not implemented.");
//         },
//       };
//     },
//     requestMany: async function (
//       subject: string,
//       payload: Payload,
//       opts?: Partial<RequestManyOptions>
//     ): Promise<AsyncIterable<Msg>> {
//       const result = await channel.requestMany({
//         operation: subject,
//         request: payload,
//       });
//       const payloadToMsg = async function* () {
//         for await (const data of result) {
//           yield {
//             subject,
//             data: data!,
//             respond: function (): boolean {
//               throw new Error("Function not implemented.");
//             },
//           } satisfies Msg;
//         }
//       };
//       return payloadToMsg();
//     },
//   };
// };
