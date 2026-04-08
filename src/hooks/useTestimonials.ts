import { useState, useEffect } from 'react';
import { getApiErrorMessage } from '../lib/api';
import { fetchTestimonials, type Testimonial } from '../services/testimonials';

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchTestimonials()
      .then((rows) => {
        if (!cancelled) setTestimonials(rows);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(getApiErrorMessage(e, 'Failed to load testimonials'));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { testimonials, loading, error };
}
