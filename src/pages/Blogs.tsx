"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Clock, User, Tag, ArrowRight, Search } from "lucide-react";
import { useBlogs } from "../hooks/useBlogs";
import { useSEO } from "../hooks/useSEO";
import { useSiteSettings } from "../hooks/useSiteSettings";
import BlogShareControls from "../components/BlogShareControls";

const CATEGORIES = [
  { value: "", label: "All Articles" },
  { value: "investment", label: "Investment" },
  { value: "legal", label: "Legal & Compliance" },
  { value: "rental", label: "Rentals" },
  { value: "finance", label: "Finance & Loans" },
  { value: "commercial", label: "Commercial" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "selling", label: "Selling" },
];

const CATEGORY_COLORS: Record<string, string> = {
  investment: "bg-emerald-100 text-emerald-700",
  legal: "bg-blue-100 text-blue-700",
  rental: "bg-amber-100 text-amber-700",
  finance: "bg-teal-100 text-teal-700",
  commercial: "bg-orange-100 text-orange-700",
  lifestyle: "bg-rose-100 text-rose-700",
  selling: "bg-sky-100 text-sky-700",
  general: "bg-gray-100 text-gray-600",
};

export default function Blogs() {
  const { blogs, loading } = useBlogs();
  const { settings } = useSiteSettings();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const filtersRef = useRef<HTMLDivElement | null>(null);

  useSEO({
    title: settings.seo_title || undefined,
    description: settings.seo_description || undefined,
    ogImage: settings.seo_og_image || undefined,
  });

  const filtered = blogs.filter((b) => {
    const matchesSearch =
      !search ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !category || b.category === category;
    return matchesSearch && matchesCategory;
  });

  const featured = blogs.filter((b) => b.featured).slice(0, 2);

  useEffect(() => {
    // When switching filters, the "Featured Articles" section collapses and can
    // shift the filter row under the fixed header. Keep the filters in view.
    if (!search && !category) return;
    filtersRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [search, category]);

  return (
    <main
      className="min-h-screen pt-24 lg:pt-28"
      style={{
        background: "linear-gradient(135deg, #f0f7f0 0%, #f4f9f4 100%)",
      }}
    >
      <div className="bg-[#0a2240] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-[#c9a84c]/20 border border-[#c9a84c]/40 text-[#c9a84c] text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            Knowledge Hub
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Real Estate Insights
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Expert guides, market reports, investment tips, and legal advice —
            everything you need to navigate Goa's real estate market with
            confidence.
          </p>
        </div>
      </div>

      {featured.length > 0 && !search && !category && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-xl font-bold text-[#0a2240] mb-6">
            Featured Articles
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featured.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.id}`}
                className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={blog.cover_image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span
                    className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${CATEGORY_COLORS[blog.category] || CATEGORY_COLORS.general}`}
                  >
                    {CATEGORIES.find((c) => c.value === blog.category)?.label ||
                      blog.category}
                  </span>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">
                      {blog.title}
                    </h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                    {blog.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {blog.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {blog.read_time} min read
                      </span>
                    </div>
                    <span className="text-[#c9a84c] text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <BlogShareControls
                      compact
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
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div
          ref={filtersRef}
          className="flex flex-col sm:flex-row gap-4 mb-8 scroll-mt-24 lg:scroll-mt-28"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  category === c.value
                    ? "bg-[#0a2240] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No articles found</p>
            <p className="text-sm mt-1">
              Try a different search term or category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.id}`}
                className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={blog.cover_image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${CATEGORY_COLORS[blog.category] || CATEGORY_COLORS.general}`}
                  >
                    {CATEGORIES.find((c) => c.value === blog.category)?.label ||
                      blog.category}
                  </span>
                  {blog.youtube_url && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-red-600/90 rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[14px] border-l-white ml-1" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-[#0a2240] text-sm leading-snug mb-2 line-clamp-2 group-hover:text-[#c9a84c] transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-gray-500 text-xs line-clamp-2 mb-4 leading-relaxed">
                    {blog.excerpt}
                  </p>
                  <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      {blog.author_avatar ? (
                        <img
                          src={blog.author_avatar}
                          alt={blog.author}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : null}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {blog.read_time} min
                      </span>
                    </div>
                    {blog.tags?.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-0.5 text-xs text-gray-400"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <BlogShareControls
                      compact
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
