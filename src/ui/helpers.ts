import { useEffect } from 'react';

// TODO: Add an alert if the promise rejects
export function useInitialLoad(func: () => Promise<void>) {
  useEffect(() => {
    func().catch(console.error);
  }, []);
}
