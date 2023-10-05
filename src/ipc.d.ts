type IpcRequest = IpcInsertOne | IpcFindMany | IpcFindOne;

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

interface IpcFindOne {
  kind: 'findOne';
  collection: string;
  query: any;
  options: any | null;
}

type IpcRequestMethod<T> = (IpcRequest) => Promise<T>;
