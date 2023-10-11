import { useEffect } from 'react';

export function useInitialLoad(func: () => Promise<void>) {
  useEffect(() => {
    func().catch(console.error);
  }, []);
}
