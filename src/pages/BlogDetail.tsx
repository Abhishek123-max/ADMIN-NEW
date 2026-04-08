"use client";

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Clock, User, Tag, ArrowLeft, Calendar, ChevronRight } from 'lucide-react';
import { useBlog, useBlogs } from '../hooks/useBlogs';
import { useSEO } from '../hooks/useSEO';
import BlogShareControls from '../components/BlogShareControls';

const CATEGORY_LABELS: Record<string, string> = {
  investment: 'Investment',
  legal: 'Legal & Compliance',
  rental: 'Rentals',
  finance: 'Finance & Loans',
  commercial: 'Commercial',
  lifestyle: 'Lifestyle',
  selling: 'Selling',
  general: 'General',
};

const CATEGORY_COLORS: Record<string, string> = {
  investment: 'bg-emerald-100 text-emerald-700',
  legal: 'bg-blue-100 text-blue-700',
  rental: 'bg-amber-100 text-amber-700',
  finance: 'bg-teal-100 text-teal-700',
  commercial: 'bg-orange-100 text-orange-700',
  lifestyle: 'bg-rose-100 text-rose-700',
  selling: 'bg-sky-100 text-sky-700',
  general: 'bg-gray-100 text-gray-600',
};

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([^&?/\s]+)/);
  return match ? match[1] : null;
}

export default function BlogDetail() {
  const params = useParams<{ post_id: string }>();
  const post_id = params?.post_id || '';
  const { blog, loading, error } = useBlog(post_id || '');
  const { blogs: relatedBlogs } = useBlogs(6);

  useSEO({
    title: blog?.seo_title || blog?.title,
    description: blog?.seo_description || blog?.excerpt,
    ogImage: blog?.cover_image,
  });

  const related = relatedBlogs
    .filter((b) => b.id !== (post_id || '') && b.category === blog?.category)
    .slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen pt-20" style={{ background: 'linear-gradient(135deg, #f0f7f0 0%, #f4f9f4 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-2/3" />
          <div className="h-80 bg-gray-200 rounded-2xl" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-4 bg-gray-200 rounded" />)}
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#0a2240] mb-4">Article not found</h2>
          <Link href="/blog" className="text-[#c9a84c] hover:underline">Back to all articles</Link>
        </div>
      </div>
    );
  }

  const youtubeId = blog.youtube_url ? getYouTubeId(blog.youtube_url) : null;
  const images: string[] = Array.isArray(blog.images) ? blog.images : [];
  const tags: string[] = Array.isArray(blog.tags) ? blog.tags : [];

  return (
    <main className="min-h-screen pt-20 pb-16" style={{ background: 'linear-gradient(135deg, #f0f7f0 0%, #f4f9f4 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 py-4 mb-4">
          <Link href="/" className="hover:text-[#c9a84c] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/blog" className="hover:text-[#c9a84c] transition-colors">Blog</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-700 truncate max-w-[200px]">{blog.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <article className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <div className="relative h-72 sm:h-96">
                <img src={blog.cover_image} alt={blog.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${CATEGORY_COLORS[blog.category] || CATEGORY_COLORS.general}`}>
                  {CATEGORY_LABELS[blog.category] || blog.category}
                </span>
              </div>

              <div className="p-6 sm:p-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0a2240] leading-tight mb-4">{blog.title}</h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
                  <span className="flex items-center gap-2">
                    {blog.author_avatar && <img src={blog.author_avatar} alt={blog.author} className="w-8 h-8 rounded-full object-cover" />}
                    <User className="w-4 h-4" />
                    <span className="font-medium text-gray-700">{blog.author}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {new Date(blog.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {blog.read_time} min read
                  </span>
                </div>

                <p className="text-gray-600 text-lg leading-relaxed mb-8 font-medium border-l-4 border-[#c9a84c] pl-4 italic">
                  {blog.excerpt}
                </p>

                {youtubeId && (
                  <div className="mb-8 rounded-2xl overflow-hidden aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}`}
                      title={blog.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                <div
                  className="prose prose-lg max-w-none text-gray-700
                    [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#0a2240] [&_h2]:mt-10 [&_h2]:mb-4
                    [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[#0a2240] [&_h3]:mt-6 [&_h3]:mb-3
                    [&_p]:leading-relaxed [&_p]:mb-4 [&_p]:text-gray-600
                    [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:my-4
                    [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:my-4
                    [&_li]:leading-relaxed [&_li]:text-gray-600
                    [&_strong]:font-semibold [&_strong]:text-gray-800
                    [&_a]:text-[#c9a84c] [&_a]:hover:underline
                    [&_blockquote]:border-l-4 [&_blockquote]:border-[#c9a84c] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-500"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                {images.length > 0 && (
                  <div className="mt-10">
                    <h3 className="text-lg font-bold text-[#0a2240] mb-4">Photo Gallery</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {images.map((img, i) => (
                        <div key={i} className="rounded-xl overflow-hidden aspect-video">
                          <img src={img} alt={`${blog.title} ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag className="w-4 h-4 text-gray-400" />
                      {tags.map(tag => (
                        <span key={tag} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-[#0a2240] mb-1">Share this article</h3>
                      <p className="text-gray-500 text-sm">Found this useful? Share with your network.</p>
                    </div>
                    <BlogShareControls
                      post={{
                        id: blog.id,
                        title: blog.title,
                        excerpt: blog.excerpt,
                        content: blog.content,
                        imageUrl: blog.cover_image,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Link href="/blog" className="inline-flex items-center gap-2 text-[#0a2240] hover:text-[#c9a84c] font-semibold text-sm transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to all articles
              </Link>
            </div>
          </article>

          <aside className="space-y-6">
            <div className="bg-gradient-to-br from-[#0a2240] to-[#0d3a6e] rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-2">Interested in a Property?</h3>
              <p className="text-white/70 text-sm mb-4 leading-relaxed">Our experts are ready to help you find the perfect property in Goa.</p>
              <Link
                href="/contact"
                className="block text-center bg-[#c9a84c] hover:bg-[#b8963e] text-white py-3 rounded-xl font-semibold text-sm transition-all"
              >
                Get Free Consultation
              </Link>
              <Link
                href="/properties"
                className="block text-center mt-2 border border-white/30 text-white/80 hover:bg-white/10 py-3 rounded-xl font-semibold text-sm transition-all"
              >
                Browse Properties
              </Link>
            </div>

            {related.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-bold text-[#0a2240] mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {related.map(r => (
                    <Link key={r.id} href={`/blog/${r.id}`} className="flex gap-3 group">
                      <img src={r.cover_image} alt={r.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#0a2240] group-hover:text-[#c9a84c] transition-colors line-clamp-2 leading-snug">{r.title}</p>
                        <span className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />{r.read_time} min read
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
