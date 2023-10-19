import { GridValueFormatterParams } from '@mui/x-data-grid';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addAlert } from './main-store';

// TODO: Add an alert if the promise rejects
export function useInitialLoad(func: () => Promise<void>) {
  const dispatch = useDispatch();

  useEffect(() => {
    func().catch((err) => {
      dispatch(addAlert({
        type: 'error',
        message: err.message,
        autoHide: true
      }));
    });
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
