import { Filter, FindOptions, UpdateFilter, UpdateOptions, AnyBulkWriteOperation, Document } from 'mongodb';
import { perf } from './performance';

declare global {
  interface Window {
    dataApi: <T>(request: IpcRequest) => Promise<T>;
  }
}

class DataService {
  // The typing here is for safety, but it's not strictly necessary.
  async insertOne<T = any>(collection: string, obj: T) {
    const request: IpcInsertOne = {
      kind: 'insertOne',
      collection,
      obj,
    };

    return await window.dataApi<void>(request);
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

    return await window.dataApi<TResponse[]>(request);
  }

  async findOne<TDocument = any, TResponse = TDocument>(collection: string, query: Filter<TDocument>, options?: FindOptions): Promise<TResponse | null> {
    const request: IpcFindOne = {
      kind: 'findOne',
      collection,
      query,
      options: options || null,
    };

    return await window.dataApi<TResponse>(request);
  }

  async deleteOne<TDocument = any>(collection: string, query: Filter<TDocument>) {
    const request: IpcDeleteOne = {
      kind: 'deleteOne',
      collection,
      query,
    };

    return await window.dataApi<void>(request);
  }

  async updateOne<TDocument = any>(collection: string, query: Filter<TDocument>, update: UpdateFilter<TDocument> | Partial<TDocument>, options?: UpdateOptions) {
    const request: IpcUpdateOne = {
      kind: 'updateOne',
      collection,
      query,
      update,
      options: options || null,
    };

    return await window.dataApi<void>(request);
  }

  async bulkWrite<TDocument extends Document = any>(collection: string, operations: AnyBulkWriteOperation<TDocument>[]) {
    const request: IpcBulkWrite = {
      kind: 'bulkWrite',
      collection,
      operations,
    };

    return await window.dataApi<void>(request);
  }

  async count<TDocument = any>(collection: string, query: Filter<TDocument>) {
    const request: IpcCount = {
      kind: 'count',
      collection,
      query,
    };

    return await window.dataApi<number>(request);
  }

  async aggregate<TDocument = any>(collection: string, pipeline: any[]): Promise<TDocument[]> {
    const request: IpcAggregate = {
      kind: 'aggregate',
      collection,
      pipeline,
    };

    return await window.dataApi<TDocument[]>(request);

  }

  // For now I've switched this to an aggregation pipeline. In it's current state, it should be
  // 100% good enough due to the extra stages.
  async reCalcBalance(accountId: string) {
    await dataService.aggregate('transactions', [
      {
        $match: {
          accountId,
          cleared: false,
        },
      },
      {
        $setWindowFields: {
          sortBy: {
            dateStamp: 1,
            ordinal: 1,
          },
          output: {
            rollup: {
              $sum: '$amount',
              window: {
                documents: ['unbounded', 'current'],
              },
            },
          },
        },
      },
      {
        $set: {
          rollup: {
            $sum: ['$$ROOT.rollup', 0], // last clear balance
          },
        },
      },
      {
        $merge: {
          into: 'transactions',
          on: '_id',
          whenNotMatched: 'discard',
        },
      },
    ]);
  }
}

export const dataService = new DataService();
