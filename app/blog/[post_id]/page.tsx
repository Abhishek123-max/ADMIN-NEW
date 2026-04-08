import type { Metadata } from 'next';
import { headers } from 'next/headers';
import BlogDetailPage from '@/pages/BlogDetail';

type BlogMeta = {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  seo_title?: string;
  seo_description?: string;
  cover_image?: string;
  author?: string;
  created_at?: string;
  updated_at?: string;
};

function unwrapBlog(data: unknown): BlogMeta | null {
  if (!data || typeof data !== 'object') return null;
  const obj = data as Record<string, unknown>;
  const inner = (obj.data || obj.blog_post || obj.post || obj) as Record<string, unknown>;
  if (!inner || typeof inner !== 'object') return null;

  return {
    id: String(inner.id || ''),
    title: String(inner.title || ''),
    excerpt: String(inner.excerpt || ''),
    content: inner.content ? String(inner.content) : undefined,
    seo_title: inner.seo_title ? String(inner.seo_title) : undefined,
    seo_description: inner.seo_description ? String(inner.seo_description) : undefined,
    cover_image: inner.cover_image ? String(inner.cover_image) : undefined,
    author: inner.author ? String(inner.author) : undefined,
    created_at: inner.created_at ? String(inner.created_at) : undefined,
    updated_at: inner.updated_at ? String(inner.updated_at) : undefined,
  };
}

async function fetchBlogMeta(postId: string): Promise<BlogMeta | null> {
  const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '');
  if (!apiBase || !postId) return null;

  try {
    const res = await fetch(
      `${apiBase}/admin/blog-posts/${encodeURIComponent(postId)}?published=true`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as unknown;
    return unwrapBlog(json);
  } catch {
    return null;
  }
}

function toAbsoluteAssetUrl(raw: string | undefined, siteUrl: string): string {
  const value = (raw || '').trim();
  if (!value) return `${siteUrl}/favicon.svg`;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('//')) return `https:${value}`;

  const assetBase = (
    process.env.NEXT_PUBLIC_ASSET_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    siteUrl
  )
    .replace(/\/+$/, '')
    .replace(/\/api$/, '');

  if (value.startsWith('/')) return `${assetBase}${value}`;
  return `${assetBase}/${value}`;
}

export async function generateMetadata(
  { params }: { params: Promise<{ post_id: string }> },
): Promise<Metadata> {
  const { post_id } = await params;
  const blog = await fetchBlogMeta(post_id);

  const h = await headers();
  const host = h.get('x-forwarded-host') || h.get('host') || '';
  const proto = h.get('x-forwarded-proto') || 'https';

  const envSiteUrl = (
    process.env.NEXT_PUBLIC_PUBLIC_SITE_URL ||
    'https://westernproperties.in'
  ).replace(/\/+$/, '');
  const siteUrl = host ? `${proto}://${host}` : envSiteUrl;
  const canonical = `${siteUrl}/blog/${post_id}`;
  const title = blog?.seo_title || blog?.title || 'Blog';
  const description = blog?.seo_description || blog?.excerpt || 'Read our latest real estate insights.';
  const image = toAbsoluteAssetUrl(blog?.cover_image, siteUrl);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'article',
      publishedTime: blog?.created_at,
      modifiedTime: blog?.updated_at || blog?.created_at,
      authors: blog?.author ? [blog.author] : undefined,
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

export default async function Page(
  { params }: { params: Promise<{ post_id: string }> },
) {
  const { post_id } = await params;
  const blog = await fetchBlogMeta(post_id);
  const h = await headers();
  const host = h.get('x-forwarded-host') || h.get('host') || '';
  const proto = h.get('x-forwarded-proto') || 'https';
  const envSiteUrl = (process.env.NEXT_PUBLIC_PUBLIC_SITE_URL || 'https://westernproperties.in').replace(/\/+$/, '');
  const siteUrl = host ? `${proto}://${host}` : envSiteUrl;
  const canonical = `${siteUrl}/blog/${post_id}`;
  const image = toAbsoluteAssetUrl(blog?.cover_image, siteUrl);

  const articleJsonLd = blog
    ? {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: blog.seo_title || blog.title,
      description: blog.seo_description || blog.excerpt,
      image: [image],
      url: canonical,
      datePublished: blog.created_at,
      dateModified: blog.updated_at || blog.created_at,
      author: blog.author ? { '@type': 'Person', name: blog.author } : undefined,
      publisher: {
        '@type': 'Organization',
        name: 'WesternProperties',
        logo: {
          '@type': 'ImageObject',
          url: `${envSiteUrl}/favicon.svg`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonical,
      },
    }
    : null;

  return (
    <>
      {articleJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      ) : null}
      <BlogDetailPage />
    </>
  );
}
