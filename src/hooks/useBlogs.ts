import { useState, useEffect } from 'react';
import { getApiErrorMessage } from '../lib/api';
import { fetchBlogs, fetchBlogBySlug } from '../services/blogs';

export interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  images: string[];
  youtube_url: string;
  tags: string[];
  category: string;
  author: string;
  author_avatar: string;
  read_time: number;
  published: boolean;
  featured: boolean;
  seo_title: string;
  seo_description: string;
  created_at: string;
  updated_at: string;
}

export function useBlogs(limit?: number) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs(limit).then((data) => {
      setBlogs(data);
    }).catch((e: unknown) => {
      setError(getApiErrorMessage(e, 'Failed to load blogs'));
    }).finally(() => {
      setLoading(false);
    });
  }, [limit]);

  return { blogs, loading, error };
}

export function useBlog(slug: string) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    fetchBlogBySlug(slug)
      .then((data) => {
        setBlog(data);
      })
      .catch((e: unknown) => {
        setError(getApiErrorMessage(e, 'Failed to load blog'));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  return { blog, loading, error };
}
