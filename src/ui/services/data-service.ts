import { Filter, FindOptions, UpdateFilter, UpdateOptions, AnyBulkWriteOperation, Document } from 'mongodb';

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
    const request: IpcUpdateOne = {
      kind: 'updateOne',
      collection,
      query,
      update,
      options: options || null,
    };

    return ipc<void>(request);
  }

  async bulkWrite<TDocument extends Document = any>(collection: string, operations: AnyBulkWriteOperation<TDocument>[]) {
    const request: IpcBulkWrite = {
      kind: 'bulkWrite',
      collection,
      operations,
    };

    return ipc<void>(request);
  }

  async reCalcBalance(accountId: string) {
    const transactions = await this.findMany<Transaction>(
      'transactions',
      {
        accountId: accountId,
        cleared: false,
      },
      {
        sort: { dateStamp: 1, ordinal: 1 },
      }
    );

    let sum = 0; // TODO: use the last clear balance instead of 0 if it exists

    const updates = transactions.map((t) => {
      sum += t.amount;
      return {
        collection: 'transactions',
        query: { _id: t._id },
        update: { $set: { rollup: sum } },
        shouldUpdate: sum !== t.rollup,
      };
    });

    const bulkOperations = updates.filter(x => x.shouldUpdate).map<AnyBulkWriteOperation<Transaction>>(x => {
      return {
        updateOne: {
          filter: x.query,
          update: x.update,
        },
      };
    });

    if (bulkOperations.length > 0) {
      await this.bulkWrite<Transaction>('transactions', bulkOperations);
    }
  }
}

export const dataService = new DataService();
