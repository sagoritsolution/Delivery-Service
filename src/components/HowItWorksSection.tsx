import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import {
  Smartphone,
  Store,
  Bike,
  Sparkles,
  PhoneCall,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const { language } = useLanguage();
  const { setActiveView } = useStore();

  const steps = [
    {
      num: '১',
      title: 'কাস্টমার অর্ডার করবে',
      titleEn: '1. Customer Places Order',
      desc: 'ওয়েবসাইটে পছন্দের রেস্টুরেন্ট নির্বাচন করুন অথবা ফোন, WhatsApp বা কাস্টম রিকোয়েস্টে জানান কোন রেস্টুরেন্টের কী খাবার লাগবে।',
      descEn: 'Select from available restaurants on our website or tell us via phone/WhatsApp which restaurant and food items you need.',
      icon: Smartphone,
      color: 'from-red-500 to-rose-600',
      badge: 'সহজ ও ঝামেলাহীন',
    },
    {
      num: '২',
      title: 'আমরা রেস্টুরেন্ট থেকে খাবার সংগ্রহ করব',
      titleEn: '2. We Collect from Restaurant',
      desc: 'আমাদের প্রতিনিধি রেস্টুরেন্টে গিয়ে খাবারের প্রাপ্যতা ও দাম নিশ্চিত করে খাবার সংগ্রহ করবেন এবং স্বাস্থ্যসম্মত প্যাকেজিং তদারকি করবেন।',
      descEn: 'Our rider visits the restaurant, verifies kitchen availability, food price, inspects packaging, and collects your food fresh.',
      icon: Store,
      color: 'from-amber-500 to-orange-600',
      badge: 'আসল দাম নিশ্চিতকরণ',
    },
    {
      num: '৩',
      title: 'কাস্টমারের বাসায় খাবার পৌঁছে দেব',
      titleEn: '3. Doorstep Delivery to You',
      desc: 'খাবারের আসল রসিদ ও স্বচ্ছ ডেলিভারি চার্জসহ গরম গরম খাবার দ্রুত আপনার বাসায় বা অফিসে পৌঁছে দেওয়া হবে।',
      descEn: 'Delivered hot and fast with actual restaurant receipt and transparent distance delivery fee. Pay via COD, bKash or Nagad.',
      icon: Bike,
      color: 'from-emerald-500 to-teal-600',
      badge: 'দ্রুত হোম ডেলিভারি',
    },
  ];

  return (
    <section className="py-12 sm:py-20 bg-white border-b border-slate-100" id="how-it-works-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>৩টি সহজ ধাপে সম্পূর্ণ সেবা</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {language === 'bn' ? 'আমাদের সার্ভিস যেভাবে কাজ করে' : 'How Khulna Food Express Works'}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            {language === 'bn'
              ? 'খুলনার রেস্টুরেন্টে বসার সময় নেই বা রেস্টুরেন্টের নিজস্ব হোম ডেলিভারি নেই? চিন্তা নেই, আমরা পৌঁছে দেব!'
              : 'Restaurants without their own delivery app? No problem—our personal rider service bridges the gap!'}
          </p>
        </div>

        {/* User-Uploaded Reference Graphic Feature */}
        <div className="mb-12 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <span className="bg-amber-400 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                স্বচ্ছ বিজনেস মডেল
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                "খুলনার যেকোনো রেস্টুরেন্টের খাবার, এখন আপনার বাসায়!"
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                আমরা সরাসরি রেস্টুরেন্টে গিয়ে খাবার সংগ্রহ করি। ফুডপ্যান্ডা বা অন্য কোনো প্ল্যাটফর্মে রেস্টুরেন্ট তালিকাভুক্ত না থাকলেও আপনি ঘরে বসেই আপনার পছন্দের সুস্বাদু খাবার উপভোগ করতে পারবেন।
              </p>
              
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => setActiveView('custom_order')}
                  className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-600/30 transition-all flex items-center gap-2"
                >
                  <span>কাস্টম রিকোয়েস্ট পাঠান</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="https://wa.me/8801700123456?text=আমি%20খুলনা%20থেকে%20খাবার%20অর্ডার%20করতে%20চাই"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp এ অর্ডার দিন</span>
                </a>
              </div>
            </div>

            {/* Embedded Visual of the Business Model Flow */}
            <div className="lg:col-span-5 bg-white/5 p-3 rounded-2xl border border-white/10 backdrop-blur-xs flex flex-col items-center justify-center">
              <img
                src="/assets/aistudio/image_eb64535e.png"
                alt="আপনার ব্যবসাটা যেভাবে কাজ করবে"
                className="w-full h-auto rounded-xl object-contain shadow-md bg-white"
              />
              <span className="text-[11px] text-slate-300 mt-2 font-medium">
                খুলনা ফুড এক্সপ্রেস ওয়ার্কফ্লো (অর্ডার সংগ্রহ ও ডেলিভারি)
              </span>
            </div>

          </div>
        </div>

        {/* 3 Step Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50 hover:bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 hover:border-red-200 hover:shadow-xl transition-all duration-300 relative group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${step.color} text-white flex items-center justify-center font-black text-xl shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-3xl font-black text-slate-200 group-hover:text-red-100 transition-colors">
                      {step.num}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    {step.badge}
                  </span>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 group-hover:text-red-600 transition-colors">
                    {language === 'bn' ? step.title : step.titleEn}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {language === 'bn' ? step.desc : step.descEn}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{idx === 0 ? 'অনলাইন / ফোন / হোয়াটসঅ্যাপ' : idx === 1 ? 'আসল ক্যাশ মেমো সংগ্রহ' : 'ক্যাশ ও মোবাইল ব্যাংকিং'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Highlights Strip */}
        <div className="mt-12 sm:mt-16 bg-gradient-to-r from-red-50 via-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-red-600" />
              তালিকার বাইরেও যেকোনো খাবার
            </h4>
            <p className="text-xs text-slate-600">
              অ্যাপে নেই এমন দোকান বা গলির বিরিয়ানি হাউজ থেকেও সংগ্রহ করা হয়।
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              কেনার পূর্বে দাম কনফার্মেশন
            </h4>
            <p className="text-xs text-slate-600">
              রেস্টুরেন্টের আসল মেনু প্রাইস নিশ্চিত না করে কাস্টমারকে বিল করা হয় না।
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              স্বচ্ছ ও ফিক্সড ডেলিভারি ফি
            </h4>
            <p className="text-xs text-slate-600">
              দূরত্ব অনুযায়ী নির্ধারিত রেট, কোনো লুকানো ফি বা হিডেন চার্জ নেই।
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              সরাসরি রাইডার সাপোর্ট
            </h4>
            <p className="text-xs text-slate-600">
              রাইডারের ফোন নম্বর ও লাইভ যোগাযোগে অর্ডারের প্রতিটি আপডেট জানুন।
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
