import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import {
  X,
  MapPin,
  Phone,
  User,
  CreditCard,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Info,
  Navigation,
  Calculator,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const {
    cart,
    cartRestaurant,
    cartSubtotal,
    cartDistanceKm,
    cartDeliveryFee,
    cartServiceFee,
    cartHandlingFee,
    promoDiscount,
    cartTotal,
    selectedZone,
    setSelectedZone,
    deliveryZones,
    currentUser,
    placeStandardOrder,
    calculateFeeForDistance,
  } = useStore();

  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [deliveryAddress, setDeliveryAddress] = useState(
    currentUser?.addresses?.[0]?.address || ''
  );
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad'>('cod');
  
  // Customer manual estimated distance modifier
  const [customDistanceInput, setCustomDistanceInput] = useState<number>(cartDistanceKm || 2.5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOrderReviewModal, setShowOrderReviewModal] = useState(false);

  if (!isOpen) return null;

  const { fee: liveCalculatedDelivery, formulaExplanation } = calculateFeeForDistance(customDistanceInput);
  const currentTotal = cartSubtotal + liveCalculatedDelivery + cartServiceFee + cartHandlingFee - promoDiscount;

  const handleOpenReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim()) {
      alert('অনুগ্রহ করে নাম, মোবাইল নম্বর এবং পূর্ণাঙ্গ ঠিকানা দিন।');
      return;
    }
    setShowOrderReviewModal(true);
  };

  const handleFinalConfirmOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      placeStandardOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryAddress: deliveryAddress.trim(),
        deliveryInstructions: deliveryInstructions.trim(),
        paymentMethod,
        customDistanceKm: customDistanceInput,
      });
      setIsSubmitting(false);
      setShowOrderReviewModal(false);
      onSuccess();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close checkout"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">
              চেকআউট ও ডেলিভারি তথ্য
            </h2>
            <p className="text-xs text-slate-500">
              দোকান: {cartRestaurant?.banglaName || cartRestaurant?.name} ({cartRestaurant?.area})
            </p>
          </div>
        </div>

        <form onSubmit={handleOpenReview} className="space-y-4">
          {/* Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                আপনার পূর্ণ নাম <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="আপনার নাম"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                মোবাইল নম্বর (+৮৮০) <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  placeholder="017xxxxxxxx"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>

          {/* Delivery Zone & Address */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              খুলনার ডেলিভারি এলাকা <span className="text-red-600">*</span>
            </label>
            <select
              value={selectedZone.id}
              onChange={e => {
                const found = deliveryZones.find(z => z.id === e.target.value);
                if (found) {
                  setSelectedZone(found);
                }
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {deliveryZones.map(zone => (
                <option key={zone.id} value={zone.id}>
                  {zone.nameBangla}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              বাসার সুনির্দিষ্ট ঠিকানা <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              value={deliveryAddress}
              onChange={e => setDeliveryAddress(e.target.value)}
              placeholder="বাড়ি নম্বর, রোড নম্বর, ফ্ল্যাট বা পরিচিত ল্যান্ডমার্ক..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Road Distance Estimation Slider */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-red-600" />
                দোকান থেকে ডেলিভারির আনুমানিক সড়ক দূরত্ব:
              </span>
              <span className="font-black text-sm text-red-600 bg-white px-2.5 py-0.5 rounded-lg border">
                {customDistanceInput} কি.মি.
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="30"
              step="0.5"
              value={customDistanceInput}
              onChange={e => setCustomDistanceInput(parseFloat(e.target.value))}
              className="w-full accent-red-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="text-[11px] text-slate-500 flex justify-between">
              <span>পিকআপ: {cartRestaurant?.banglaAddress || 'দোকানের ঠিকানা'}</span>
              <span className="font-semibold text-slate-700">চার্জ: {liveCalculatedDelivery}৳</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              সূত্র: {formulaExplanation} (অ্যাডমিন চূড়ান্ত যাচাই করবেন)
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              ডেলিভারি নির্দেশিকা (ঐচ্ছিক)
            </label>
            <input
              type="text"
              value={deliveryInstructions}
              onChange={e => setDeliveryInstructions(e.target.value)}
              placeholder="উদা: কলিং বেল নষ্ট, ফোন দেবেন..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-2">
              পেমেন্ট পদ্ধতি নির্বাচন করুন <span className="text-red-600">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <label
                className={`p-3 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-red-600 bg-red-50/50 ring-1 ring-red-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Banknote className="w-5 h-5 text-emerald-600" />
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-red-600"
                  />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">ক্যাশ অন ডেলিভারি</div>
                  <div className="text-[10px] text-slate-500">পণ্য হাতে পেয়ে মূল্য পরিশোধ</div>
                </div>
              </label>

              <label
                className={`p-3 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'bkash'
                    ? 'border-pink-600 bg-pink-50/50 ring-1 ring-pink-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-pink-600 text-xs">bKash</span>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'bkash'}
                    onChange={() => setPaymentMethod('bkash')}
                    className="accent-pink-600"
                  />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">বিকাশ (bKash)</div>
                  <div className="text-[10px] text-slate-500">ম্যানুয়াল বিকাশ পেমেন্ট অপশন</div>
                </div>
              </label>

              <label
                className={`p-3 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'nagad'
                    ? 'border-orange-600 bg-orange-50/50 ring-1 ring-orange-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-orange-600 text-xs">নগদ</span>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'nagad'}
                    onChange={() => setPaymentMethod('nagad')}
                    className="accent-orange-600"
                  />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">নগদ (Nagad)</div>
                  <div className="text-[10px] text-slate-500">ম্যানুয়াল নগদ পেমেন্ট অপশন</div>
                </div>
              </label>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>পণ্যের মোট মূল্য ({cart.length} আইটেম):</span>
              <span className="font-semibold text-slate-900">{cartSubtotal}৳</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>ডেলিভারি ফি ({customDistanceInput} কি.মি. আনুমানিক):</span>
              <span className="font-semibold text-slate-900">{liveCalculatedDelivery}৳</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>সার্ভিস ও স্বাস্থ্যসম্মত প্যাকেজিং:</span>
              <span className="font-semibold text-slate-900">{cartServiceFee}৳</span>
            </div>
            {cartHandlingFee > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>শপিং কনসিয়ার্জ ফি:</span>
                <span className="font-semibold text-slate-900">{cartHandlingFee}৳</span>
              </div>
            )}
            {promoDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>প্রোমোকোড ছাড়:</span>
                <span>-{promoDiscount}৳</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-black text-slate-900">
              <span>সর্বমোট প্রদেয় টাকা:</span>
              <span className="text-lg text-red-600">{currentTotal}৳</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm shadow-xl shadow-red-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>অর্ডার বিবরণ যাচাই ও নিশ্চিত করুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Review Confirmation Modal */}
      {showOrderReviewModal && (
        <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in zoom-in-95 duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              অর্ডার চূড়ান্ত নিশ্চিতকরণ
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              দয়া করে অর্ডারের মোট মূল্য ও বিবরণ যাচাই করে কনফার্ম করুন:
            </p>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 mb-4 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">গ্রাহক:</span>
                <span className="font-semibold text-slate-900">{customerName} ({customerPhone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ঠিকানা:</span>
                <span className="font-semibold text-slate-900 max-w-[200px] truncate">{deliveryAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">দোকান / আউটলেট:</span>
                <span className="font-semibold text-slate-900">{cartRestaurant?.banglaName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">সড়ক দূরত্ব:</span>
                <span className="font-semibold text-slate-900">{customDistanceInput} কি.মি. (আনুমানিক)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">পেমেন্ট মেথড:</span>
                <span className="font-bold text-slate-800 uppercase">{paymentMethod}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm">
                <span className="text-slate-900">মোট প্রদেয় বিল:</span>
                <span className="text-red-600 font-black">{currentTotal}৳</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowOrderReviewModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                সংশোধন করুন
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFinalConfirmOrder}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-600/20 flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'প্রসেসিং...' : 'হ্যাঁ, কনফার্ম করুন'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
