import { Filter, FindOptions, UpdateFilter, UpdateOptions } from 'mongodb';

// This method is wack but it's the only real way to deal with it.
function ipc<T>(request: IpcRequest): Promise<T> {
  return (window as any).dataApi(request);
}

const chunkSize = 50;

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

  // TODO: change this to recalc all balances past the earliest date in an update.
  async reCalcBalance(accountId: string, targetAccountId: string) {
    let transactions: Transaction[] = [];

    let sum = 0;

    let breakNext = true;

    // Only calc up to four pages of transactions right now, later I'll get the count and do the math.
    for (let i = 0; i < 4; i++) {
      const chunk = await this.findMany<Transaction>(
        'transactions',
        {
          accountId: accountId
        },
        {
          sort: { dateStamp: -1, ordinal: -1 },
          limit: chunkSize,
          skip: i * chunkSize
        }
      );

      transactions = transactions.concat(chunk);

      if (breakNext) {
        break;
      }

      if (chunk.length < chunkSize) {
        // No more records to process
        break;
      }

      // TODO: get a record to use as a starting point
      if (chunk.filter(t => t._id === targetAccountId).length > 0) {
        // If the target is exactly the last in the list, we need to try one more time for more records.
        if (chunk[chunk.length - 1]._id === targetAccountId) {
          breakNext = false;
        } else {
          break;
        }
      }
    }

    const lastTransaction = transactions[transactions.length - 1];

    if (lastTransaction._id !== targetAccountId) {
      sum = lastTransaction.rollup;
      transactions.pop();
    }

    transactions = transactions.reverse();

    const updates = transactions.map((t) => {
      sum += t.amount;
      return {
        collection: 'transactions',
        query: { _id: t._id },
        update: { $set: { rollup: sum } },
      };
    });

    // TODO: make an updateMany method
    await Promise.all(updates.map(u => this.updateOne<Transaction>(u.collection, u.query, u.update)));
  }
}

export const dataService = new DataService();
