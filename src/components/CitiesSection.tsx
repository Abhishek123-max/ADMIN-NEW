"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { MapPin, ArrowRight } from "lucide-react";
import { usePropertyTypesContext } from "../contexts/PropertyTypesContext";
import { resolveAssetUrl } from "../lib/resolveAssetUrl";

interface CityData {
  city: string;
  state: string;
  count: number;
  image: string;
}

function pickCityImage(property: {
  cover_image?: string | null;
  property_images?: { url: string }[] | null;
}): string {
  if (property.cover_image) return resolveAssetUrl(property.cover_image);
  if (property.property_images && property.property_images.length > 0) {
    const first = property.property_images[0];
    if (first?.url) return resolveAssetUrl(first.url);
  }
  return "";
}

export default function CitiesSection() {
  const router = useRouter();
  const { properties, loading } = usePropertyTypesContext();
  const cities = useMemo<CityData[]>(() => {
    const map = new Map<string, CityData>();
    properties.forEach((p) => {
      const city = (p.city || "").trim();
      if (!city) return;
      const existing = map.get(city);
      if (!existing) {
        map.set(city, {
          city,
          state: p.state || "",
          count: 1,
          image: pickCityImage(p),
        });
      } else {
        existing.count += 1;
        // Prefer first available API image for that city if missing.
        if (!existing.image) {
          const img = pickCityImage(p);
          if (img) existing.image = img;
        }
      }
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [properties]);

  if (!loading && cities.length === 0) return null;

  return (
    <section className="py-20 bg-[#071829]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-[#c9a84c] font-semibold text-sm uppercase tracking-wider">
              Explore by Location
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
              Properties in Cities
            </h2>
            <p className="text-white/50 mt-2 max-w-lg text-sm">
              Discover verified properties across India's most sought-after
              coastal and inland cities.
            </p>
          </div>
          <button
            onClick={() => router.push("/properties")}
            className="hidden sm:flex items-center gap-2 text-[#c9a84c] hover:text-white font-semibold text-sm transition-colors"
          >
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white/5 rounded-2xl aspect-[3/2] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {cities.map((c) => (
              <button
                key={c.city}
                onClick={() =>
                  router.push(`/properties?city=${encodeURIComponent(c.city)}`)
                }
                className="group relative rounded-2xl overflow-hidden aspect-[3/2] cursor-pointer"
              >
                {c.image ? (
                  <img
                    src={c.image}
                    alt={c.city}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-[#0a2240]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#071829]/90 via-[#071829]/40 to-transparent group-hover:from-[#071829]/95 transition-all duration-300" />

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-1.5 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-[#c9a84c] flex-shrink-0" />
                    <h3 className="text-white font-bold text-base leading-tight">
                      {c.city}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-xs">{c.state}</span>
                    <span className="bg-[#c9a84c]/20 border border-[#c9a84c]/40 text-[#c9a84c] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {c.count} {c.count === 1 ? "property" : "properties"}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-white/0 group-hover:text-white/80 transition-all text-xs font-medium">
                    <span>Browse properties</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>

                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#c9a84c]/40 rounded-2xl transition-all duration-300" />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
