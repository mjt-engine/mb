import { Serializer } from "./Serializer";

export const PassThroughSerializer = <D = unknown>(): Serializer<D> => {
  return {
    serialize: (obj) => obj as unknown as D,
    deserialize: <Obj>(data: unknown) => data as unknown as Obj,
  };
};
