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

interface Named {
  _id: string;
  name: string;
}

interface Account extends Named {
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

type CommitType = 'manual' | 'automatic' | 'estimate';
type FrequencyType = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface ScheduledTransaction {
  _id: string;
  name: string;
  accountId: string;
  payeeId: string | null; // TODO: later
  categoryId: string | null;
  amount: number;

  // While manual and automatic are easily understood, estimate is more vague.
  // It's a transaction that does nothing, and cannot be committed, but is used for
  // balance projections.
  commitType: CommitType;

  frequency: FrequencyType;
  frequencyConfig: map<string, any>; // Maybe I'll break this into multiple types later but for now it's just a map
  lastCommit: Date | null; // Not used for estimate transactions
  startDate: Date;
}

// used for reporting
interface BudgeInterval {
  start: Date;
  end: Date;
}

