import { useState, useEffect, useCallback } from 'react';

/**
 * useApi - Custom hook for API calls with loading/error states
 * @param {Function} apiFn - API function to call
 * @param {Array} deps - Dependencies to re-fetch on change
 * @param {boolean} immediate - Whether to call immediately on mount
 */
export function useApi(apiFn, deps = [], immediate = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFn(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    if (immediate) execute();
  }, [execute]);

  return { data, loading, error, refetch: execute };
}

/**
 * usePagination - Handle paginated API calls
 */
export function usePagination(apiFn, initialParams = {}) {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const { data, loading, error, refetch } = useApi(
    () => apiFn({ ...initialParams, page, limit }),
    [page]
  );

  useEffect(() => {
    if (data?.pagination) setTotal(data.pagination.total);
  }, [data]);

  return {
    data: data?.candidates || data?.data || [],
    loading, error,
    page, setPage,
    total,
    totalPages: Math.ceil(total / limit),
    refetch,
  };
}

/**
 * useLocalStorage - Sync state with localStorage
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('localStorage error:', error);
    }
  };

  return [storedValue, setValue];
}

/**
 * useTimer - Countdown timer hook
 */
export function useTimer(initialTime, onComplete) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          onComplete?.();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const start = () => { setTimeLeft(initialTime); setIsRunning(true); };
  const pause = () => setIsRunning(false);
  const reset = () => { setTimeLeft(initialTime); setIsRunning(false); };

  const formatted = `${String(Math.floor(timeLeft / 60)).padStart(2, '0')}:${String(timeLeft % 60).padStart(2, '0')}`;

  return { timeLeft, isRunning, start, pause, reset, formatted };
}
