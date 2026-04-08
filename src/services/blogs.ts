import { api } from '../lib/api';
import type { Blog } from '../hooks/useBlogs';
import { resolveAssetUrl } from '../lib/resolveAssetUrl';

function isBlogVisible(raw: unknown): boolean {
  if (!raw || typeof raw !== 'object') return true;
  const obj = raw as Record<string, unknown>;
  const flags = [obj.active, obj.is_active, obj.visible, obj.is_visible, obj.published];
  return !flags.includes(false);
}

function unwrapBlogList(data: unknown): Blog[] {
  if (Array.isArray(data)) return (data as Blog[]).filter(isBlogVisible);
  if (data && typeof data === 'object' && 'data' in (data as object) && Array.isArray((data as { data: unknown }).data)) {
    return (data as { data: Blog[] }).data;
  }
  if (
    data &&
    typeof data === 'object' &&
    'blog_posts' in (data as object) &&
    Array.isArray((data as { blog_posts: unknown }).blog_posts)
  ) {
    return (data as { blog_posts: Blog[] }).blog_posts.filter(isBlogVisible);
  }
  if (data && typeof data === 'object' && 'posts' in (data as object) && Array.isArray((data as { posts: unknown }).posts)) {
    return (data as { posts: Blog[] }).posts.filter(isBlogVisible);
  }
  return [];
}

function unwrapBlogOne(data: unknown): Blog | null {
  if (!data || typeof data !== 'object') return null;
  const o = data as Record<string, unknown>;
  const candidate =
    (o.data && typeof o.data === 'object' ? (o.data as Blog) : null) ||
    (o.blog_post && typeof o.blog_post === 'object' ? (o.blog_post as Blog) : null) ||
    (o.post && typeof o.post === 'object' ? (o.post as Blog) : null) ||
    (data as Blog);
  if (!isBlogVisible(candidate)) return null;
  return candidate;
}

function normalizeBlog(b: Blog): Blog {
  return {
    ...b,
    cover_image: resolveAssetUrl(b.cover_image),
    author_avatar: resolveAssetUrl(b.author_avatar),
    images: Array.isArray(b.images) ? b.images.map((u) => resolveAssetUrl(u)) : [],
  };
}

export async function fetchBlogs(limit?: number) {
  const { data } = await api.get<unknown>('/admin/blog-posts', {
    params: {
      published: true,
      ...(limit != null ? { limit } : {}),
    },
  });
  const list = unwrapBlogList(data);
  return list.map(normalizeBlog);
}

export async function fetchBlogBySlug(slug: string) {
  const { data } = await api.get<unknown>(`/admin/blog-posts/${encodeURIComponent(slug)}`, {
    params: { published: true },
  });
  const one = unwrapBlogOne(data);
  return one ? normalizeBlog(one) : null;
}
