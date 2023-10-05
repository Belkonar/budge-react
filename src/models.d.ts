interface DataApi {
  query: () => Promise<string>;
  exec: () => Promise<string>;
  insertOne: (collection: string, obj: any) => Promise<string>;
}

/*
Ground rules for types.
- Nullables should be unions instead of using the ? operator.
*/

interface Account {
  _id: string;
  name: string;
  type: 'debit' | 'credit';
}

interface Transaction {
  _id: string;
  timestamp: number;
  description: string;
  accountId: string;
  payeeId: string | null; // TODO: later
  categoryId: string | null;
  balanced: boolean;
}