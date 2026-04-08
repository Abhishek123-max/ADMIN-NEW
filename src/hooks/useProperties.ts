import { useState, useEffect } from 'react';
import { getApiErrorMessage } from '../lib/api';
import { Property } from '../types/property';
import {
  fetchProperties as fetchPropertiesRequest,
  fetchFeaturedProperties,
  fetchPropertyById,
  type PropertyFilters,
} from '../services/properties';

export type { PropertyFilters } from '../services/properties';

export function useProperties(filters: PropertyFilters = {}) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();
  }, [JSON.stringify(filters)]);

  async function fetchProperties() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPropertiesRequest(filters);
      setProperties(data);
    } catch (e: unknown) {
      setError(getApiErrorMessage(e, 'Failed to load properties'));
    } finally {
      setLoading(false);
    }
  }

  return { properties, loading, error, refetch: fetchProperties };
}

export function useFeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProperties(6)
      .then((data) => {
        setProperties(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { properties, loading };
}

export function useProperty(id: string) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    async function fetchProperty() {
      setLoading(true);
      try {
        const data = await fetchPropertyById(id);
        setProperty(data);
      } catch (e: unknown) {
        setError(getApiErrorMessage(e, 'Failed to load property'));
      } finally {
        setLoading(false);
      }
    }
    fetchProperty();
  }, [id]);

  return { property, loading, error };
}
