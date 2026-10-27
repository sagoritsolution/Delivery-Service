import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  RotateCcw,
  Plus,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  LogOut,
  ExternalLink,
} from 'lucide-react';

export const CustomerAccountView: React.FC = () => {
  const {
    currentUser,
    loginUser,
    logoutUser,
    orders,
    addSavedAddress,
    deliveryZones,
    selectedZone,
    setActiveView,
    setTrackingOrderId,
    addToCart,
    restaurants,
  } = useStore();

  const { language } = useLanguage();

  const [loginPhone, setLoginPhone] = useState('');
  const [loginName, setLoginName] = useState('');
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newLabel, setNewLabel] = useState('বাসা (Home)');
  const [newAddressText, setNewAddressText] = useState('');
  const [newArea, setNewArea] = useState(selectedZone.id);

  if (!currentUser) {
    return (
      <div className="py-12 px-4 max-w-md mx-auto">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            <User className="w-7 h-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">
            গ্রাহক একাউন্টে প্রবেশ করুন
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            মোবাইল নম্বর দিয়ে খুব সহজেই অর্ডার ট্র্যাক ও ঠিকানা সংরক্ষণ করুন।
          </p>

          <form
            onSubmit={e => {
              e.preventDefault();
              if (loginPhone.trim()) {
                loginUser(loginPhone.trim(), loginName.trim() || undefined);
              }
            }}
            className="space-y-4 text-left"
          >
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                আপনার নাম (ঐচ্ছিক)
              </label>
              <input
                type="text"
                value={loginName}
                onChange={e => setLoginName(e.target.value)}
                placeholder="উদা: সাকিব আল হাসান"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                মোবাইল নম্বর <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={loginPhone}
                  onChange={e => setLoginPhone(e.target.value)}
                  placeholder="017xxxxxxxx"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              লগইন / রেজিস্টার করুন
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400">
            ডেমো মোড: যেকোনো বাংলাদেশি মোবাইল নম্বর দিয়ে প্রবেশ করা যাবে।
          </div>
        </div>
      </div>
    );
  }

  const myOrders = orders;

  const handleReorder = (order: (typeof orders)[0]) => {
    const res = restaurants.find(r => r.id === order.restaurantId);
    if (!res) {
      alert('রেস্টুরেন্টটি বর্তমানে অফলাইনে আছে।');
      return;
    }
    if (res.menu.length > 0) {
      addToCart(res.menu[0], res, 1);
      setActiveView('restaurants');
    }
  };

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressText.trim()) return;
    addSavedAddress({
      label: newLabel,
      address: newAddressText.trim(),
      area: newArea,
    });
    setNewAddressText('');
    setShowAddAddress(false);
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* User Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 text-white flex items-center justify-center font-black text-2xl shadow-md">
              {currentUser.name.slice(0, 1)}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {currentUser.name}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-red-500" />
                  {currentUser.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {currentUser.email}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={logoutUser}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>লগআউট</span>
          </button>
        </div>

        {/* Saved Addresses Section */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-600" />
              সংরক্ষিত ডেলিভারি ঠিকানা ({currentUser.addresses.length})
            </h3>
            <button
              onClick={() => setShowAddAddress(!showAddAddress)}
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন ঠিকানা যোগ করুন</span>
            </button>
          </div>

          {showAddAddress && (
            <form onSubmit={handleAddNewAddress} className="mb-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">লেবেল</label>
                  <select
                    value={newLabel}
                    onChange={e => setNewLabel(e.target.value)}
                    className="w-full p-2 bg-white rounded-xl border text-xs"
                  >
                    <option value="বাসা (Home)">বাসা (Home)</option>
                    <option value="অফিস (Office)">অফিস (Office)</option>
                    <option value="অন্যান্য (Other)">অন্যান্য (Other)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">এরিয়া</label>
                  <select
                    value={newArea}
                    onChange={e => setNewArea(e.target.value)}
                    className="w-full p-2 bg-white rounded-xl border text-xs"
                  >
                    {deliveryZones.map(z => (
                      <option key={z.id} value={z.id}>
                        {z.nameBangla}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">বিস্তারিত ঠিকানা</label>
                  <input
                    type="text"
                    required
                    value={newAddressText}
                    onChange={e => setNewAddressText(e.target.value)}
                    placeholder="বাড়ি, রোড, এলাকা..."
                    className="w-full p-2 bg-white rounded-xl border text-xs"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddAddress(false)}
                  className="px-3 py-1.5 rounded-lg border text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentUser.addresses.map(addr => (
              <div
                key={addr.id}
                className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    {addr.label}
                  </span>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {addr.address}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Previous Orders & Requests History */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
          <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-red-600" />
            পূর্ববর্তী অর্ডার ও কাস্টম রিকোয়েস্ট হিস্ট্রি ({myOrders.length})
          </h3>

          <div className="space-y-4">
            {myOrders.map(order => (
              <div
                key={order.id}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 hover:border-slate-300 transition-all space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-red-600">
                      {order.orderNumber}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {order.type === 'custom_request' ? 'কাস্টম রিকোয়েস্ট' : 'স্ট্যান্ডার্ড অর্ডার'}
                    </span>
                    <span className="text-xs text-slate-400">
                      • {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-700">
                    {order.status}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-slate-900">
                      রেস্টুরেন্ট: {order.restaurantBanglaName || order.restaurantName}
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      {order.items.map(i => `${i.banglaName || i.name} (${i.quantity})`).join(', ')}
                    </div>
                  </div>

                  <div className="text-right sm:text-right shrink-0">
                    <div className="text-[10px] text-slate-400">মোট পরিশোধ:</div>
                    <div className="font-black text-sm text-slate-900">{order.total}৳</div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setTrackingOrderId(order.orderNumber);
                      setActiveView('track');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors"
                  >
                    <span>স্ট্যাটাস দেখুন</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  {order.type === 'standard' && (
                    <button
                      onClick={() => handleReorder(order)}
                      className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>পুনরায় অর্ডার (Reorder)</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
