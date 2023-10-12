import { GridValueFormatterParams } from '@mui/x-data-grid';
import { useEffect } from 'react';

// TODO: Add an alert if the promise rejects
export function useInitialLoad(func: () => Promise<void>) {
  useEffect(() => {
    func().catch(console.error);
  }, []);
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const currencyFormatter = (params: GridValueFormatterParams<number>) => {
  if (params.value == 0) {
    return '';
  }
  else {
    return formatter.format(params.value);
  }
};
