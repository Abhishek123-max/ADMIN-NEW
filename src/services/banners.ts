import { api } from '../lib/api';
import { resolveAssetUrl } from '../lib/resolveAssetUrl';

export interface BannerSlide {
  id: string;
  image_url: string;
  badge: string;
  subtitle: string;
  is_sell: boolean;
  title_line1: string;
  title_line2: string;
}

function asString(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

function pickImage(raw: Record<string, unknown>): string {
  const keys = ['image_url', 'imageUrl', 'image', 'url', 'background_image', 'backgroundImage', 'src'];
  for (const k of keys) {
    const s = asString(raw[k]);
    if (s) return s;
  }
  return '';
}

function pickId(raw: Record<string, unknown>, index: number): string {
  const id = raw.id ?? raw._id ?? raw.banner_id;
  if (id !== undefined && id !== null && String(id).length > 0) return String(id);
  return `banner-${index}`;
}

function pickSell(raw: Record<string, unknown>): boolean {
  if (raw.is_sell === true || raw.isSell === true) return true;
  if (raw.layout === 'sell' || raw.type === 'sell') return true;
  return false;
}

function isBannerActive(raw: Record<string, unknown>): boolean {
  const flags = [raw.active, raw.is_active, raw.visible, raw.is_visible];
  return !flags.includes(false);
}

function normalizeOne(raw: Record<string, unknown>, index: number): BannerSlide | null {
  if (!isBannerActive(raw)) return null;
  const image_url = pickImage(raw);
  if (!image_url) return null;

  const badge =
    asString(raw.badge) ||
    asString(raw.label) ||
    asString(raw.tag) ||
    asString(raw.pill);

  const subtitle =
    asString(raw.subtitle) ||
    asString(raw.description) ||
    asString(raw.body);

  const title_line1 =
    asString(raw.title_line1) ||
    asString(raw.headline) ||
    asString(raw.title);

  const title_line2 =
    asString(raw.title_line2) ||
    asString(raw.headline_highlight) ||
    asString(raw.highlight) ||
    asString(raw.titleAccent);

  return {
    id: pickId(raw, index),
    image_url: resolveAssetUrl(image_url),
    badge,
    subtitle,
    is_sell: pickSell(raw),
    title_line1,
    title_line2,
  };
}

export async function fetchBanners(): Promise<BannerSlide[]> {
  const { data } = await api.get<unknown>('/admin/banners');
  const list = Array.isArray(data)
    ? data
    : data && typeof data === 'object' && 'data' in (data as object) && Array.isArray((data as { data: unknown }).data)
      ? (data as { data: unknown[] }).data
      : data && typeof data === 'object' && 'banners' in (data as object) && Array.isArray((data as { banners: unknown[] }).banners)
        ? (data as { banners: unknown[] }).banners
        : [];

  const out: BannerSlide[] = [];
  list.forEach((item, index) => {
    if (!item || typeof item !== 'object') return;
    const slide = normalizeOne(item as Record<string, unknown>, index);
    if (slide) out.push(slide);
  });
  return out;
}
