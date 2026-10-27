import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { StoreCategory } from '../types';
import {
  Sparkles,
  Store,
  MapPin,
  ShoppingBag,
  DollarSign,
  Phone,
  User,
  AlertTriangle,
  ArrowRight,
  Info,
  Carrot,
  Fish,
  ShoppingBasket,
  Pill,
  Calculator,
  Compass,
} from 'lucide-react';

export const CustomOrderView: React.FC = () => {
  const {
    submitCustomRequest,
    selectedZone,
    setSelectedZone,
    deliveryZones,
    currentUser,
    setActiveView,
    calculateFeeForDistance,
    deliveryConfig,
  } = useStore();

  const [storeCategory, setStoreCategory] = useState<StoreCategory>('custom_shopping');
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantLocation, setRestaurantLocation] = useState('');
  const [requestedItems, setRequestedItems] = useState('');
  const [expectedBudget, setExpectedBudget] = useState('500');
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [deliveryAddress, setDeliveryAddress] = useState(
    currentUser?.addresses?.[0]?.address || ''
  );
  const [estimatedDistanceKm, setEstimatedDistanceKm] = useState<number>(3.5);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<any | null>(null);

  const { fee: calculatedDeliveryFee, formulaExplanation } = calculateFeeForDistance(estimatedDistanceKm);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestedItems.trim() || !customerPhone.trim() || !deliveryAddress.trim()) {
      alert('অনুগ্রহ করে পণ্যের বিবরণ, মোবাইল নম্বর এবং ডেলিভারি ঠিকানা পূরণ করুন।');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const budgetNum = parseInt(expectedBudget, 10) || 500;
      const order = submitCustomRequest({
        customerName: customerName.trim() || 'সম্মানিত গ্রাহক',
        customerPhone: customerPhone.trim(),
        deliveryAddress: deliveryAddress.trim(),
        restaurantName: restaurantName.trim() || 'নিকটস্থ উপযুক্ত বাজার বা দোকান (শপার নির্বাচন করবেন)',
        restaurantLocation: restaurantLocation.trim() || `${selectedZone.nameBangla}, খুলনা`,
        requestedItems: requestedItems.trim(),
        expectedBudget: budgetNum,
        photoUrl: photoPreview || undefined,
        additionalNotes: additionalNotes.trim(),
        storeCategory,
        estimatedDistanceKm,
      });

      setSubmittedRequest(order);
      setIsSubmitting(false);
    }, 600);
  };

  if (submittedRequest) {
    return (
      <div className="py-12 px-4 max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8" />
          </div>

          <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            কাস্টম শপিং রিকোয়েস্ট গৃহীত
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 mb-2">
            শপিং অনুরোধ সফলভাবে জমা হয়েছে!
          </h2>

          <div className="my-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block text-left w-full">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs text-slate-500 font-medium">অনুরোধ নম্বর (Request ID):</span>
              <span className="text-base font-extrabold text-red-600 font-mono">
                {submittedRequest.orderNumber}
              </span>
            </div>
            <div className="pt-3 space-y-2 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">দোকান / বাজার:</span>
                <span className="font-semibold text-slate-900">{submittedRequest.customRequestDetails?.restaurantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">প্রয়োজনীয় মালামাল:</span>
                <span className="font-semibold text-slate-900 text-right max-w-xs truncate">{submittedRequest.customRequestDetails?.requestedItems}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">আনুমানিক বাজেট:</span>
                <span className="font-bold text-slate-900">{submittedRequest.subtotal}৳</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">আনুমানিক দূরত্ব ও ডেলিভারি ফি:</span>
                <span className="font-semibold text-slate-900">{submittedRequest.distanceKm} কি.মি. → {submittedRequest.deliveryFee}৳ (আনুমানিক)</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-left text-xs text-blue-900 space-y-2 mb-8">
            <div className="flex items-center gap-2 font-bold text-blue-950">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span>অনুরোধ প্রক্রিয়া ও দাম নিশ্চিতকরণ নিয়ম:</span>
            </div>
            <p className="leading-relaxed">
              এটি একটি অনুরোধ (Request)। আমাদের শপার বা অ্যাডমিন দোকানে গিয়ে পণ্যের প্রাপ্যতা ও আসল বাজারদর যাচাই করবেন। পণ্যের আসল দাম বা দূরত্বের কারণে বিল পরিবর্তন হলে আপনাকে ফোনে বা ট্র্যাকিং স্ক্রিনে <strong>সংশোধিত কোটেশন</strong> পাঠানো হবে। আপনার অনুমোদনের পরেই কেবল পণ্য কেনা হবে।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setActiveView('track')}
              className="flex-1 py-3 px-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2"
            >
              <span>লাইভ স্ট্যাটাস ট্র্যাক করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setSubmittedRequest(null);
                setRestaurantName('');
                setRequestedItems('');
              }}
              className="py-3 px-5 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition-colors"
            >
              আরেকটি অনুরোধ করুন
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-14 bg-gradient-to-b from-amber-50/40 via-white to-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold mb-3 shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>খুলনা কাস্টম শপিং ও কনসিয়ার্জ সার্ভিস</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            যেকোনো দোকান বা বাজার থেকে কেনাকাটা করুন
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            রেস্টুরেন্ট, কাঁচাবাজারের তাজা সবজি, ইলিশ মাছ, সুপারশপের চাল-ডাল কিংবা ফার্মেসির ওষুধ—আপনার যা প্রয়োজন লিখুন, আমাদের শপার সংগ্রহ করে আপনার ঠিকানায় পৌঁছে দেবে।
          </p>
        </div>

        {/* Clear Notice Banner (Crucial Requirement) */}
        <div className="mb-8 p-4 sm:p-5 bg-amber-50/90 border border-amber-300 rounded-3xl flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-950">
            <span className="font-bold block mb-1">গুরুত্বপূর্ণ নিয়ম ও প্রাপ্যতা যাচাই:</span>
            <p className="leading-relaxed">
              "কাস্টম শপিং অনুরোধ পাঠানো মানেই অর্ডার কনফার্ম নয়। আমাদের শপার বা অ্যাডমিন দোকানে গিয়ে পণ্যের প্রাপ্যতা, আসল ক্যাশ মেমো মূল্য এবং সড়ক দূরত্ব যাচাই করে আপনাকে জানাবে। দামের পরিবর্তন হলে আপনার অনুমোদন সাপেক্ষে কেনাকাটা সম্পন্ন হবে।"
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/90 space-y-6">
          
          {/* Step 1: Category selection */}
          <div>
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2 flex items-center gap-2 text-red-600">
              <Compass className="w-4 h-4" />
              ১. শপিং ক্যাটাগরি নির্বাচন করুন
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'custom_shopping', label: 'যেকোনো স্থানীয় পণ্য' },
                { id: 'restaurant', label: 'রেস্টুরেন্টের খাবার' },
                { id: 'grocery', label: 'মুদি ও সুপারশপ' },
                { id: 'vegetables', label: 'কাঁচাবাজারের শাকসবজি' },
                { id: 'meat_fish', label: 'তাজা মাছ ও মাংস' },
                { id: 'fruits', label: 'তাজা ফলমূল' },
                { id: 'bakery_snacks', label: 'বেকারি ও মিষ্টি' },
                { id: 'pharmacy', label: 'ফার্মেসি ও ফার্স্ট এইড' },
              ].map(cat => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setStoreCategory(cat.id as StoreCategory)}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                    storeCategory === cat.id
                      ? 'border-red-600 bg-red-50 text-red-700 ring-2 ring-red-500'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Preferred Store / Market */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 text-red-600">
              <Store className="w-4 h-4" />
              ২. পছন্দের দোকান বা বাজারের নাম (জানা থাকলে)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  দোকান / বাজারের নাম (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={restaurantName}
                  onChange={e => setRestaurantName(e.target.value)}
                  placeholder="উদা: ময়লাপোতা বাজার, রূপসা মাছের ঘাট, স্বপ্ন সুপারশপ..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  জানা না থাকলে ফাঁকা রাখুন—আমাদের টিম নির্ভরযোগ্য দোকান নির্বাচন করবে।
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  দোকানের এলাকা / পিকআপ লোকেশন (খুলনা)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={restaurantLocation}
                    onChange={e => setRestaurantLocation(e.target.value)}
                    placeholder="উদা: শিববাড়ি মোড়, সোনাডাঙ্গা, চুকনগর..."
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Required Items & Budget */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 text-red-600">
              <ShoppingBag className="w-4 h-4" />
              ৩. প্রয়োজনীয় পণ্য ও আনুমানিক বাজেট
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  পণ্যের নাম ও পরিমাণ (বিস্তারিত তালিকা) <span className="text-red-600">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={requestedItems}
                  onChange={e => setRequestedItems(e.target.value)}
                  placeholder="উদা: ৫ কেজি নাজিরশাইল চাল, ২ লিটার তীর সয়াবিন তেল, ১ কেজি দেশি গোল বেগুন ও ১ পাতা নাপা এক্সটেন্ড..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    আপনার আনুমানিক পণ্যের বাজেট (৳) <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <span className="font-bold text-slate-500 absolute left-3 top-1/2 -translate-y-1/2">৳</span>
                    <input
                      type="number"
                      required
                      min={50}
                      value={expectedBudget}
                      onChange={e => setExpectedBudget(e.target.value)}
                      placeholder="500"
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    দোকানের আসল ক্যাশ মেমো মেপে চূড়ান্ত পণ্যের মূল্য ধার্য হবে।
                  </span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    পণ্য বা প্রেসক্রিপশনের ছবি (ঐচ্ছিক)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                  />
                  {photoPreview && (
                    <div className="mt-2 w-16 h-16 rounded-xl overflow-hidden border border-slate-200">
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  স্পেশাল নির্দেশিকা (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={additionalNotes}
                  onChange={e => setAdditionalNotes(e.target.value)}
                  placeholder="উদা: তাজা মাছ কেটে টুকরো করে নিতে হবে, শাক যেন টাটকা থাকে..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>

          {/* Step 4: Customer Delivery Address & Manual Distance Selection */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 text-red-600">
              <MapPin className="w-4 h-4" />
              ৪. ডেলিভারি ঠিকানা ও দূরত্ব
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  আপনার নাম <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="আপনার নাম"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  সক্রিয় মোবাইল নম্বর (+৮৮০) <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  placeholder="017xxxxxxxx"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                />
              </div>

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
                      setEstimatedDistanceKm(found.approxDistanceKmFromCenter || 3.0);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-500 font-semibold text-slate-800"
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
                  বাসার পূর্ণ ঠিকানা <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  placeholder="বাড়ি #১২, রোড #৩, নিরালা/সোনাডাঙ্গা..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Estimated Road Distance Selector */}
            <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-red-600" />
                  আনুমানিক দূরত্ব (কি.মি.):
                </span>
                <span className="font-extrabold text-sm text-red-600 bg-white px-2.5 py-0.5 rounded-lg border">
                  {estimatedDistanceKm} কি.মি.
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="30"
                step="0.5"
                value={estimatedDistanceKm}
                onChange={e => setEstimatedDistanceKm(parseFloat(e.target.value))}
                className="w-full accent-red-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>১ কি.মি. (কাছে)</span>
                <span>১৫ কি.মি.</span>
                <span>৩০ কি.মি. (দূরবর্তী)</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-1 font-mono">
                আনুমানিক ডেলিভারি ফি: {formulaExplanation}
              </p>
            </div>
          </div>

          {/* Pricing Preview Breakdown */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="text-xs text-slate-500">আনুমানিক মোট খরচ:</div>
              <div className="text-lg font-black text-slate-900">
                {(parseInt(expectedBudget, 10) || 0) + calculatedDeliveryFee + deliveryConfig.serviceFee + deliveryConfig.handlingFee}৳{' '}
                <span className="text-xs font-normal text-slate-500">
                  (পণ্য {expectedBudget}৳ + ডেলিভারি {calculatedDeliveryFee}৳ + কনসিয়ার্জ ও প্যাকেজিং {deliveryConfig.serviceFee + deliveryConfig.handlingFee}৳)
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm shadow-xl shadow-red-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>অনুরোধ পাঠানো হচ্ছে...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>কাস্টম শপিং অনুরোধ পাঠান</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
