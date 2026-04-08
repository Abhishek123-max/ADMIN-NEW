import { useEffect, useState } from 'react';
import { SITE_CONFIG } from '../lib/config';
import { fetchAdminSettings } from '../services/settings';

export interface SiteSettings {
  site_name: string;
  tagline: string;
  phone: string;
  phone_raw: string;
  email: string;
  address: string;
  whatsapp_text: string;
  business_hours: string;
  logo_url: string;
  facebook_url: string;
  twitter_url: string;
  instagram_url: string;
  youtube_url: string;
  linkedin_url: string;
  whatsapp_url: string;
  pinterest_url: string;
  threads_url: string;
  seo_title: string;
  seo_description: string;
  seo_og_image: string;
  privacy_policy_content: string;
  terms_content: string;
}

const DEFAULT: SiteSettings = {
  site_name: SITE_CONFIG.name,
  tagline: SITE_CONFIG.tagline,
  phone: SITE_CONFIG.phone,
  phone_raw: SITE_CONFIG.phoneRaw,
  email: SITE_CONFIG.email,
  address: SITE_CONFIG.address,
  whatsapp_text: SITE_CONFIG.whatsappText,
  business_hours: SITE_CONFIG.hours,
  logo_url: '',
  facebook_url: SITE_CONFIG.social.facebook,
  twitter_url: SITE_CONFIG.social.twitter,
  instagram_url: SITE_CONFIG.social.instagram,
  youtube_url: SITE_CONFIG.social.youtube,
  linkedin_url: '',
  whatsapp_url: '',
  pinterest_url: '',
  threads_url: '',
  seo_title: 'WesternProperties — Buy, Rent & Lease Properties in Goa',
  seo_description: "Find verified land for sale, beachfront plots, rooms for rent, commercial spaces, and lease properties across Goa's finest locations.",
  seo_og_image: 'https://images.pexels.com/photos/1533720/pexels-photo-1533720.jpeg?auto=compress&cs=tinysrgb&w=1200',
  privacy_policy_content: '',
  terms_content: '',
};

let cache: SiteSettings | null = null;
let inFlight: Promise<SiteSettings> | null = null;
const listeners: Array<(s: SiteSettings) => void> = [];

async function loadOnce(): Promise<SiteSettings> {
  if (cache) return cache;
  if (inFlight) return inFlight;

  inFlight = fetchAdminSettings()
    .then((data) => {
      const merged: SiteSettings = { ...DEFAULT, ...data };
      cache = merged;
      listeners.forEach((fn) => fn(merged));
      return merged;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(cache || DEFAULT);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) { setSettings(cache); setLoading(false); return; }

    listeners.push(setSettings);

    loadOnce()
      .then((merged) => {
        setSettings(merged);
      })
      .catch(() => {
        // Keep UI usable when settings API is temporarily unreachable.
        setSettings(DEFAULT);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      const idx = listeners.indexOf(setSettings);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }, []);

  const invalidateCache = () => { cache = null; inFlight = null; };

  return { settings, loading, invalidateCache };
}
