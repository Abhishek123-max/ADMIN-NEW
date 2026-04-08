import { api } from '../lib/api';
import type { LucideIcon } from 'lucide-react';
import {
  Shield,
  Clock,
  Award,
  Leaf,
  Star,
  Heart,
  Home,
  Building2,
  CheckCircle,
  Users,
  MapPin,
  Phone,
  Headphones,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export interface Advantage {
  id: string;
  title: string;
  desc: string;
  Icon: LucideIcon;
  color: string;
  iconColor: string;
}

const VARIANTS: Array<{ color: string; iconColor: string }> = [
  { color: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  { color: 'bg-blue-50', iconColor: 'text-blue-600' },
  { color: 'bg-amber-50', iconColor: 'text-amber-600' },
  { color: 'bg-teal-50', iconColor: 'text-teal-600' },
  { color: 'bg-rose-50', iconColor: 'text-rose-600' },
  { color: 'bg-violet-50', iconColor: 'text-violet-600' },
];

const ICON_MAP: Record<string, LucideIcon> = {
  shield: Shield,
  clock: Clock,
  award: Award,
  leaf: Leaf,
  star: Star,
  heart: Heart,
  home: Home,
  building: Building2,
  building2: Building2,
  check: CheckCircle,
  checkcircle: CheckCircle,
  users: Users,
  mappin: MapPin,
  map_pin: MapPin,
  map: MapPin,
  phone: Phone,
  headphones: Headphones,
  support: Headphones,
  sparkles: Sparkles,
  trending: TrendingUp,
  trendingup: TrendingUp,
};

function normalizeIconKey(v: unknown): string {
  const s = typeof v === 'string' ? v.trim().toLowerCase() : '';
  return s.replace(/[\s-]+/g, '_');
}

function pickIconComponent(raw: Record<string, unknown>): LucideIcon {
  const key =
    normalizeIconKey(raw.icon) ||
    normalizeIconKey(raw.icon_name) ||
    normalizeIconKey(raw.iconName) ||
    normalizeIconKey(raw.icon_type) ||
    normalizeIconKey(raw.type) ||
    normalizeIconKey(raw.slug) ||
    '';

  const compact = key.replace(/_/g, '');
  return ICON_MAP[key] || ICON_MAP[compact] || Shield;
}

function asString(v: unknown): string {
  return typeof v === 'string' ? v.trim() : v != null ? String(v).trim() : '';
}

function pickId(raw: Record<string, unknown>, index: number): string {
  const id = raw.id ?? raw._id;
  if (id !== undefined && id !== null && String(id).length > 0) return String(id);
  return `advantage-${index}`;
}

/** Allow API to pass tailwind-like classes if they match a safe prefix. */
function pickThemeField(raw: Record<string, unknown>, keys: string[], fallback: string): string {
  for (const k of keys) {
    const s = asString(raw[k]);
    if (!s) continue;
    if (/^bg-[\w/-]+$/.test(s) || /^text-[\w/-]+$/.test(s)) return s;
  }
  return fallback;
}

function isAdvantageActive(raw: Record<string, unknown>): boolean {
  const flags = [raw.active, raw.is_active, raw.visible, raw.is_visible];
  return !flags.includes(false);
}

function normalizeOne(raw: Record<string, unknown>, index: number): Advantage | null {
  if (!isAdvantageActive(raw)) return null;
  const title =
    asString(raw.title) ||
    asString(raw.name) ||
    asString(raw.heading) ||
    asString(raw.headline);

  const desc =
    asString(raw.desc) ||
    asString(raw.description) ||
    asString(raw.body) ||
    asString(raw.text) ||
    asString(raw.content);

  if (!title || !desc) return null;

  const variant = VARIANTS[index % VARIANTS.length];
  const color = pickThemeField(raw, ['color', 'bg_color', 'bgColor', 'background'], variant.color);
  const iconColor = pickThemeField(raw, ['icon_color', 'iconColor', 'icon_text_color'], variant.iconColor);

  return {
    id: pickId(raw, index),
    title,
    desc,
    Icon: pickIconComponent(raw),
    color,
    iconColor,
  };
}

export async function fetchAdvantages(): Promise<Advantage[]> {
  const { data } = await api.get<unknown>('/admin/advantages');
  const list = Array.isArray(data)
    ? data
    : data && typeof data === 'object' && 'data' in (data as object) && Array.isArray((data as { data: unknown }).data)
      ? (data as { data: unknown[] }).data
      : data && typeof data === 'object' && 'advantages' in (data as object) && Array.isArray((data as { advantages: unknown[] }).advantages)
        ? (data as { advantages: unknown[] }).advantages
        : [];

  const out: Advantage[] = [];
  list.forEach((item, index) => {
    if (!item || typeof item !== 'object') return;
    const row = normalizeOne(item as Record<string, unknown>, index);
    if (row) out.push(row);
  });
  return out;
}
