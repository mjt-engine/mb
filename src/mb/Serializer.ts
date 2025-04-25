export type Serializer<Data> = {
  serialize: (obj: unknown) => Data;
  deserialize: <Obj>(data: Data) => Obj;
};
