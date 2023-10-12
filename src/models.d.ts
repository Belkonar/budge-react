interface DataApi {
  query: () => Promise<string>;
  exec: () => Promise<string>;
  insertOne: (collection: string, obj: any) => Promise<string>;
}

/*
Ground rules for types.
- Nullables should be unions instead of using the ? operator.
*/

interface Alert {
  message: string;
  type: AlertColor;
  autoHide?: boolean;
}

interface InnerAlert extends Alert {
  _id: string;
}

type AccountType = 'debit' | 'credit';

interface Account {
  _id: string;
  name: string;
  description: string;
  type: AccountType;
}

interface Transaction {
  _id: string;
  dateStamp: Date;
  ordinal: number;
  description: string;
  accountId: string;
  payeeId: string | null; // TODO: later
  categoryId: string | null;
  cleared: boolean;
  amount: number;
  rollup: number; // This is the running total of the register
}

// AnyBulkWriteOperation, Filter, FindOptions, UpdateFilter, UpdateOptions, Document

