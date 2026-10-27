import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { Restaurant, StoreCategory } from '../types';
import { RestaurantCard } from './RestaurantCard';
import { PLATFORM_CATEGORIES } from '../data/mockData';
import {
  Search,
  MapPin,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Compass,
  UtensilsCrossed,
  ShoppingBasket,
  Carrot,
  Fish,
  Apple,
  Cake,
  Pill,
} from 'lucide-react';

interface RestaurantListSectionProps {
  onSelectRestaurant: (restaurant: Restaurant) => void;
  externalSearchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const RestaurantListSection: React.FC<RestaurantListSectionProps> = ({
  onSelectRestaurant,
  externalSearchQuery = '',
  onSearchChange,
}) => {
  const {
    restaurants,
    deliveryZones,
    setActiveView,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
  } = useStore();
  const { language } = useLanguage();

  const [selectedAreaFilter, setSelectedAreaFilter] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'verified' | 'open' | 'chuijhal'>('all');

  const filteredStores = useMemo(() => {
    return restaurants.filter(store => {
      // Area filter
      if (selectedAreaFilter !== 'all' && store.area !== selectedAreaFilter) {
        return false;
      }

      // Quick filter
      if (filterType === 'chuijhal' && !store.isChuijhalSpecial) {
        return false;
      }
      if (filterType === 'verified' && !store.isVerifiedPartner) {
        return false;
      }
      if (filterType === 'open' && !store.isOpen) {
        return false;
      }

      // Category filter
      if (selectedCategoryFilter !== 'all') {
        if (store.category !== selectedCategoryFilter) {
          return false;
        }
      }

      // Search query filter (matches store name, address, cuisine, products)
      if (externalSearchQuery.trim()) {
        const q = externalSearchQuery.toLowerCase().trim();
        const matchesName =
          store.name.toLowerCase().includes(q) ||
          store.banglaName.toLowerCase().includes(q);
        const matchesAddress =
          store.address.toLowerCase().includes(q) ||
          store.banglaAddress.toLowerCase().includes(q);
        const matchesCuisine =
          store.cuisine.some(c => c.toLowerCase().includes(q)) ||
          store.banglaCuisine.some(c => c.toLowerCase().includes(q));
        const matchesMenu = store.menu.some(
          m =>
            m.name.toLowerCase().includes(q) ||
            m.banglaName.toLowerCase().includes(q) ||
            m.description.toLowerCase().includes(q)
        );

        if (!matchesName && !matchesAddress && !matchesCuisine && !matchesMenu) {
          return false;
        }
      }

      return true;
    });
  }, [restaurants, selectedAreaFilter, filterType, selectedCategoryFilter, externalSearchQuery]);

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'restaurant':
        return <UtensilsCrossed className="w-3.5 h-3.5" />;
      case 'grocery':
        return <ShoppingBasket className="w-3.5 h-3.5" />;
      case 'vegetables':
        return <Carrot className="w-3.5 h-3.5" />;
      case 'meat_fish':
        return <Fish className="w-3.5 h-3.5" />;
      case 'fruits':
        return <Apple className="w-3.5 h-3.5" />;
      case 'bakery_snacks':
        return <Cake className="w-3.5 h-3.5" />;
      case 'pharmacy':
        return <Pill className="w-3.5 h-3.5" />;
      default:
        return <Compass className="w-3.5 h-3.5" />;
    }
  };

  return (
    <section className="py-8 sm:py-12 bg-slate-50" id="stores-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Title & Custom Order Callout Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold mb-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>খুলনার সকল দোকান, সুপারশপ ও কাঁচাবাজার</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              দোকান ও পণ্য ব্রাউজ করুন
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              খাবার, তাজা সবজি, মাছ-মাংস, গ্রোসারি কিংবা ওষুধ—নির্বাচিত দোকান থেকে কার্টে যোগ করুন
            </p>
          </div>

          {/* Prominent Custom Shopping CTA */}
          <button
            onClick={() => {
              setActiveView('custom_order');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="p-3.5 sm:px-5 sm:py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all flex items-center justify-between gap-3 group shrink-0 cursor-pointer"
          >
            <div className="flex items-center gap-2 text-left">
              <Sparkles className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform" />
              <div>
                <span className="block leading-tight font-extrabold">পছন্দের দোকান খুঁজে পাচ্ছেন না?</span>
                <span className="text-[10px] text-amber-950/80 font-semibold">কাস্টম শপিং রিকোয়েস্ট দিন</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Category Filter Pills Bar */}
        <div className="py-2 overflow-x-auto scrollbar-none flex items-center gap-2">
          {PLATFORM_CATEGORIES.map(category => {
            const isSelected = selectedCategoryFilter === category.id;
            return (
              <button
                key={category.id}
                onClick={() => {
                  if (category.id === 'custom_shopping') {
                    setActiveView('custom_order');
                  } else {
                    setSelectedCategoryFilter(category.id as StoreCategory | 'all');
                  }
                }}
                className={`shrink-0 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <span>{getCategoryIcon(category.id)}</span>
                <span>{category.nameBn}</span>
              </button>
            );
          })}
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'সকল স্টোর' },
              { id: 'verified', label: '✓ ভেরিফায়েড পার্টনার' },
              { id: 'open', label: 'খোলা আছে' },
              { id: 'chuijhal', label: '🔥 চুইঝাল স্পেশাল' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  filterType === tab.id
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Area Filter Dropdown */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <MapPin className="w-4 h-4 text-red-600 shrink-0" />
            <span>এলাকা:</span>
            <select
              value={selectedAreaFilter}
              onChange={e => setSelectedAreaFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value="all">সমগ্র খুলনা সিটি</option>
              {deliveryZones.map(zone => (
                <option key={zone.id} value={zone.id}>
                  {zone.nameBangla.split(' (')[0]}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Results Counter */}
        <div className="text-xs text-slate-500 flex items-center justify-between px-1">
          <span>মোট {filteredStores.length}টি দোকান ও আউটলেট পাওয়া গেছে</span>
          {externalSearchQuery && (
            <button
              onClick={() => onSearchChange && onSearchChange('')}
              className="text-red-600 hover:underline font-semibold cursor-pointer"
            >
              অনুসন্ধান ফিল্টার মুছুন ("{externalSearchQuery}")
            </button>
          )}
        </div>

        {/* Store Cards Grid */}
        {filteredStores.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStores.map(store => (
              <RestaurantCard
                key={store.id}
                restaurant={store}
                onSelect={onSelectRestaurant}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200 max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              এই ফিল্টারে কোনো দোকান পাওয়া যায়নি
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              আপনার প্রয়োজনীয় দোকানটি তালিকায় না থাকলেও চিন্তা নেই। আমাদের কাস্টম শপিং সেবার মাধ্যমে যেকোনো দোকান থেকে মালামাল সংগ্রহ করে বাসায় পৌঁছে দেওয়া যাবে।
            </p>
            <button
              onClick={() => {
                setActiveView('custom_order');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>কাস্টম শপিং রিকোয়েস্ট পাঠান</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
