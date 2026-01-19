import { useState, useEffect, useCallback } from 'react';

export function useApiRequest<T>(
  requestFn: () => Promise<T>,
  deps: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await requestFn();
      setData(result);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, deps);

  useEffect(() => {
    setData(null);
    setIsLoading(true);
    setError(null);
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
