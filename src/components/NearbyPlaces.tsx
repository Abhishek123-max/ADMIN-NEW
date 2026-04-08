import { MapPin } from 'lucide-react';
import { NearbySimplePlace } from '../types/property';

interface Props {
  places: NearbySimplePlace[];
}

export default function NearbyPlaces({ places }: Props) {
  if (places.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#0a2240]">Nearby Places</h2>
        <span className="text-sm text-gray-400">{places.length} place{places.length !== 1 ? 's' : ''}</span>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {places.map((item, i) => (
          <li key={`${item.place}-${item.distance}-${i}`} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-[#c9a84c] flex-shrink-0" />
              <span className="font-semibold text-[#0a2240] text-sm truncate">{item.place}</span>
            </div>
            <span className="inline-flex text-[#c9a84c] font-medium text-xs bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
              {item.distance}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
