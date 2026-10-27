import React from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Home,
  Store,
  Sparkles,
  Clock,
  ShoppingBag,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeView, setActiveView, cartItemCount, setIsCartDrawerOpen } = useStore();
  const { language } = useLanguage();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        
        {/* Home */}
        <button
          onClick={() => {
            setActiveView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
            activeView === 'home' ? 'text-red-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">হোম</span>
        </button>

        {/* Restaurants */}
        <button
          onClick={() => {
            setActiveView('restaurants');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
            activeView === 'restaurants' ? 'text-red-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Store className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">রেস্টুরেন্ট</span>
        </button>

        {/* Center Floating Custom Order Button */}
        <button
          onClick={() => {
            setActiveView('custom_order');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col items-center -mt-5"
        >
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-500 to-red-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 ring-4 ring-white active:scale-95 transition-all">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-[10px] font-extrabold text-amber-700 mt-0.5">
            কাস্টম অর্ডার
          </span>
        </button>

        {/* Track Order */}
        <button
          onClick={() => {
            setActiveView('track');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
            activeView === 'track' ? 'text-red-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">ট্র্যাকিং</span>
        </button>

        {/* Cart Drawer */}
        <button
          onClick={() => setIsCartDrawerOpen(true)}
          className="relative flex flex-col items-center py-1 px-2 rounded-xl text-slate-500 hover:text-slate-800 transition-colors"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-0.5">কার্ট</span>
        </button>

      </div>
    </div>
  );
};
