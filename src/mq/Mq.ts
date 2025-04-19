import { connect } from "./connect";
import { ConnectionMap } from "./type/ConnectionMap";

// export const Mq = <
//   CM extends ConnectionMap,
//   E extends Record<string, string> = Record<string, string>
// >() => {
//   // const connection = createConnection<CM, E>()
//   return {
//     connect,
//   };
// };

export const Mqs = {
  connect,
};
