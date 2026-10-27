import React from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import {
  UtensilsCrossed,
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  ShieldCheck,
  Heart,
  ExternalLink,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView, deliveryZones } = useStore();
  const { language } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-24 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white font-black shadow-md">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <span className="font-black text-xl text-white tracking-tight">
                  খুলনা ফুড এক্সপ্রেস
                </span>
                <span className="text-[10px] bg-red-600 text-white font-bold ml-2 px-1.5 py-0.5 rounded uppercase">
                  Khulna
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              খুলনার যেকোনো রেস্টুরেন্টের খাবার সরাসরি আপনার বাসায় পৌঁছে দেওয়ার স্বাধীন হোম ডেলিভারি ও পার্সোনাল পিকআপ সার্ভিস। ফুডপ্যান্ডা বা অন্য কোনো অ্যাপে না থাকলেও কাস্টম রিকোয়েস্টে এনে দেওয়া হয়।
            </p>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                <span>অফিস: কেডিএ এভিনিউ, শিববাড়ি মোড় সংলগ্ন, খুলনা-৯০০০</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>হটলাইন: +৮৮০ ১৭০০-১২৩৪৫৬ (সকাল ৯টা - রাত ১১টা)</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="https://wa.me/8801700123456?text=খুলনা%20ফুড%20এক্সপ্রেস"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-emerald-400 font-semibold"
                >
                  WhatsApp সাপোর্ট: ০১৭০০-১২৩৪৫৬
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">
              দ্রুত লিঙ্কসমূহ
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setActiveView('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  হোমপেজ
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('restaurants');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  রেস্টুরেন্ট মেনু তালিকা
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('custom_order');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-amber-400 hover:text-amber-300 font-bold transition-colors"
                >
                  যেকোনো রেস্টুরেন্ট কাস্টম অর্ডার
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('how_it_works');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  কীভাবে কাজ করে
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('track');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  লাইভ অর্ডার ট্র্যাকিং
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('admin');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-slate-400 hover:text-slate-200"
                >
                  অ্যাডমিন ড্যাশবোর্ড
                </button>
              </li>
            </ul>
          </div>

          {/* Khulna Coverage Areas */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">
              খুলনার কভারেজ এলাকা
            </h4>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              {deliveryZones.map(zone => (
                <span
                  key={zone.id}
                  className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700/60"
                >
                  {zone.nameBangla.split(' (')[0]}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 pt-2">
              * দূরবর্তী জোন (যেমন চুকনগর হাইওয়ে বা ফুলতলা) স্পেশাল লং-রুট রাইডার দ্বারা পরিচালিত হয়।
            </p>
          </div>

        </div>

        {/* Legal & Honest Disclaimer Notice */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-400 space-y-3">
          <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700/60 text-[11px] text-slate-300 leading-relaxed">
            <span className="font-bold text-amber-400 block mb-0.5">
              স্বচ্ছ ব্যবসায়িক ঘোষণা ও ডিসক্লেইমার:
            </span>
            খুলনা ফুড এক্সপ্রেস একটি স্বাধীন লোকাল ডেলিভারি ও পার্সোনাল কুরিয়ার প্ল্যাটফর্ম। আমরা কাস্টমারের পক্ষ থেকে রেস্টুরেন্টে গিয়ে খাবার ক্রয় ও সংগ্রহ করে পৌঁছে দিয়ে থাকি। তালিকাভুক্ত ডেমো রেস্টুরেন্টগুলোর সাথে কোনো মিথ্যা অফিশিয়াল পার্টনারশিপ দাবি করা হয় না। রেস্টুরেন্টের খাবার প্রাপ্যতা ও দাম যাচাই সাপেক্ষে প্রতিটি অর্ডার কার্যকর হয়।
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <div>
              © ২০২৬ খুলনা ফুড এক্সপ্রেস (Khulna Food Express)। সর্বস্বত্ব সংরক্ষিত।
            </div>
            <div className="flex items-center gap-1">
              <span>খুলনার খাবারের জন্য ভালোবাসা দিয়ে তৈরি</span>
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
