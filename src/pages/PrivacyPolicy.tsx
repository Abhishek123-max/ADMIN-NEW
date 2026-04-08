"use client";

import { useSEO } from '../hooks/useSEO';
import { useSiteSettings } from '../hooks/useSiteSettings';

export default function PrivacyPolicy() {
  const { settings, loading } = useSiteSettings();

  useSEO({
    title: settings.seo_title || undefined,
    description: settings.seo_description || undefined,
    ogImage: settings.seo_og_image || undefined,
  });

  const content = settings.privacy_policy_content?.trim() || '';

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-12">
          <h1 className="text-3xl font-bold text-[#0a2240] mb-2">Privacy Policy</h1>
          <p className="text-gray-400 text-sm mb-8">
            Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-gray-100 rounded-lg" />)}
            </div>
          ) : content ? (
            <div
              className="prose prose-sm max-w-none text-gray-600
                [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-[#0a2240] [&_h2]:mb-3 [&_h2]:mt-6
                [&_p]:leading-relaxed [&_p]:mb-3
                [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ul]:my-2
                [&_li]:leading-relaxed
                [&_strong]:font-semibold [&_strong]:text-gray-700
                [&_a]:text-[#c9a84c] [&_a]:hover:underline
                [&_section]:mb-6"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <p className="text-gray-500">Privacy policy content is not available right now.</p>
          )}
        </div>
      </div>
    </main>
  );
}
