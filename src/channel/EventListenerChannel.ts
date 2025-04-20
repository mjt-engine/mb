// TODO make this the general worker channel

// import { Channel } from "./Channels";

// export const EventListenerChannel = <T>() => {
//   return Channel<T>({
//     posterProducer: (signal) => {
//       return (msg) => {
//         if (signal?.aborted) {
//           return;
//         }
//         globalThis.postMessage(msg);
//       };
//     },
//     listenerProducer: (signal) => {
//       return (callback) => {
//         const listener = (event: MessageEvent<T>) => {
//           callback(event.data);
//         };
//         globalThis.addEventListener("message", listener, { signal });
//       };
//     },
//   });
// };
