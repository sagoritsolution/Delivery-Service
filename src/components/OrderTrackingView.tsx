import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { OrderStatus } from '../types';
import {
  Search,
  CheckCircle2,
  Clock,
  Bike,
  Store,
  Phone,
  MessageCircle,
  MapPin,
  AlertCircle,
  AlertTriangle,
  FileCheck2,
  XCircle,
  ShieldAlert,
  Route,
  ShoppingBag,
} from 'lucide-react';

export const OrderTrackingView: React.FC = () => {
  const { orders, trackingOrderId, setTrackingOrderId, customerRespondToQuotation } = useStore();
  const { language } = useLanguage();
  const [searchInput, setSearchInput] = useState(trackingOrderId || '');

  // Look up order by ID or orderNumber
  const currentOrder =
    orders.find(
      o =>
        o.orderNumber.toLowerCase() === (searchInput || trackingOrderId).toLowerCase().trim() ||
        o.id.toLowerCase() === (searchInput || trackingOrderId).toLowerCase().trim()
    ) || orders[0];

  const stages: { key: OrderStatus; titleBn: string; titleEn: string; descBn: string }[] = [
    {
      key: 'received',
      titleBn: '১. অর্ডার অনুরোধ গৃহীত হয়েছে',
      titleEn: '1. Order Request Received',
      descBn: 'কাস্টমারের অর্ডার সিস্টেম বা কাস্টম ফরম থেকে সফলভাবে গ্রহণ করা হয়েছে।',
    },
    {
      key: 'availability_checking',
      titleBn: '২. প্রাপ্যতা ও আসল বাজারমূল্য যাচাই',
      titleEn: '2. Checking Availability & Price',
      descBn: 'আমাদের প্রতিনিধি দোকান/বাজারে গিয়ে আইটেম ও সঠিক মূল্য যাচাই করছে।',
    },
    {
      key: 'confirmed',
      titleBn: '৩. অর্ডার নিশ্চিত ও চূড়ান্ত অনুমোদিত',
      titleEn: '3. Order Confirmed',
      descBn: 'দোকান বা কাস্টমারের সাথে চূড়ান্ত মূল্য ও প্রাপ্যতা নিশ্চিত হয়েছে।',
    },
    {
      key: 'preparing',
      titleBn: '৪. পণ্য/খাবার সংগ্রহ ও প্রস্তুত হচ্ছে',
      titleEn: '4. Preparing / Packing Items',
      descBn: 'খাবার রান্না হচ্ছে অথবা মুদি/কাঁচাবাজারের আইটেম বাছাই ও প্যাক করা হচ্ছে।',
    },
    {
      key: 'rider_collecting',
      titleBn: '৫. রাইডার পণ্য সংগ্রহ করেছে',
      titleEn: '5. Rider Collected Items',
      descBn: 'নিযুক্ত রাইডার দোকানে পৌঁছে আসল ক্যাশ মেমো যাচাই করে পার্সেল সংগ্রহ করেছে।',
    },
    {
      key: 'out_for_delivery',
      titleBn: '৬. ডেলিভারির পথে',
      titleEn: '6. Out for Delivery',
      descBn: 'রাইডার আপনার ঠিকানার উদ্দেশ্যে রওনা দিয়েছে। সরাসরি ফোন করে পৌঁছাবে।',
    },
    {
      key: 'delivered',
      titleBn: '৭. সফলভাবে ডেলিভারি সম্পন্ন',
      titleEn: '7. Delivered',
      descBn: 'পণ্য কাস্টমারের হাতে পৌঁছে দেওয়া হয়েছে। খুলনা এক্সপ্রেস ব্যবহারের জন্য ধন্যবাদ!',
    },
  ];

  const getStageIndex = (status: OrderStatus) => {
    switch (status) {
      case 'received':
        return 0;
      case 'availability_checking':
      case 'awaiting_approval':
        return 1;
      case 'confirmed':
        return 2;
      case 'preparing':
        return 3;
      case 'rider_collecting':
      case 'pickup_completed':
        return 4;
      case 'out_for_delivery':
        return 5;
      case 'delivered':
        return 6;
      case 'cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const currentStageIndex = currentOrder ? getStageIndex(currentOrder.status) : 0;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setTrackingOrderId(searchInput.trim());
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Search & Selector Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>লাইভ ৭-ধাপ অর্ডার স্ট্যাটাস ট্র্যাকার</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              খুলনা অল-ইন-ওয়ান ডেলিভারি ট্র্যাকিং
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              আপনার অর্ডার আইডি দিয়ে যেকোনো সময় রেস্টুরেন্ট, মুদি কিংবা কাস্টম শপিংয়ের লাইভ অবস্থা ট্র্যাক করুন।
            </p>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="অর্ডার আইডি লিখুন (উদা: KF-2026-101 বা KF-QUOT-302)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md transition-colors shrink-0"
            >
              ট্র্যাক করুন
            </button>
          </form>

          {/* Quick Order Tabs */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-slate-400 font-medium">নমুনা সক্রিয় অর্ডারসমূহ:</span>
            {orders.slice(0, 5).map(o => (
              <button
                key={o.id}
                onClick={() => {
                  setSearchInput(o.orderNumber);
                  setTrackingOrderId(o.orderNumber);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  currentOrder?.id === o.id
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {o.orderNumber}
                {o.status === 'awaiting_approval' && (
                  <span className="ml-1.5 inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Distance & Maps Notice */}
        <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>রোড দূরত্ব ও ডেলিভারি ফি তথ্য:</strong> গুগল ম্যাপস বিলিং ছাড়াই ম্যানুয়াল কিলোমিটার দূরত্বের ভিত্তিতে ফি হিসাব করা হয়। অ্যাডমিন যাচাই শেষে চূড়ান্ত ফি নিশ্চিত করে।
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-amber-200/70 text-amber-900 font-semibold text-[11px] shrink-0 hidden sm:inline-block">
            স্বচ্ছ মূল্যনীতি
          </span>
        </div>

        {currentOrder ? (
          <div className="space-y-6">

            {/* CUSTOMER QUOTATION APPROVAL MODAL / BANNER (When Awaiting Approval) */}
            {currentOrder.status === 'awaiting_approval' && currentOrder.revisedQuotation && (
              <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 p-0.5 rounded-3xl shadow-lg animate-pulse">
                <div className="bg-white rounded-[22px] p-6 sm:p-8 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-6 h-6 animate-bounce" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
                          কাস্টমার অ্যাকশন প্রয়োজন
                        </span>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                          সংশোধিত কোটেশন ও কাস্টমার অনুমোদন
                        </h2>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full self-start sm:self-auto">
                      অপেক্ষমাণ কোটেশন
                    </span>
                  </div>

                  <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/70 text-sm text-slate-800 space-y-2">
                    <p className="font-semibold text-amber-950 flex items-center gap-1.5">
                      <FileCheck2 className="w-4 h-4 text-amber-600" />
                      দোকান বা বাজারের তথ্য ও কারণ:
                    </p>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                      "{currentOrder.revisedQuotation.reason}"
                    </p>
                  </div>

                  {/* Price Comparison Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-[11px] text-slate-400 block font-medium">প্রাথমিক অনুমান</span>
                      <span className="text-sm font-bold text-slate-500 line-through">
                        ৳{currentOrder.revisedQuotation.oldTotal}
                      </span>
                    </div>

                    <div className="p-3 bg-red-50 rounded-2xl border border-red-100">
                      <span className="text-[11px] text-red-600 block font-medium">সংশোধিত আইটেম মূল্য</span>
                      <span className="text-base sm:text-lg font-black text-slate-900">
                        ৳{currentOrder.revisedQuotation.newProductCost}
                      </span>
                    </div>

                    <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100">
                      <span className="text-[11px] text-blue-700 block font-medium">
                        যাচাইকৃত দূরত্ব ({currentOrder.revisedQuotation.newDistanceKm} কিমি)
                      </span>
                      <span className="text-base sm:text-lg font-black text-blue-900">
                        ৳{currentOrder.revisedQuotation.newDeliveryFee}
                      </span>
                    </div>

                    <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                      <span className="text-[11px] text-emerald-700 block font-bold">সংশোধিত চূড়ান্ত মোট</span>
                      <span className="text-lg sm:text-xl font-black text-emerald-700">
                        ৳{currentOrder.revisedQuotation.newTotal}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 text-center">
                    কাস্টমার সম্মতি দিলেই কেবল আমাদের রাইডার দোকানে মূল্য পরিশোধ করে পণ্য ক্রয় করবে। আপনি চাইলে এটি বাতিলও করতে পারেন।
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => customerRespondToQuotation(currentOrder.id, true)}
                      className="flex-1 py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>সংশোধিত মূল্যে অনুমোদন করুন (Approve Order)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => customerRespondToQuotation(currentOrder.id, false)}
                      className="py-3 px-6 rounded-2xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 font-bold text-sm flex items-center justify-center gap-2 border border-slate-200 transition-colors"
                    >
                      <XCircle className="w-5 h-5 text-red-500" />
                      <span>বাতিল করুন (Decline & Cancel)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Approved / Cancelled Notification Badges */}
            {currentOrder.revisedQuotation && currentOrder.revisedQuotation.customerApproved === true && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-900 text-xs sm:text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold">সংশোধিত কোটেশন অনুমোদিত:</span> আপনি ৳{currentOrder.revisedQuotation.newTotal} সংশোধিত মূল্যে সম্মতি দিয়েছেন। রাইডার পণ্য সংগ্রহ করছে।
                </div>
              </div>
            )}

            {currentOrder.status === 'cancelled' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-900 text-xs sm:text-sm">
                <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                <div>
                  <span className="font-bold">অর্ডার বাতিল করা হয়েছে:</span> এই অর্ডারটি সমাপ্ত বা বাতিল করা হয়েছে। নতুন অর্ডারের জন্য হোমপেজে ফিরে যান।
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left 7-Stage Progress Timeline */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-base sm:text-lg text-red-600">
                        {currentOrder.orderNumber}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {currentOrder.type === 'custom_request' ? 'কাস্টম রিকোয়েস্ট' : 'স্টোর অর্ডার'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      অর্ডার সময়: {new Date(currentOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">আনুমানিক সময়:</span>
                    <span className="font-extrabold text-sm sm:text-base text-slate-900">
                      {currentOrder.estimatedDeliveryTime || '৩০-৪০ মিনিট'}
                    </span>
                  </div>
                </div>

                {/* 7-Step Vertical Flow */}
                <div className="relative pl-6 space-y-7 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {stages.map((stage, idx) => {
                    const isDone = currentStageIndex > idx;
                    const isCurrent = currentStageIndex === idx;

                    return (
                      <div key={stage.key} className="relative flex items-start gap-4">
                        {/* Timeline Dot / Icon */}
                        <div
                          className={`absolute -left-[30px] top-0 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                            isDone
                              ? 'bg-emerald-500 text-white shadow-xs ring-4 ring-emerald-50'
                              : isCurrent
                              ? 'bg-red-600 text-white shadow-md ring-4 ring-red-100 animate-pulse'
                              : 'bg-white border-2 border-slate-300 text-slate-400'
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <span className="text-[10px]">{idx + 1}</span>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4
                              className={`text-xs sm:text-sm font-bold ${
                                isCurrent
                                  ? 'text-red-600'
                                  : isDone
                                  ? 'text-slate-900'
                                  : 'text-slate-400'
                              }`}
                            >
                              {language === 'bn' ? stage.titleBn : stage.titleEn}
                            </h4>
                            {isCurrent && (
                              <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                                বর্তমান অবস্থা
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-xs mt-0.5 leading-relaxed ${
                              isCurrent
                                ? 'text-slate-700 font-medium'
                                : isDone
                                ? 'text-slate-500'
                                : 'text-slate-400'
                            }`}
                          >
                            {stage.descBn}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* Right Column: Order Details, Distance Breakdown & Rider Card */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Distance & Route Card */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Route className="w-4 h-4 text-blue-600" />
                      ম্যানুয়াল রোড দূরত্ব ও লোকেশন
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        currentOrder.isDistanceConfirmedByAdmin
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {currentOrder.isDistanceConfirmedByAdmin ? 'অ্যাডমিন নিশ্চিত দূরত্ব' : 'আনুমানিক রোড দূরত্ব'}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl space-y-2 text-xs">
                    <div className="flex items-start gap-2">
                      <Store className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-400 block text-[10px]">পিকআপ স্টোর / বাজার:</span>
                        <span className="font-semibold text-slate-800">
                          {currentOrder.restaurantBanglaName || currentOrder.restaurantName} ({currentOrder.pickupAddress})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 pt-1 border-t border-slate-200/60">
                      <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-400 block text-[10px]">ডেলিভারি ঠিকানা:</span>
                        <span className="font-semibold text-slate-800">
                          {currentOrder.customer.deliveryAddress} ({currentOrder.customer.deliveryArea})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 px-1">
                    <span className="text-slate-500">নির্ধারিত সড়ক দূরত্ব:</span>
                    <span className="font-mono font-bold text-slate-800">
                      ~{currentOrder.distanceKm} কিমি (KM)
                    </span>
                  </div>
                </div>

                {/* Assigned Rider Card */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Bike className="w-4 h-4 text-red-600" />
                      নিযুক্ত শপার / ডেলিভারি রাইডার
                    </h3>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      অন-ডিউটি
                    </span>
                  </div>

                  {currentOrder.riderName ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 text-white font-extrabold text-base flex items-center justify-center">
                          {currentOrder.riderName.slice(0, 1)}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-sm">
                            {currentOrder.riderName}
                          </h4>
                          <p className="text-xs text-slate-500">
                            {currentOrder.riderPhone}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            মোটরসাইকেল: খুলনা মেট্রো হ-১২৮৯
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <a
                          href={`tel:${currentOrder.riderPhone}`}
                          className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>সরাসরি কল</span>
                        </a>
                        <a
                          href={`https://wa.me/8801700123456?text=অর্ডার%20${currentOrder.orderNumber}%20সম্পর্কে%20জানতে%20চাই`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-xs text-slate-500 bg-slate-50 rounded-2xl p-4">
                      <p className="font-semibold text-slate-700 mb-1">
                        রাইডার দ্রুতই নিযুক্ত হবে
                      </p>
                      <p className="text-[11px] text-slate-400">
                        দোকান থেকে পণ্য প্রস্তুত ও মূল্য নিশ্চিত হলেই নিকটস্থ রাইডারকে দায়িত্ব দেওয়া হবে।
                      </p>
                    </div>
                  )}
                </div>

                {/* Order Summary Card */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-red-600" />
                    অর্ডার ও পণ্যের বিবরণ
                  </h3>

                  <div className="p-3 bg-slate-50 rounded-2xl space-y-1 text-xs">
                    <div className="font-semibold text-slate-800">
                      দোকান/রেস্টুরেন্ট: {currentOrder.restaurantBanglaName || currentOrder.restaurantName}
                    </div>
                    {currentOrder.customer.instructions && (
                      <div className="text-[11px] text-amber-700 italic pt-1">
                        বিশেষ নোট: {currentOrder.customer.instructions}
                      </div>
                    )}
                  </div>

                  {/* Items list */}
                  <div className="divide-y divide-slate-100 text-xs">
                    {currentOrder.items.map((item, i) => (
                      <div key={i} className="py-2 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-slate-800">{item.banglaName || item.name}</span>
                          <span className="text-slate-400 ml-1.5 font-mono">
                            × {item.quantity} {item.unit || ''}
                          </span>
                        </div>
                        <span className="font-bold text-slate-900">{item.price * item.quantity}৳</span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing totals */}
                  <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>আইটেম মূল্য (পণ্য):</span>
                      <span>{currentOrder.subtotal}৳</span>
                    </div>
                    <div className="flex justify-between">
                      <span>দূরত্বভিত্তিক ডেলিভারি ফি ({currentOrder.distanceKm} কিমি):</span>
                      <span>{currentOrder.deliveryFee}৳</span>
                    </div>
                    {currentOrder.handlingFee > 0 && (
                      <div className="flex justify-between">
                        <span>শপিং ও কনসিয়ার্জ হ্যান্ডলিং ফি:</span>
                        <span>{currentOrder.handlingFee}৳</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>সার্ভিস ফি:</span>
                      <span>{currentOrder.serviceFee}৳</span>
                    </div>
                    {currentOrder.discount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>ছাড়:</span>
                        <span>-{currentOrder.discount}৳</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-slate-200 flex justify-between items-center font-black text-sm text-slate-900">
                      <span>সর্বমোট টাকা:</span>
                      <span className="text-base text-red-600 font-bold">{currentOrder.total}৳</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>পেমেন্ট: {currentOrder.paymentMethod.toUpperCase()}</span>
                    <span className="text-amber-600 font-semibold">
                      পেমেন্ট স্ট্যাটাস: {currentOrder.paymentStatus === 'verified' ? 'পরিশোধিত' : 'ক্যাশ অন ডেলিভারি'}
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl p-6 border border-slate-200">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">কোনো অর্ডার পাওয়া যায়নি</h3>
            <p className="text-xs text-slate-500 mt-1">
              সঠিক অর্ডার আইডি প্রদান করুন অথবা হোমপেজ থেকে নতুন অর্ডার দিন।
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
