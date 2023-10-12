type IpcRequest = IpcInsertOne | IpcFindMany | IpcFindOne | IpcDeleteOne | IpcUpdateOne | IpcBulkWrite;

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

interface IpcDeleteOne {
  kind: 'deleteOne';
  collection: string;
  query: any;
}

interface IpcBulkWrite {
  kind: 'bulkWrite';
  collection: string;
  operations: AnyBulkWriteOperation<Document>[];
}

interface IpcUpdateOne {
  kind: 'updateOne';
  collection: string;
  query: any;
  update: any;
  options: any | null;
}

type IpcRequestMethod<T> = (IpcRequest) => Promise<T>;
