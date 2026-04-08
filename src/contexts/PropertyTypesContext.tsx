import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { PropertyType } from '../types/property';
import type { Property } from '../types/property';
import { fetchProperties } from '../services/properties';
import { TreePine, Home, Building2, FileText } from 'lucide-react';

type IconComponent = (props: { className?: string }) => JSX.Element;

export interface PropertyTypeCard {
  value: PropertyType;
  label: string;
  description: string;
  Icon: IconComponent;
  bg: string;
  iconBg: string;
  iconColor: string;
  image: string;
  count: number;
}

export interface PropertyTypeOption {
  value: PropertyType | '';
  label: string;
}

interface PropertyTypesContextValue {
  properties: Property[];
  cards: PropertyTypeCard[];
  options: PropertyTypeOption[];
  loading: boolean;
  error: string | null;
}

const PropertyTypesContext = createContext<PropertyTypesContextValue | null>(null);

const TYPE_META: Record<
  PropertyType,
  {
    label: string;
    description: string;
    Icon: IconComponent;
    bg: string;
    iconBg: string;
    iconColor: string;
    image: string;
  }
> = {
  land_sale: {
    label: 'Land for Sale',
    description: 'Prime plots and agricultural land for permanent ownership',
    Icon: TreePine as unknown as IconComponent,
    bg: 'bg-amber-50',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700',
    image: 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  room_rent: {
    label: 'Room for Rent',
    description: 'Furnished and unfurnished rooms for short or long-term stay',
    Icon: Home as unknown as IconComponent,
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-700',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  land_rent: {
    label: 'Land for Rent',
    description: 'Flexible land rental for farming, storage or temporary use',
    Icon: TreePine as unknown as IconComponent,
    bg: 'bg-green-50',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-700',
    image: 'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  commercial_rent: {
    label: 'Commercial Rent',
    description: 'Shops, offices and commercial spaces for your business',
    Icon: Building2 as unknown as IconComponent,
    bg: 'bg-orange-50',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-700',
    image: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  lease: {
    label: 'Lease Properties',
    description: 'Long-term lease agreements for residential and commercial use',
    Icon: FileText as unknown as IconComponent,
    bg: 'bg-teal-50',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-700',
    image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
};

function countByType(list: Property[]): Partial<Record<PropertyType, number>> {
  const counts: Partial<Record<PropertyType, number>> = {};
  for (const p of list) {
    const t = p.type;
    counts[t] = (counts[t] || 0) + 1;
  }
  return counts;
}

export function PropertyTypesProvider({ children }: { children: React.ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [cards, setCards] = useState<PropertyTypeCard[]>([]);
  const [options, setOptions] = useState<PropertyTypeOption[]>([{ value: '', label: 'All Types' }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchProperties({})
      .then((rows) => {
        if (cancelled) return;
        setProperties(rows || []);
        const counts = countByType(rows);
        const availableTypes = (Object.keys(TYPE_META) as PropertyType[]).filter(
          (t) => (counts[t] || 0) > 0,
        );

        const nextCards: PropertyTypeCard[] = availableTypes.map((t) => ({
          value: t,
          count: counts[t] || 0,
          ...TYPE_META[t],
        }));

        const nextOptions: PropertyTypeOption[] = [
          { value: '', label: 'All Types' },
          ...nextCards.map((c) => ({ value: c.value, label: c.label })),
        ];

        setCards(nextCards);
        setOptions(nextOptions);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : 'Failed to load property types');
        setProperties([]);
        setCards([]);
        setOptions([{ value: '', label: 'All Types' }]);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<PropertyTypesContextValue>(
    () => ({ properties, cards, options, loading, error }),
    [properties, cards, options, loading, error],
  );

  return <PropertyTypesContext.Provider value={value}>{children}</PropertyTypesContext.Provider>;
}

export function usePropertyTypesContext() {
  const ctx = useContext(PropertyTypesContext);
  if (!ctx) throw new Error('usePropertyTypesContext must be used within PropertyTypesProvider');
  return ctx;
}

