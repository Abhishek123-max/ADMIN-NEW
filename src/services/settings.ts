import { api } from '../lib/api';
import { resolveAssetUrl } from '../lib/resolveAssetUrl';
import type { SiteSettings } from '../hooks/useSiteSettings';

export interface SettingRow {
  key: string;
  value: string;
  updated_at?: string;
}

function toMap(rows: SettingRow[]): Record<string, string> {
  const map: Record<string, string> = {};
  rows.forEach((r) => {
    if (!r || typeof r.key !== 'string') return;
    map[r.key] = typeof r.value === 'string' ? r.value : String(r.value ?? '');
  });
  return map;
}

export async function fetchAdminSettings(): Promise<Partial<SiteSettings>> {
  const { data } = await api.get<unknown>('/admin/settings');
  const rows = Array.isArray(data) ? (data as SettingRow[]) : [];
  const map = toMap(rows);

  const logo_url = map.logo_url ? resolveAssetUrl(map.logo_url) : '';
  const seo_og_image = map.seo_og_image ? resolveAssetUrl(map.seo_og_image) : '';

  return {
    site_name: map.site_name,
    tagline: map.tagline,
    phone: map.phone,
    phone_raw: map.phone_raw,
    email: map.email,
    address: map.address,
    whatsapp_text: map.whatsapp_text,
    business_hours: map.business_hours,
    logo_url,
    facebook_url: map.facebook_url,
    twitter_url: map.twitter_url,
    instagram_url: map.instagram_url,
    youtube_url: map.youtube_url,
    linkedin_url: map.linkedin_url,
    whatsapp_url: map.whatsapp_url,
    pinterest_url: map.pinterest_url,
    threads_url: map.threads_url,
    seo_title: map.seo_title,
    seo_description: map.seo_description,
    seo_og_image,
    privacy_policy_content: map.privacy_policy_content,
    terms_content: map.terms_content,
  };
}

