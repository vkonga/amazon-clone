import { useState, useCallback } from 'react';
import { getErrorMessage } from '../utils/helpers';
import toast from 'react-hot-toast';

/**
 * useAsync — wraps any async operation with loading / error state
 */
export const useAsync = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (asyncFn, successMsg) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFn();
      if (successMsg) toast.success(successMsg);
      return result;
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, execute };
};

/**
 * useDebounce — debounce a value by delay ms
 */
import { useState as useStateD, useEffect } from 'react';

export const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useStateD(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};
