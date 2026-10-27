import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { CheckoutModal } from './CheckoutModal';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Tag,
  ArrowRight,
  Store,
  Info,
  Route,
  ShieldCheck,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    cartRestaurant,
    cartItemCount,
    cartSubtotal,
    cartDeliveryFee,
    cartServiceFee,
    promoDiscount,
    appliedPromoCode,
    applyPromoCode,
    cartTotal,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    selectedZone,
    setActiveView,
    deliveryConfig,
    customerManualDistanceKm,
  } = useStore();

  const { language } = useLanguage();
  const [promoInput, setPromoInput] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isCartDrawerOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    applyPromoCode(promoInput);
  };

  const isStoreCategoryGroceryOrConcierge =
    cartRestaurant?.category &&
    cartRestaurant.category !== 'restaurant';

  const handlingFee = isStoreCategoryGroceryOrConcierge ? deliveryConfig.handlingFee : 0;
  const grandTotal = cartTotal + (handlingFee > 0 ? handlingFee : 0);

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
        <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl relative animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  আপনার শপিং কার্ট ({cartItemCount})
                </h3>
                {cartRestaurant && (
                  <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                    <Store className="w-3 h-3 text-red-600 shrink-0" />
                    <span className="truncate max-w-[200px]">
                      {cartRestaurant.banglaName || cartRestaurant.name}
                    </span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-bold">
                      {cartRestaurant.category}
                    </span>
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-slate-300" />
                </div>
                <h4 className="font-bold text-slate-700 text-base mb-1">
                  আপনার কার্ট বর্তমানে খালি
                </h4>
                <p className="text-xs text-slate-500 mb-6">
                  খুলনার জনপ্রিয় রেস্টুরেন্ট, সুপারশপ ও কাঁচাবাজার থেকে আপনার প্রয়োজনীয় পণ্য বাছাই করুন।
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setActiveView('restaurants');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all"
                >
                  স্টোর ও পণ্য তালিকা দেখুন
                </button>
              </div>
            ) : (
              <>
                {/* Single Store Policy Reminder */}
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-800 flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>দ্রুত ডেলিভারির সুবিধার্থে ১টি অর্ডারে একটি স্টোর/বাজারের পণ্য প্রযোজ্য।</span>
                </div>

                {/* Road Distance Indicator */}
                <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-200/80 text-[11px] text-blue-900 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Route className="w-3.5 h-3.5 text-blue-600" />
                    <span>আনুমানিক সড়ক দূরত্ব:</span>
                    <strong className="font-bold">
                      ~{cartRestaurant?.approxDistanceKm || customerManualDistanceKm} কিমি
                    </strong>
                  </div>
                  <span className="text-[10px] text-blue-600 font-semibold bg-white px-2 py-0.5 rounded-md border border-blue-200">
                    ম্যানুয়াল কিলোমিটার
                  </span>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  {cart.map(cartItem => (
                    <div
                      key={cartItem.item.id}
                      className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                          <img
                            src={cartItem.item.image}
                            alt={cartItem.item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="overflow-hidden">
                          <h5 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                            {cartItem.item.banglaName || cartItem.item.name}
                          </h5>
                          <div className="text-red-600 font-extrabold text-xs mt-0.5">
                            {cartItem.item.price * cartItem.quantity}৳{' '}
                            <span className="text-[10px] text-slate-400 font-normal">
                              ({cartItem.item.price}৳ × {cartItem.quantity} {cartItem.item.unit || ''})
                            </span>
                          </div>
                          {cartItem.instructions && (
                            <p className="text-[10px] text-slate-500 truncate mt-0.5">
                              নোট: {cartItem.instructions}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Quantity Modifiers */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200">
                          <button
                            onClick={() =>
                              updateCartQuantity(cartItem.item.id, cartItem.quantity - 1)
                            }
                            className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-slate-700 hover:bg-slate-200 active:scale-90"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-slate-900">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(cartItem.item.id, cartItem.quantity + 1)
                            }
                            className="w-6 h-6 rounded-lg bg-red-600 flex items-center justify-center text-white hover:bg-red-700 active:scale-90"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(cartItem.item.id)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-colors"
                          title="সরিয়ে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code Input */}
                <form onSubmit={handleApplyPromo} className="pt-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={promoInput}
                        onChange={e => setPromoInput(e.target.value)}
                        placeholder="প্রোমোকোড দিন (KHULNA50 বা SHOP10)"
                        className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs uppercase font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors shrink-0"
                    >
                      প্রয়োগ
                    </button>
                  </div>
                  {appliedPromoCode && (
                    <div className="mt-1 text-[11px] text-emerald-600 font-semibold flex items-center justify-between">
                      <span>✓ {appliedPromoCode} কোড সক্রিয় (-{promoDiscount}৳)</span>
                      <button
                        type="button"
                        onClick={clearCart}
                        className="text-red-500 hover:underline text-[10px]"
                      >
                        রিসেট
                      </button>
                    </div>
                  )}
                </form>

                {/* Billing Breakdown */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>আইটেম মোট:</span>
                    <span className="font-semibold text-slate-900">{cartSubtotal}৳</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>দূরত্বভিত্তিক ডেলিভারি ফি:</span>
                    <span className="font-semibold text-slate-900">{cartDeliveryFee}৳</span>
                  </div>
                  {handlingFee > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>শপিং হ্যান্ডলিং ফি:</span>
                      <span className="font-semibold text-slate-900">{handlingFee}৳</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>সার্ভিস ও প্যাকেজিং:</span>
                    <span className="font-semibold text-slate-900">{cartServiceFee}৳</span>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>ছাড়:</span>
                      <span>-{promoDiscount}৳</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-black text-slate-900">
                    <span>সর্বমোট টাকা:</span>
                    <span className="text-lg text-red-600">{grandTotal}৳</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <button
                    onClick={clearCart}
                    className="hover:text-red-600 transition-colors underline"
                  >
                    পুরো কার্ট খালি করুন
                  </button>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-700">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    ক্যাশ অন ডেলিভারি / বিকাশ
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Footer Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-white">
              <button
                onClick={() => {
                  setIsCheckoutOpen(true);
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-black text-sm flex items-center justify-between shadow-xl shadow-red-600/20 active:scale-98 transition-all"
              >
                <span>চেকআউট করুন</span>
                <span className="flex items-center gap-2">
                  <span className="font-mono text-base">{grandTotal}৳</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          onSuccess={() => {
            setIsCheckoutOpen(false);
            setIsCartDrawerOpen(false);
            setActiveView('track');
          }}
        />
      )}
    </>
  );
};
