import { Filter, FindOptions } from 'mongodb';

function ipc<T>(request: IpcRequest): Promise<T> {
  return window.dataApi(request);
}

class DataService {
  // The typing here is for safety, but it's not strictly necessary.
  async insertOne<T>(collection: string, obj: T) {
    const request: IpcInsertOne = {
      kind: 'insertOne',
      collection,
      obj,
    };

    return ipc<void>(request);
  }

  // Note on query typing: The way these are meant to be used is that you either provide the document type
  // or you provide a document type and a response type. This is used primarily for projections.
  async findMany<TDocument, TResponse = TDocument>(collection: string, query: Filter<TDocument>, options?: FindOptions): Promise<TResponse[]> {
    const request: IpcFindMany = {
      kind: 'findMany',
      collection,
      query,
      options: options || null,
    };

    return ipc<TResponse[]>(request);
  }

  async findOne<TDocument, TResponse = TDocument>(collection: string, query: Filter<TDocument>, options?: FindOptions): Promise<TResponse | null> {
    const request: IpcFindMany = {
      kind: 'findMany',
      collection,
      query,
      options: options || null,
    };

    return ipc<TResponse>(request);
  }
}

export const dataService = new DataService();
