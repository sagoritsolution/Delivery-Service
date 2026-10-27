import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { PLATFORM_CATEGORIES } from '../data/mockData';
import { StoreCategory } from '../types';
import {
  Search,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle,
  UtensilsCrossed,
  ShoppingBasket,
  Carrot,
  Fish,
  Apple,
  Cake,
  Pill,
  Calculator,
  Compass,
} from 'lucide-react';

interface HeroSectionProps {
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearchChange, searchQuery }) => {
  const {
    setActiveView,
    selectedZone,
    setSelectedZone,
    deliveryZones,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    calculateFeeForDistance,
    deliveryConfig,
  } = useStore();
  const { language, t } = useLanguage();

  const [calculatorDistKm, setCalculatorDistKm] = useState<number>(3.5);
  const { fee: previewFee, formulaExplanation } = calculateFeeForDistance(calculatorDistKm);

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'restaurant':
        return <UtensilsCrossed className="w-5 h-5 text-red-500" />;
      case 'grocery':
        return <ShoppingBasket className="w-5 h-5 text-emerald-500" />;
      case 'vegetables':
        return <Carrot className="w-5 h-5 text-orange-500" />;
      case 'meat_fish':
        return <Fish className="w-5 h-5 text-blue-500" />;
      case 'fruits':
        return <Apple className="w-5 h-5 text-rose-500" />;
      case 'bakery_snacks':
        return <Cake className="w-5 h-5 text-pink-500" />;
      case 'pharmacy':
        return <Pill className="w-5 h-5 text-teal-500" />;
      case 'custom_shopping':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      default:
        return <ShoppingBasket className="w-5 h-5 text-indigo-500" />;
    }
  };

  const handleStartOrder = () => {
    setActiveView('restaurants');
    const el = document.getElementById('stores-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-amber-50/60 via-red-50/20 to-white pt-6 pb-12 sm:pb-16 border-b border-slate-100">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-red-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 -mb-20 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headlines, Inputs & Action Buttons */}
          <div className="lg:col-span-7 text-left space-y-5">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 text-red-800 text-xs sm:text-sm font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span>{t('heroSpecialBadge')}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.2] tracking-tight">
              খুলনায় আপনার{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-600 to-amber-600">
                প্রয়োজনীয় সবকিছু
              </span>
              , এখন ঘরে বসেই!
            </h1>

            {/* Subheadline */}
            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-2xl">
              {t('heroSubtitle')}
            </p>

            {/* Interactive Search & Delivery Area Input Box */}
            <div className="bg-white p-3.5 sm:p-4 rounded-3xl shadow-xl shadow-red-500/5 border border-slate-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                
                {/* Khulna Area Picker */}
                <div className="sm:col-span-5 relative">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {t('selectLocation')}
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-red-600 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={selectedZone.id}
                      onChange={e => {
                        const found = deliveryZones.find(z => z.id === e.target.value);
                        if (found) setSelectedZone(found);
                      }}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      {deliveryZones.map(zone => (
                        <option key={zone.id} value={zone.id}>
                          {zone.nameBangla}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Store, Product & Food Search Input */}
                <div className="sm:col-span-7">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    দোকান, পণ্য বা খাবারের নাম খুঁজুন
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => onSearchChange(e.target.value)}
                      placeholder="উদা: চুইঝাল, বাসমতী চাল, সয়াবিন তেল, ইলিশ, আলু, ওষুধ..."
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
                <button
                  onClick={handleStartOrder}
                  className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBasket className="w-4 h-4" />
                  <span>{t('heroCtaOrderNow')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setActiveView('custom_order');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="py-3 px-5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>{t('heroCtaCustomOrder')}</span>
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-1 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="leading-tight font-medium">আসল দোকান ভাউচারে বিল</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="leading-tight font-medium">দূরত্ব ভিত্তিক ফেয়ার চার্জ</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="leading-tight font-medium">অনুমোদনের পর কেনাকাটা</span>
              </div>
            </div>

          </div>

          {/* Right Column: Distance Delivery Calculator & Mode Banner */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-200/90 space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">
                      দূরত্ব অনুযায়ী ডেলিভারি চার্জ ক্যালকুলেটর
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      সরাসরি কিলোমিটার ভিত্তিক স্বচ্ছ চার্জিং
                    </p>
                  </div>
                </div>
              </div>

              {/* Distance Slider Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 font-medium">দোকান থেকে বাসার আনুমানিক দূরত্ব:</span>
                  <span className="font-black text-sm text-red-600 bg-red-50 px-2.5 py-0.5 rounded-lg border border-red-100">
                    {calculatorDistKm} কি.মি.
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="30"
                  step="0.5"
                  value={calculatorDistKm}
                  onChange={e => setCalculatorDistKm(parseFloat(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>০.৫ কি.মি. (কাছে)</span>
                  <span>১০ কি.মি.</span>
                  <span>৩০ কি.মি. (দূরবর্তী)</span>
                </div>
              </div>

              {/* Calculated Result Box */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-700">আনুমানিক ডেলিভারি ফি:</span>
                  <span className="text-lg font-black text-slate-900">{previewFee}৳</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {formulaExplanation}
                </div>
                <div className="text-[10px] text-amber-700 bg-amber-50 p-1.5 rounded-lg border border-amber-200/60 mt-1">
                  * নোট: কাস্টমার বা অ্যাডমিন ম্যানুয়াল দূরত্ব যাচাইয়ের পর অর্ডার ফাইনাল হবে।
                </div>
              </div>

              {/* Sample Route Distance Preview in Khulna */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <span className="font-bold text-slate-700 text-[11px] block">খুলনার কয়েকটি পরিচিত রুট দূরত্ব:</span>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <span className="bg-slate-100 p-1.5 rounded-lg truncate">শিববাড়ি ↔ সোনাডাঙ্গা (~২.৫ কি.মি.)</span>
                  <span className="bg-slate-100 p-1.5 rounded-lg truncate">শিববাড়ি ↔ বয়রা (~৩.২ কি.মি.)</span>
                  <span className="bg-slate-100 p-1.5 rounded-lg truncate">শিববাড়ি ↔ খালিশপুর (~৫.৪ কি.মি.)</span>
                  <span className="bg-slate-100 p-1.5 rounded-lg truncate">শিববাড়ি ↔ চুকনগর (~২৮ কি.মি.)</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Section 2: Prominent Shopping Category Cards */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Compass className="w-4 h-4 text-red-600" />
              ক্যাটাগরি অনুযায়ী শপিং করুন
            </h3>
            <span className="text-xs text-slate-500">১০টি প্রয়োজনীয় লোকাল সার্ভিস</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {PLATFORM_CATEGORIES.filter(c => c.id !== 'all').map(cat => {
              const isSelected = selectedCategoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    if (cat.id === 'custom_shopping') {
                      setActiveView('custom_order');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else {
                      setSelectedCategoryFilter(cat.id as StoreCategory);
                      setActiveView('restaurants');
                      const el = document.getElementById('stores-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between group cursor-pointer shadow-2xs hover:shadow-md ${
                    isSelected
                      ? 'border-red-600 bg-red-50/60 ring-2 ring-red-500'
                      : 'border-slate-200 bg-white hover:border-red-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-white flex items-center justify-center transition-colors">
                      {getCategoryIcon(cat.id)}
                    </div>
                    {cat.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        {cat.badge}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug group-hover:text-red-600 transition-colors">
                      {cat.nameBn}
                    </h4>
                    <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                      {cat.descriptionBn}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
