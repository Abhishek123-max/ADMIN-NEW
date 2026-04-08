"use client";

import { useRouter } from 'next/navigation';
import { usePropertyTypesContext } from '../contexts/PropertyTypesContext';

export default function PropertyTypesSection() {
  const router = useRouter();
  const { cards, loading, error } = usePropertyTypesContext();

  return (
    <section className="py-20" style={{ background: 'linear-gradient(135deg, #f0f7f0 0%, #f4f9f4 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-[#c9a84c] font-semibold text-sm uppercase tracking-wider">What We Offer</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0a2240] mt-2 mb-4">Explore Property Categories</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Whether you're looking to buy, rent, or lease — we have the right property for every need.
          </p>
        </div>

        {error && (
          <p className="text-center text-red-600 text-sm mb-4">{error}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                <div className="h-36 bg-gray-100" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))
          ) : (
            cards.map(({ value, label, description, Icon, iconBg, iconColor, count, image }) => (
            <button
              key={value}
              onClick={() => router.push(`/properties?type=${value}`)}
              className="group text-left bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className="relative h-36 overflow-hidden">
                <img
                  src={image}
                  alt={label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className={`absolute bottom-3 left-3 w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-[#0a2240] text-sm mb-1 group-hover:text-[#c9a84c] transition-colors">{label}</h3>
                <p className="text-gray-500 text-xs leading-relaxed mb-2">{description}</p>
                <span className="text-[#c9a84c] text-xs font-semibold">{count}+ listings</span>
              </div>
            </button>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
