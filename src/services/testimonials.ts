import { api } from '../lib/api';
import { resolveAssetUrl } from '../lib/resolveAssetUrl';

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  avatar: string;
}

function asString(v: unknown): string {
  return typeof v === 'string' ? v.trim() : v != null ? String(v).trim() : '';
}

function pickId(raw: Record<string, unknown>, index: number): string {
  const id = raw.id ?? raw._id;
  if (id !== undefined && id !== null && String(id).length > 0) return String(id);
  return `testimonial-${index}`;
}

function pickRating(raw: Record<string, unknown>): number {
  const n = raw.rating ?? raw.stars ?? raw.score;
  const num = typeof n === 'number' ? n : typeof n === 'string' ? parseInt(n, 10) : NaN;
  if (!Number.isFinite(num) || num < 1) return 5;
  return Math.min(5, Math.max(1, Math.round(num)));
}

function pickAvatar(raw: Record<string, unknown>): string {
  const keys = ['avatar', 'avatar_url', 'avatarUrl', 'image', 'photo', 'photo_url', 'photoUrl', 'picture'];
  for (const k of keys) {
    const s = asString(raw[k]);
    if (s) return resolveAssetUrl(s);
  }
  return '';
}

function isTestimonialActive(raw: Record<string, unknown>): boolean {
  const flags = [raw.active, raw.is_active, raw.visible, raw.is_visible];
  return !flags.includes(false);
}

function normalizeOne(raw: Record<string, unknown>, index: number): Testimonial | null {
  if (!isTestimonialActive(raw)) return null;
  const name =
    asString(raw.name) ||
    asString(raw.client_name) ||
    asString(raw.author) ||
    asString(raw.full_name);

  const text =
    asString(raw.text) ||
    asString(raw.quote) ||
    asString(raw.message) ||
    asString(raw.content) ||
    asString(raw.review) ||
    asString(raw.body);

  const location =
    asString(raw.location) ||
    asString(raw.city) ||
    asString(raw.place) ||
    asString(raw.country) ||
    '';

  if (!name || !text) return null;

  return {
    id: pickId(raw, index),
    name,
    location,
    rating: pickRating(raw),
    text,
    avatar: pickAvatar(raw),
  };
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const { data } = await api.get<unknown>('/admin/testimonials');
  const list = Array.isArray(data)
    ? data
    : data && typeof data === 'object' && 'data' in (data as object) && Array.isArray((data as { data: unknown }).data)
      ? (data as { data: unknown[] }).data
      : data && typeof data === 'object' && 'testimonials' in (data as object) && Array.isArray((data as { testimonials: unknown[] }).testimonials)
        ? (data as { testimonials: unknown[] }).testimonials
        : [];

  const out: Testimonial[] = [];
  list.forEach((item, index) => {
    if (!item || typeof item !== 'object') return;
    const t = normalizeOne(item as Record<string, unknown>, index);
    if (t) out.push(t);
  });
  return out;
}
