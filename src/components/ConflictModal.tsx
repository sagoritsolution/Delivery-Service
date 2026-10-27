import React from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { AlertCircle, ShoppingBag, ArrowRight, X } from 'lucide-react';

export const ConflictModal: React.FC = () => {
  const { conflictModal, closeConflictModal, resolveConflictAndAdd, cartRestaurant } = useStore();
  const { t } = useLanguage();

  if (!conflictModal.isOpen || !conflictModal.newRestaurant || !conflictModal.newItem) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
        <button
          onClick={closeConflictModal}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2">
          একটি অর্ডারে শুধুমাত্র একটি রেস্টুরেন্ট নির্বাচন সম্ভব
        </h3>

        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
          আপনার কার্টে বর্তমানে <span className="font-semibold text-slate-800">{cartRestaurant?.banglaName || cartRestaurant?.name}</span>-এর খাবার রয়েছে।
          নতুন রেস্টুরেন্ট <span className="font-semibold text-red-600">{conflictModal.newRestaurant.banglaName}</span> থেকে খাবার যোগ করতে চাইলে আগের কার্ট খালি হয়ে যাবে।
        </p>

        <div className="p-3 bg-slate-50 rounded-xl mb-5 border border-slate-100 text-xs text-slate-700 flex items-center justify-between">
          <div>
            <span className="text-slate-400 block mb-0.5">নতুন যোগ হতে চলেছে:</span>
            <span className="font-semibold text-slate-900">{conflictModal.newItem.banglaName}</span>
          </div>
          <span className="font-bold text-red-600 text-sm">{conflictModal.newItem.price}৳</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={closeConflictModal}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors text-sm"
          >
            বাতিল করুন
          </button>
          <button
            onClick={resolveConflictAndAdd}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors text-sm shadow-md shadow-red-600/20 flex items-center justify-center gap-1.5"
          >
            <span>কার্ট পরিবর্তন করুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
