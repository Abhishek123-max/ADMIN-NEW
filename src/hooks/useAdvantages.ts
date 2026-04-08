import { useState, useEffect } from 'react';
import { getApiErrorMessage } from '../lib/api';
import { fetchAdvantages, type Advantage } from '../services/advantages';

export function useAdvantages() {
  const [advantages, setAdvantages] = useState<Advantage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchAdvantages()
      .then((rows) => {
        if (!cancelled) setAdvantages(rows);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(getApiErrorMessage(e, 'Failed to load advantages'));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { advantages, loading, error };
}
