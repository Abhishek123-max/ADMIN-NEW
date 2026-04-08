import type { Metadata } from 'next';
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

function unwrapBlog(data: any): BlogMeta | null {
  if (!data) return null;
  const inner = data.data || data.blog_post || data.post || data;

  return {
    id: String(inner.id || ''),
    title: String(inner.title || ''),
    excerpt: String(inner.excerpt || ''),
    content: inner.content,
    seo_title: inner.seo_title,
    seo_description: inner.seo_description,
    cover_image: inner.cover_image,
    author: inner.author,
    created_at: inner.created_at,
    updated_at: inner.updated_at,
  };
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '') || '';
const SITE_URL = process.env.NEXT_PUBLIC_PUBLIC_SITE_URL || 'https://westernproperties.in';

async function fetchAllPosts() {
  try {
    const res = await fetch(`${API_BASE}/admin/blog-posts?published=true`);
    const data = await res.json();
    return data?.data || [];
  } catch {
    return [];
  }
}

async function fetchBlogMeta(postId: string): Promise<BlogMeta | null> {
  try {
    const res = await fetch(`${API_BASE}/admin/blog-posts/${postId}?published=true`);
    if (!res.ok) return null;
    const json = await res.json();
    return unwrapBlog(json);
  } catch {
    return null;
  }
}

function toAbsoluteAssetUrl(raw: string | undefined): string {
  if (!raw) return `${SITE_URL}/favicon.svg`;
  if (/^https?:\/\//i.test(raw)) return raw;
  return `${API_BASE.replace(/\/api$/, '')}/${raw}`;
}

---

## ✅ 🔥 REQUIRED FOR STATIC EXPORT

export async function generateStaticParams() {
  const posts = await fetchAllPosts();

  return posts.map((post: any) => ({
    post_id: post.id.toString(),
  }));
}

---

export async function generateMetadata(
  { params }: { params: { post_id: string } }
): Promise<Metadata> {

  const blog = await fetchBlogMeta(params.post_id);

  const canonical = `${SITE_URL}/blog/${params.post_id}`;
  const title = blog?.seo_title || blog?.title || 'Blog';
  const description = blog?.seo_description || blog?.excerpt || '';

  const image = toAbsoluteAssetUrl(blog?.cover_image);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'article',
      images: [{ url: image }],
    },
  };
}

---

export default async function Page(
  { params }: { params: { post_id: string } }
) {
  const blog = await fetchBlogMeta(params.post_id);

  return <BlogDetailPage blog={blog} />;
}
