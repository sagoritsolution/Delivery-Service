import React from 'react';
import { Restaurant } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import {
  Clock,
  Bike,
  Star,
  MapPin,
  Flame,
  CheckCircle2,
  Shield,
  ArrowRight,
  ShoppingBasket,
  Navigation,
} from 'lucide-react';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onSelect: (restaurant: Restaurant) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onSelect }) => {
  const { language } = useLanguage();
  const { calculateFeeForDistance } = useStore();

  const distanceKm = restaurant.approxDistanceKm || 2.5;
  const { fee: calculatedFee } = calculateFeeForDistance(distanceKm);

  const getCategoryBadgeLabel = (cat: string) => {
    switch (cat) {
      case 'grocery':
        return 'মুদি ও সুপারশপ';
      case 'vegetables':
        return 'তাজা শাকসবজি';
      case 'meat_fish':
        return 'মাছ ও মাংস';
      case 'fruits':
        return 'তাজা ফলমূল';
      case 'bakery_snacks':
        return 'বেকারি ও মিষ্টি';
      case 'pharmacy':
        return 'ফার্মেসি';
      case 'restaurant':
      default:
        return 'রেস্টুরেন্ট';
    }
  };

  return (
    <div
      onClick={() => onSelect(restaurant)}
      className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 hover:border-red-300 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Cover Image & Badges */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
          <img
            src={restaurant.coverImage}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                {getCategoryBadgeLabel(restaurant.category)}
              </span>
              {restaurant.isChuijhalSpecial && (
                <span className="bg-gradient-to-r from-red-600 to-amber-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-white text-white" />
                  <span>চুইঝাল স্পেশাল</span>
                </span>
              )}
            </div>

            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs ${
                restaurant.isOpen
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-700 text-slate-200'
              }`}
            >
              {restaurant.isOpen ? 'খোলা আছে' : 'বন্ধ'}
            </span>
          </div>

          {/* Bottom Overlay on Image: Rating & Distance */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-xl font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{restaurant.rating}</span>
              <span className="text-[10px] text-slate-300 font-normal">
                ({restaurant.reviewCount})
              </span>
            </div>

            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-xl text-[11px] font-semibold text-amber-300">
              <Navigation className="w-3 h-3 text-amber-300" />
              <span>~{distanceKm} কি.মি. সড়ক দূরত্ব</span>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg group-hover:text-red-600 transition-colors line-clamp-1">
              {restaurant.banglaName}
            </h3>
          </div>

          {/* Location info */}
          <div className="flex items-center gap-1 text-xs text-slate-500 mb-2.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {restaurant.banglaAddress}
            </span>
          </div>

          {/* Cuisine / Product Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {restaurant.banglaCuisine.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info: Estimated distance fee & View Action */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="text-xs">
          <div className="text-slate-400 text-[10px]">দূরত্ব অনুযায়ী ডেলিভারি ফি:</div>
          <div className="font-bold text-slate-900 flex items-center gap-1">
            <Bike className="w-3.5 h-3.5 text-red-600" />
            <span>{calculatedFee}৳</span>
            <span className="text-[10px] text-slate-400 font-normal">
              ({distanceKm} কি.মি.)
            </span>
          </div>
        </div>

        <button
          type="button"
          className="px-3.5 py-2 rounded-xl bg-red-50 group-hover:bg-red-600 text-red-700 group-hover:text-white font-bold text-xs transition-all flex items-center gap-1 shadow-2xs"
        >
          <span>পণ্য দেখুন</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="bg-slate-50 border-t border-slate-100 px-3 py-1 text-[10px] text-slate-400 flex items-center justify-between">
        <span>{restaurant.isVerifiedPartner ? 'ভেরিফায়েড পার্টনার' : 'ইন্ডিপেন্ডেন্ট পিকআপ'}</span>
        <span className="font-semibold text-slate-500">
          {restaurant.menu.length} টি আইটেম উপলব্ধ
        </span>
      </div>
    </div>
  );
};
