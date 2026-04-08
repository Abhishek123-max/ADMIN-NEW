import BlogsPage from '@/pages/Blogs';
import type { Metadata } from 'next';
import { headers } from 'next/headers';

function resolveSiteUrl() {
  const envSiteUrl = (process.env.NEXT_PUBLIC_PUBLIC_SITE_URL || 'https://westernproperties.in').replace(/\/+$/, '');
  return envSiteUrl;
}

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const host = h.get('x-forwarded-host') || h.get('host') || '';
  const proto = h.get('x-forwarded-proto') || 'https';
  const siteUrl = host ? `${proto}://${host}` : resolveSiteUrl();
  const canonical = `${siteUrl}/blog`;
  const title = 'Real Estate Blog';
  const description = 'Real estate insights, legal guides, and property investment tips for Goa buyers, sellers, and renters.';
  const image = `${resolveSiteUrl()}/favicon.svg`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default function Page() {
  return <BlogsPage />;
}
