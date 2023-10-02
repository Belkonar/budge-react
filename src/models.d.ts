interface DataApi {
  query: () => Promise<string>;
  exec: () => Promise<string>;
}

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
  payeeId?: string; // TODO: later
  categoryId?: string;
  balanced: boolean;
}
