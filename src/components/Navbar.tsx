import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import {
  MapPin,
  ShoppingBag,
  User,
  Search,
  Sparkles,
  PhoneCall,
  Menu,
  X,
  Compass,
  UtensilsCrossed,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    selectedZone,
    setSelectedZone,
    deliveryZones,
    cartItemCount,
    cartTotal,
    setIsCartDrawerOpen,
    currentUser,
    isAdminLoggedIn,
  } = useStore();

  const { language, setLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isZoneDropdownOpen, setIsZoneDropdownOpen] = useState(false);

  const navigateTo = (view: string) => {
    setActiveView(view);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white text-xs sm:text-sm py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <span className="bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded text-[11px] font-bold shrink-0">
              খুলনা স্পেশাল
            </span>
            <span className="truncate">
              ফুডপ্যান্ডা বা অন্য অ্যাপে নেই? যেকোনো রেস্টুরেন্টের খাবার আমরা এনে দিচ্ছি আপনার বাসায়!
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 shrink-0 text-xs">
            <a
              href="https://wa.me/8801700123456?text=খুলনা%20ফুড%20এক্সপ্রেস%20অর্ডার%20সহায়তা"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:underline font-semibold text-amber-200"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>হটলাইন: ০১৭০০-১২৩৪৫৬</span>
            </a>
            <span className="opacity-60">|</span>
            <button
              onClick={() => navigateTo('admin')}
              className="hover:underline flex items-center gap-1 text-white/90"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isAdminLoggedIn ? 'অ্যাডমিন ড্যাশবোর্ড' : 'অ্যাডমিন লগইন'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center gap-3 text-left group"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 group-hover:text-red-600 transition-colors">
                    {language === 'bn' ? 'খুলনা ফুড' : 'Khulna Food'}
                  </span>
                  <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    Express
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium truncate max-w-[190px] sm:max-w-xs">
                  {language === 'bn' ? 'যেকোনো রেস্টুরেন্টের খাবার ডেলিভারি' : 'All-Restaurant Delivery Service'}
                </p>
              </div>
            </button>
          </div>

          {/* Delivery Location Selector for Khulna */}
          <div className="hidden lg:block relative">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsZoneDropdownOpen(!isZoneDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200 text-xs font-semibold text-slate-800 transition-colors"
              >
                <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 block font-normal leading-none mb-0.5">
                    {t('selectLocation')}
                  </span>
                  <span className="truncate max-w-[170px] block">
                    {language === 'bn' ? selectedZone.nameBangla : selectedZone.nameEnglish}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isZoneDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isZoneDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-2 text-xs font-bold text-slate-400 border-b border-slate-100 uppercase tracking-wider">
                    খুলনার ডেলিভারি এলাকা নির্বাচন করুন
                  </div>
                  <div className="max-h-64 overflow-y-auto py-1">
                    {deliveryZones.map(zone => (
                      <button
                        key={zone.id}
                        onClick={() => {
                          setSelectedZone(zone);
                          setIsZoneDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          selectedZone.id === zone.id
                            ? 'bg-red-50 text-red-700 font-bold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="truncate mr-2">
                          {language === 'bn' ? zone.nameBangla : zone.nameEnglish}
                        </span>
                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-600 shrink-0">
                          {zone.baseDeliveryFee}৳ ফি
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            <button
              onClick={() => navigateTo('home')}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                activeView === 'home'
                  ? 'text-red-600 bg-red-50'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t('navHome')}
            </button>
            <button
              onClick={() => navigateTo('restaurants')}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                activeView === 'restaurants'
                  ? 'text-red-600 bg-red-50'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t('navRestaurants')}
            </button>
            
            {/* Dedicated Order Any Restaurant button - Highlighted! */}
            <button
              onClick={() => navigateTo('custom_order')}
              className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 shadow-xs ${
                activeView === 'custom_order'
                  ? 'bg-amber-500 text-white shadow-amber-500/25 ring-2 ring-amber-400'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{language === 'bn' ? 'যেকোনো রেস্টুরেন্ট অর্ডার' : 'Custom Restaurant'}</span>
            </button>

            <button
              onClick={() => navigateTo('how_it_works')}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                activeView === 'how_it_works'
                  ? 'text-red-600 bg-red-50'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t('navHowItWorks')}
            </button>
            <button
              onClick={() => navigateTo('track')}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                activeView === 'track'
                  ? 'text-red-600 bg-red-50'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t('navTrackOrder')}
            </button>
          </nav>

          {/* Right Controls: Language, User, Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              title="Change Language"
            >
              {language === 'bn' ? 'EN' : 'বাংলা'}
            </button>

            {/* Profile / Login */}
            <button
              onClick={() => navigateTo('account')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors ${
                activeView === 'account'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">
                {currentUser ? currentUser.name.split(' ')[0] : t('navLogin')}
              </span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/25 transition-all transform active:scale-95"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 ? (
                <>
                  <span className="bg-white text-red-600 font-extrabold text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                  <span className="hidden sm:inline text-white/90 font-medium">
                    {cartTotal}৳
                  </span>
                </>
              ) : (
                <span className="hidden sm:inline text-xs">{t('cart')}</span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-150">
            {/* Mobile Zone Selector */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-600" />
                আপনার খুলনার এরিয়া
              </label>
              <select
                value={selectedZone.id}
                onChange={e => {
                  const found = deliveryZones.find(z => z.id === e.target.value);
                  if (found) setSelectedZone(found);
                }}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-800"
              >
                {deliveryZones.map(zone => (
                  <option key={zone.id} value={zone.id}>
                    {language === 'bn' ? zone.nameBangla : zone.nameEnglish} ({zone.baseDeliveryFee}৳ ফি)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => navigateTo('home')}
                className="p-2.5 rounded-xl text-left text-sm font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100"
              >
                {t('navHome')}
              </button>
              <button
                onClick={() => navigateTo('restaurants')}
                className="p-2.5 rounded-xl text-left text-sm font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100"
              >
                {t('navRestaurants')}
              </button>
              <button
                onClick={() => navigateTo('custom_order')}
                className="col-span-2 p-3 rounded-xl text-left text-sm font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  যেকোনো রেস্টুরেন্ট থেকে অর্ডার
                </span>
                <span className="text-xs bg-amber-200 px-2 py-0.5 rounded-full font-bold">বিশেষ ফিচার</span>
              </button>
              <button
                onClick={() => navigateTo('how_it_works')}
                className="p-2.5 rounded-xl text-left text-sm font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100"
              >
                {t('navHowItWorks')}
              </button>
              <button
                onClick={() => navigateTo('track')}
                className="p-2.5 rounded-xl text-left text-sm font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100"
              >
                {t('navTrackOrder')}
              </button>
              <button
                onClick={() => navigateTo('account')}
                className="p-2.5 rounded-xl text-left text-sm font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100"
              >
                {t('navAccount')}
              </button>
              <button
                onClick={() => navigateTo('admin')}
                className="p-2.5 rounded-xl text-left text-sm font-semibold text-red-700 bg-red-50 hover:bg-red-100 flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                অ্যাডমিন পোর্টাল
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
