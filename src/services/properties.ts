import { api } from '../lib/api';
import type { Property } from '../types/property';

export interface PropertyFilters {
  type?: Property['type'] | '';
  featured?: boolean;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

/** Query params the list API understands — omit empties so filters apply reliably. */
export function buildPropertyListParams(filters: PropertyFilters = {}): Record<string, string | number | boolean> {
  const params: Record<string, string | number | boolean> = {
    available: true,
  };

  if (filters.type) {
    params.type = filters.type;
    params.property_type = filters.type;
  }

  if (filters.featured === true) {
    params.featured = true;
  }

  const city = filters.city?.trim();
  if (city) params.city = city;

  const search = filters.search?.trim();
  if (search) params.search = search;

  if (filters.minPrice != null && Number.isFinite(filters.minPrice)) {
    params.minPrice = filters.minPrice;
  }
  if (filters.maxPrice != null && Number.isFinite(filters.maxPrice)) {
    params.maxPrice = filters.maxPrice;
  }

  return params;
}

/**
 * Ensures list matches active filters when the API returns a full list (ignores query params).
 */
export function applyClientPropertyFilters(list: Property[], filters: PropertyFilters): Property[] {
  // Always hide unavailable properties on the client as a safety net.
  let out = list.filter((p) => p.available !== false);
  if (filters.type) {
    out = out.filter((p) => p.type === filters.type);
  }
  if (filters.featured === true) {
    out = out.filter((p) => p.featured === true);
  }
  const city = filters.city?.trim().toLowerCase();
  if (city) {
    out = out.filter((p) => (p.city || '').toLowerCase().includes(city));
  }
  const q = filters.search?.trim().toLowerCase();
  if (q) {
    out = out.filter(
      (p) =>
        (p.title || '').toLowerCase().includes(q) ||
        (p.city || '').toLowerCase().includes(q) ||
        (p.address || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q),
    );
  }
  if (filters.minPrice != null && Number.isFinite(filters.minPrice)) {
    out = out.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice != null && Number.isFinite(filters.maxPrice)) {
    out = out.filter((p) => p.price <= filters.maxPrice!);
  }
  return out;
}

export async function fetchProperties(filters: PropertyFilters = {}) {
  const { data } = await api.get<Property[]>('/admin/properties', {
    params: buildPropertyListParams(filters),
  });
  const rows = data || [];
  return applyClientPropertyFilters(rows, filters);
}

export async function fetchFeaturedProperties(limit = 6) {
  const { data } = await api.get<Property[]>('/admin/properties', {
    params: { featured: true, available: true, limit },
  });
  const rows = data || [];
  const filtered = applyClientPropertyFilters(rows, { featured: true });
  return filtered.slice(0, limit);
}

export async function fetchPropertyById(id: string) {
  const { data } = await api.get<Property>(`/admin/properties/${id}`);
  return data;
}

