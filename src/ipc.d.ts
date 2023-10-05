type IpcRequest = IpcInsertOne;

interface IpcInsertOne {
  kind: 'insertOne';
  collection: string;
  obj: any;
}

interface IpcFindMany {
  kind: 'findMany';
  collection: string;
  query: any;
  options: any | null;
}

type IpcRequestMethod<T> = (IpcRequest) => Promise<T>;
