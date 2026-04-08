export interface Post {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
  imageUrl?: string;
}

export interface SharePayload {
  url: string;
  title: string;
  excerpt: string;
  imageUrl?: string;
}

export type SharePlatform =
  | 'facebook'
  | 'twitter'
  | 'x'
  | 'linkedin'
  | 'pinterest'
  | 'whatsapp'
  | 'telegram'
  | 'reddit';

const FALLBACK_SITE = (process.env.NEXT_PUBLIC_PUBLIC_SITE_URL || 'https://westernproperties.in').replace(/\/+$/, '');
const FALLBACK_API = (process.env.NEXT_PUBLIC_API_BASE_URL || FALLBACK_SITE).replace(/\/+$/, '').replace(/\/api$/, '');

export function stripHtmlTags(input: string): string {
  return (input || '')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//i.test(url) || url.startsWith('//');
}

function resolveSiteOrigin(): string {
  if (typeof window !== 'undefined' && window.location?.origin) return window.location.origin;
  return FALLBACK_SITE;
}

export function buildCanonicalBlogUrl(postId: string, siteOrigin = resolveSiteOrigin()): string {
  const base = (siteOrigin || FALLBACK_SITE).replace(/\/+$/, '');
  return `${base}/blog/${encodeURIComponent(postId)}`;
}

export function toAbsoluteImageUrl(imageUrl?: string, baseOrigin = resolveSiteOrigin()): string | undefined {
  const raw = (imageUrl || '').trim();
  if (!raw) return undefined;
  if (isAbsoluteUrl(raw)) return raw.startsWith('//') ? `https:${raw}` : raw;

  const assetBase = (FALLBACK_API || baseOrigin).replace(/\/+$/, '');
  if (raw.startsWith('/')) return `${assetBase}${raw}`;
  return `${assetBase}/${raw}`;
}

export function buildSharePayload(post: Post, siteOrigin = resolveSiteOrigin()): SharePayload {
  const cleanTitle = stripHtmlTags(post.title || 'Blog');
  const cleanExcerpt = stripHtmlTags(post.excerpt || '');
  const cleanContent = stripHtmlTags(post.content || '');
  const excerpt = cleanExcerpt || (cleanContent ? `${cleanContent.slice(0, 160)}...` : cleanTitle);

  return {
    url: buildCanonicalBlogUrl(post.id, siteOrigin),
    title: cleanTitle,
    excerpt,
    imageUrl: toAbsoluteImageUrl(post.imageUrl, siteOrigin),
  };
}

export function generateShareUrl(platform: SharePlatform, payload: SharePayload): string {
  const url = encodeURIComponent(payload.url);
  const title = encodeURIComponent(payload.title);
  const excerpt = encodeURIComponent(payload.excerpt);
  const textWithExcerpt = encodeURIComponent(`${payload.title}\n${payload.excerpt}`);
  const media = encodeURIComponent(payload.imageUrl || '');

  switch (platform) {
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    case 'twitter':
    case 'x':
      return `https://twitter.com/intent/tweet?url=${url}&text=${textWithExcerpt}`;
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${excerpt}`;
    case 'pinterest':
      return `https://pinterest.com/pin/create/button/?url=${url}&media=${media}&description=${title}`;
    case 'whatsapp':
      return `https://wa.me/?text=${encodeURIComponent(`${payload.title} ${payload.url}`)}`;
    case 'telegram':
      return `https://t.me/share/url?url=${url}&text=${title}`;
    case 'reddit':
      return `https://reddit.com/submit?url=${url}&title=${title}`;
    default:
      return payload.url;
  }
}

function isMobileDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent || '');
}

export async function handleShare(platform: SharePlatform, post: Post): Promise<void> {
  if (typeof window === 'undefined') return;
  const payload = buildSharePayload(post);

  try {
    if (isMobileDevice() && typeof navigator !== 'undefined' && navigator.share) {
      await navigator.share({
        title: payload.title,
        text: payload.excerpt,
        url: payload.url,
      });
      return;
    }

    const shareUrl = generateShareUrl(platform, payload);
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=640,height=560');
  } catch {
    // Keep UI stable if popup/native share is blocked or cancelled.
  }
}

export async function handleCopy(postId: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  const canonicalUrl = buildCanonicalBlogUrl(postId);

  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(canonicalUrl);
      return true;
    }
  } catch {
    // Fall through to legacy copy.
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = canonicalUrl;
    textArea.setAttribute('readonly', 'true');
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textArea);
    return ok;
  } catch {
    return false;
  }
}
