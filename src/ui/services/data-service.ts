import { Filter, FindOptions, UpdateFilter, UpdateOptions } from 'mongodb';

// This method is wack but it's the only real way to deal with it.
function ipc<T>(request: IpcRequest): Promise<T> {
  return (window as any).dataApi(request);
}

class DataService {
  // The typing here is for safety, but it's not strictly necessary.
  async insertOne<T = any>(collection: string, obj: T) {
    const request: IpcInsertOne = {
      kind: 'insertOne',
      collection,
      obj,
    };

    return ipc<void>(request);
  }

  // Note on query typing: The way these are meant to be used is that you either provide the document type
  // or you provide a document type and a response type. This is used primarily for projections.
  async findMany<TDocument = any, TResponse = TDocument>(collection: string, query: Filter<TDocument>, options?: FindOptions): Promise<TResponse[]> {
    const request: IpcFindMany = {
      kind: 'findMany',
      collection,
      query,
      options: options || null,
    };

    return ipc<TResponse[]>(request);
  }

  async findOne<TDocument = any, TResponse = TDocument>(collection: string, query: Filter<TDocument>, options?: FindOptions): Promise<TResponse | null> {
    const request: IpcFindOne = {
      kind: 'findOne',
      collection,
      query,
      options: options || null,
    };

    return ipc<TResponse>(request);
  }

  async deleteOne<TDocument = any>(collection: string, query: Filter<TDocument>) {
    const request: IpcDeleteOne = {
      kind: 'deleteOne',
      collection,
      query,
    };

    return ipc<void>(request);
  }

  async updateOne<TDocument = any>(collection: string, query: Filter<TDocument>, update: UpdateFilter<TDocument> | Partial<TDocument>, options?: UpdateOptions) {
    console.log('updateOne', collection, query, update, options)
    const request: IpcUpdateOne = {
      kind: 'updateOne',
      collection,
      query,
      update,
      options: options || null,
    };

    return ipc<void>(request);
  }
}

export const dataService = new DataService();
