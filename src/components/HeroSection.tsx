"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown, ChevronLeft, ChevronRight, Tag, Phone } from 'lucide-react';
import { SITE_CONFIG } from '../lib/config';
import { fetchBanners, type BannerSlide } from '../services/banners';
import { getApiErrorMessage } from '../lib/api';

const PROPERTY_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'land_sale', label: 'Land for Sale' },
  { value: 'room_rent', label: 'Room for Rent' },
  { value: 'land_rent', label: 'Land for Rent' },
  { value: 'commercial_rent', label: 'Commercial Rent' },
  { value: 'lease', label: 'Lease' },
];

type HeroSlide = {
  image: string;
  label: string;
  subtitle: string;
  isSell: boolean;
};

function mapApiSlideToHeroSlide(s: BannerSlide): HeroSlide | null {
  if (!s.image_url) return null;
  return {
    image: s.image_url,
    label: s.badge || 'Featured',
    subtitle: s.subtitle || '',
    isSell: !!s.is_sell,
  };
}

export default function HeroSection() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFetchError(null);

    fetchBanners()
      .then((data) => {
        if (cancelled) return;
        const mapped = (data || []).map(mapApiSlideToHeroSlide).filter(Boolean) as HeroSlide[];
        setSlides(mapped);
        setCurrent(0);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setFetchError(getApiErrorMessage(e, 'Failed to load banners'));
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (current >= slides.length && slides.length > 0) setCurrent(0);
  }, [slides.length, current]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (type) params.set('type', type);
    router.push(`/properties?${params.toString()}`);
  };

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);
  const currentSlide = slides[current];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {loading && (
        <div className="absolute inset-0 z-30 bg-[#071829] flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-[#c9a84c]/30 border-t-[#c9a84c] rounded-full animate-spin" />
        </div>
      )}

      {slides.map((slide, i) => (
        <div
          key={`${slide.label}-${i}`}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-[#071829]/75 via-[#0a2240]/60 to-[#071829]/85" />

      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23c9a84c' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='4' cy='4' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {slides.length > 0 && (
        <>
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
            {slides.map((slide, i) => (
              <button
                key={`${slide.label}-${i}-dot`}
                onClick={() => setCurrent(i)}
                type="button"
                className={`transition-all duration-300 rounded-full ${
                  i === current ? 'w-8 h-2 bg-[#c9a84c]' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={slide.label}
              />
            ))}
          </div>

          <button
            onClick={prev}
            type="button"
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/10 hover:bg-[#c9a84c]/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all border border-white/20 hover:border-[#c9a84c]"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={next}
            type="button"
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/10 hover:bg-[#c9a84c]/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all border border-white/20 hover:border-[#c9a84c]"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {fetchError && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 max-w-lg px-4">
          <p className="text-red-200 text-sm text-center bg-red-950/80 border border-red-800/80 rounded-xl px-4 py-2">
            {fetchError}
          </p>
        </div>
      )}

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        <div className="inline-flex items-center gap-2 bg-[#c9a84c]/15 border border-[#c9a84c]/40 text-[#c9a84c] rounded-full px-5 py-2 text-sm font-semibold mb-6 backdrop-blur-sm">
          <span className="w-2 h-2 bg-[#c9a84c] rounded-full animate-pulse" />
          {currentSlide?.label || 'Featured'}
        </div>

        {currentSlide?.isSell ? (
          <>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-4 tracking-tight">
              Sell Your Property
              <span
                className="block mt-1"
                style={{ color: '#c9a84c', textShadow: '0 0 60px rgba(201,168,76,0.4)' }}
              >
                At the Best Price
              </span>
            </h1>
            <p className="text-white/75 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              {currentSlide?.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="bg-[#c9a84c] hover:bg-[#b8963e] text-white px-10 py-4 rounded-xl font-bold text-lg transition-all hover:shadow-2xl flex items-center gap-3"
              >
                <Tag className="w-5 h-5" />
                Contact Us to Sell
              </Link>
              <a
                href={`tel:${SITE_CONFIG.phoneRaw}`}
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 px-10 py-4 rounded-xl font-semibold text-lg transition-all"
              >
                <Phone className="w-5 h-5" />
                {SITE_CONFIG.phone}
              </a>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
              {[
                { label: 'Free Valuation', desc: "Know your property's true worth" },
                { label: 'Wide Buyer Network', desc: 'Thousands of qualified buyers' },
                { label: 'Quick Closure', desc: 'Fast, transparent transactions' },
              ].map(({ label, desc }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3"
                >
                  <span className="w-2 h-2 bg-[#c9a84c] rounded-full flex-shrink-0" />
                  <div className="text-left">
                    <div className="text-white font-semibold text-sm">{label}</div>
                    <div className="text-white/60 text-xs">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-4 tracking-tight">
              Find Your Perfect
              <span
                className="block mt-1"
                style={{ color: '#c9a84c', textShadow: '0 0 60px rgba(201,168,76,0.4)' }}
              >
                Dream Property
              </span>
            </h1>
            <p className="text-white/75 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              {currentSlide?.subtitle}
            </p>
            <form
              onSubmit={handleSearch}
              className="bg-white/95 backdrop-blur-md rounded-2xl p-2 shadow-2xl max-w-3xl mx-auto flex flex-col sm:flex-row gap-2 border border-white/20"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by city, location, or keyword..."
                  className="w-full pl-12 pr-4 py-3.5 text-gray-800 focus:outline-none text-sm bg-transparent"
                />
              </div>
              <div className="relative sm:w-48">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full appearance-none bg-gray-50 rounded-xl pl-4 pr-8 py-3.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] cursor-pointer"
                >
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <button
                type="submit"
                className="bg-[#c9a84c] hover:bg-[#b8963e] text-white px-8 py-3.5 rounded-xl font-semibold transition-all hover:shadow-lg whitespace-nowrap"
              >
                Search
              </button>
            </form>
          </>
        )}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 animate-bounce z-10">
        <ChevronDown className="w-6 h-6" />
      </div>
    </section>
  );
}
