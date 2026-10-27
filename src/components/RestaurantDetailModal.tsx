import React, { useState } from 'react';
import { Restaurant, MenuItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import {
  X,
  Star,
  Clock,
  Bike,
  MapPin,
  Flame,
  Plus,
  Minus,
  CheckCircle2,
  Shield,
  ShoppingBag,
  Navigation,
} from 'lucide-react';

interface RestaurantDetailModalProps {
  restaurant: Restaurant;
  onClose: () => void;
}

export const RestaurantDetailModal: React.FC<RestaurantDetailModalProps> = ({
  restaurant,
  onClose,
}) => {
  const { language } = useLanguage();
  const { addToCart, setIsCartDrawerOpen, cartItemCount, calculateFeeForDistance } = useStore();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemInstructions, setItemInstructions] = useState('');

  const distanceKm = restaurant.approxDistanceKm || 2.5;
  const { fee: calculatedFee } = calculateFeeForDistance(distanceKm);

  const menuCategories = [
    { id: 'all', name: 'সব পণ্য / মেনু' },
    ...Array.from(new Set(restaurant.menu.map(m => m.category))).map(cat => ({
      id: cat,
      name:
        cat === 'chuijhal'
          ? 'চুইঝাল স্পেশাল'
          : cat === 'biryani'
          ? 'বিরিয়ানি'
          : cat === 'grocery'
          ? 'চাল, ডাল ও তেল'
          : cat === 'vegetables'
          ? 'তাজা শাকসবজি'
          : cat === 'meat_fish'
          ? 'মাছ ও মাংস'
          : cat === 'fruits'
          ? 'তাজা ফল'
          : cat === 'pharmacy'
          ? 'ওষুধ ও ফার্স্ট এইড'
          : cat === 'bakery_snacks'
          ? 'বেকারি ও মিষ্টি'
          : cat,
    })),
  ];

  const filteredMenu =
    activeCategory === 'all'
      ? restaurant.menu
      : restaurant.menu.filter(m => m.category === activeCategory);

  const openItemQuickAdd = (item: MenuItem) => {
    setSelectedItemForModal(item);
    setItemQuantity(1);
    setItemInstructions('');
  };

  const handleConfirmAddToCart = () => {
    if (!selectedItemForModal) return;
    addToCart(selectedItemForModal, restaurant, itemQuantity, itemInstructions);
    setSelectedItemForModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100 relative">
        
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
          aria-label="Close store details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Cover */}
        <div className="relative h-56 sm:h-64 w-full shrink-0">
          <img
            src={restaurant.coverImage}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

          {/* Details on cover */}
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-white/20 backdrop-blur-xs text-xs px-2.5 py-0.5 rounded-full font-bold">
                {restaurant.category === 'restaurant'
                  ? 'রেস্টুরেন্ট'
                  : restaurant.category === 'grocery'
                  ? 'মুদি ও সুপারশপ'
                  : restaurant.category === 'vegetables'
                  ? 'কাঁচাবাজার'
                  : restaurant.category === 'meat_fish'
                  ? 'মাছ ও মাংসের আড়ৎ'
                  : restaurant.category === 'pharmacy'
                  ? 'মডেল ফার্মেসি'
                  : 'লোকাল আউটলেট'}
              </span>
              {restaurant.isVerifiedPartner ? (
                <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>ভেরিফায়েড পার্টনার</span>
                </span>
              ) : (
                <span className="bg-amber-500 text-slate-950 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" />
                  <span>ইন্ডিপেন্ডেন্ট পিকআপ</span>
                </span>
              )}
              <span className="bg-white/20 backdrop-blur-xs text-xs px-2.5 py-0.5 rounded-full font-medium">
                {restaurant.openingHours}
              </span>
            </div>

            <h2 className="text-xl sm:text-3xl font-black leading-tight text-white">
              {restaurant.banglaName}
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-200">
              <span className="flex items-center gap-1 font-bold text-amber-300">
                <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                {restaurant.rating} ({restaurant.reviewCount}+ রিভিউ)
              </span>
              <span className="flex items-center gap-1 font-semibold text-amber-200">
                <Navigation className="w-3.5 h-3.5 text-amber-300" />
                সড়ক দূরত্ব: ~{distanceKm} কি.মি. (ডেলিভারি ফি: {calculatedFee}৳)
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-slate-300" />
                {restaurant.banglaAddress}
              </span>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center gap-2 overflow-x-auto shrink-0">
          {menuCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>মোট {filteredMenu.length}টি পণ্য প্রদর্শিত হচ্ছে</span>
            <span className="text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md font-semibold border border-amber-200/60">
              দোকানের আসল ভাউচার মূল্য অনুসারেই বিল কার্যকর হবে
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMenu.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/90 hover:border-red-200 hover:shadow-md transition-all flex gap-3.5 justify-between"
              >
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      {item.unit && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {item.unit}
                        </span>
                      )}
                      {item.isPopular && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          জনপ্রিয়
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                      {item.banglaName || item.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {item.banglaDescription || item.description}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-base sm:text-lg font-black text-red-600">
                      {item.price}৳{' '}
                      {item.unit && (
                        <span className="text-xs font-normal text-slate-400">/ {item.unit}</span>
                      )}
                    </span>
                    <button
                      onClick={() => openItemQuickAdd(item)}
                      className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>যোগ করুন</span>
                    </button>
                  </div>
                </div>

                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-slate-100 relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Bottom Bar with Cart Trigger */}
        {cartItemCount > 0 && (
          <div className="p-3 sm:p-4 bg-slate-900 text-white flex items-center justify-between border-t border-slate-800 shrink-0">
            <div className="text-xs sm:text-sm">
              <span className="font-bold text-red-400">{cartItemCount}টি আইটেম</span> কার্টে যুক্ত আছে
            </div>
            <button
              onClick={() => {
                onClose();
                setIsCartDrawerOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>কার্ট ও চেকআউট দেখুন</span>
            </button>
          </div>
        )}

      </div>

      {/* Item Quantity & Notes Modal */}
      {selectedItemForModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in zoom-in-95 duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setSelectedItemForModal(null)}
              className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex gap-4 mb-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                <img
                  src={selectedItemForModal.image}
                  alt={selectedItemForModal.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {selectedItemForModal.banglaName}
                </h3>
                <span className="text-lg font-black text-red-600 mt-1 block">
                  {selectedItemForModal.price}৳{' '}
                  {selectedItemForModal.unit && (
                    <span className="text-xs font-normal text-slate-400">({selectedItemForModal.unit})</span>
                  )}
                </span>
                <span className="text-xs text-slate-500">
                  {restaurant.banglaName}
                </span>
              </div>
            </div>

            {/* Quantity modifier */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 mb-4 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">পরিমাণ (Quantity):</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}
                  className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-bold hover:bg-slate-100 active:scale-95 cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-extrabold text-base text-slate-900 w-6 text-center">
                  {itemQuantity}
                </span>
                <button
                  onClick={() => setItemQuantity(itemQuantity + 1)}
                  className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold hover:bg-red-700 active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                বিশেষ অনুরোধ বা প্যাকিং নির্দেশনা (ঐচ্ছিক)
              </label>
              <input
                type="text"
                value={itemInstructions}
                onChange={e => setItemInstructions(e.target.value)}
                placeholder="উদা: তাজা পিস দেখে দেবেন, প্যাকেজিং আলাদা রাখবেন..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedItemForModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                onClick={handleConfirmAddToCart}
                className="flex-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>কার্টে যোগ করুন ({selectedItemForModal.price * itemQuantity}৳)</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
