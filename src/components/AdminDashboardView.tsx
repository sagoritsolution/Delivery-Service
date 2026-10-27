import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { OrderStatus, StoreCategory, RevisedQuotation, DeliveryConfig, Restaurant } from '../types';
import {
  Package,
  Store,
  Bike,
  Settings,
  DollarSign,
  TrendingUp,
  Search,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  AlertCircle,
  FileText,
  Sliders,
  Send,
  Plus,
  Route,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    updateCustomRequestPrice,
    sendRevisedQuotation,
    assignRiderToOrder,
    restaurants,
    toggleRestaurantOpenStatus,
    addRestaurant,
    deliveryConfig,
    updateDeliveryConfig,
    riders,
    calculateFeeForDistance,
    setTrackingOrderId,
    setActiveView,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'custom_requests' | 'stores' | 'riders' | 'pricing'>('orders');
  const [orderFilter, setOrderFilter] = useState<'all' | OrderStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Quotation Modal state
  const [quotationModalOrder, setQuotationModalOrder] = useState<any | null>(null);
  const [revisedProductCost, setRevisedProductCost] = useState<number>(0);
  const [revisedDistanceKm, setRevisedDistanceKm] = useState<number>(3);
  const [quotationReason, setQuotationReason] = useState<string>('');

  // Delivery Pricing Config state
  const [configForm, setConfigForm] = useState<DeliveryConfig>({
    ...deliveryConfig,
  });
  const [pricingSuccessMsg, setPricingSuccessMsg] = useState(false);

  // New Store Form State
  const [isAddingStore, setIsAddingStore] = useState(false);
  const [newStore, setNewStore] = useState({
    name: '',
    banglaName: '',
    category: 'grocery' as StoreCategory,
    area: 'শিববাড়ী মোড়',
    address: 'শিববাড়ী, খুলনা',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    deliveryTimeMinutes: '৩০-৪০',
    approxDistanceKm: 3.2,
    popularFor: 'তাজা মুদি সামগ্রী ও মসলা',
  });

  // Calculate high-level stats
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);
  const activeOrdersCount = orders.filter(
    o => o.status !== 'delivered' && o.status !== 'cancelled'
  ).length;
  const customRequestsCount = orders.filter(o => o.type === 'custom_request').length;

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    const matchesFilter = orderFilter === 'all' || o.status === orderFilter;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.phone.includes(searchTerm) ||
      o.restaurantName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const customOrders = orders.filter(o => o.type === 'custom_request');

  const openQuotationModal = (order: any) => {
    setQuotationModalOrder(order);
    setRevisedProductCost(order.subtotal);
    setRevisedDistanceKm(order.distanceKm || 3.0);
    setQuotationReason('দোকানে যাচাই করে দেখা গেছে আসল ক্রয়মূল্য ও রোড দূরত্ব আপডেট করা হয়েছে।');
  };

  const handleSendQuotationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quotationModalOrder) return;

    const calcDelivery = calculateFeeForDistance(revisedDistanceKm).fee;

    sendRevisedQuotation(quotationModalOrder.id, {
      newProductCost: revisedProductCost,
      newDistanceKm: revisedDistanceKm,
      newDeliveryFee: calcDelivery,
      reason: quotationReason,
    });
    setQuotationModalOrder(null);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateDeliveryConfig(configForm);
    setPricingSuccessMsg(true);
    setTimeout(() => setPricingSuccessMsg(false), 3000);
  };

  const handleCreateStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStore.name || !newStore.banglaName) return;

    const storeId = `store-${Date.now()}`;
    const created: Restaurant = {
      id: storeId,
      slug: storeId,
      name: newStore.name,
      banglaName: newStore.banglaName,
      category: newStore.category,
      cuisine: ['Local Store', 'Express'],
      banglaCuisine: ['স্থানীয় স্টোর', 'দ্রুত ডেলিভারি'],
      area: newStore.area,
      address: newStore.address,
      banglaAddress: newStore.address,
      deliveryFeeBase: 40,
      isVerifiedPartner: true,
      phone: '+8801700123456',
      openingHours: 'সকাল ৯:০০ - রাত ১০:০০',
      rating: newStore.rating,
      reviewCount: 42,
      deliveryTime: newStore.deliveryTimeMinutes,
      minOrder: 100,
      approxDistanceKm: Number(newStore.approxDistanceKm),
      coverImage: newStore.image,
      isOpen: true,
      isFeatured: true,
      menu: [
        {
          id: `item-${Date.now()}-1`,
          restaurantId: storeId,
          name: 'বিশেষ প্যাকেজ বা আইটেম',
          banglaName: 'তাজা বা নির্বাচিত আইটেম',
          description: 'মানসম্মত এবং যাচাইকৃত পণ্য সামগ্রী',
          banglaDescription: 'মানসম্মত এবং বাছাইকৃত পণ্য সামগ্রী',
          category: 'সাধারণ',
          price: 180,
          unit: 'প্যাকেট/কেজি',
          image: newStore.image,
          isAvailable: true,
          isPopular: true,
          isVeg: false,
        },
      ],
    };

    addRestaurant(created);
    setIsAddingStore(false);
    setNewStore({
      name: '',
      banglaName: '',
      category: 'grocery',
      area: 'শিববাড়ী মোড়',
      address: 'শিববাড়ী, খুলনা',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
      rating: 4.8,
      deliveryTimeMinutes: '৩০-৪০',
      approxDistanceKm: 3.2,
      popularFor: 'তাজা মুদি সামগ্রী ও মসলা',
    });
  };

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header & Stats Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold mb-2">
                <Settings className="w-3.5 h-3.5" />
                <span>খুলনা অল-ইন-ওয়ান ডেলিভারি অ্যাডমিন কন্ট্রোল প্যানেল</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                অ্যাডমিন ও ডেলিভারি অপারেশনস
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                ম্যানুয়াল দূরত্ব নিশ্চিতকরণ, সংশোধিত কোটেশন ইস্যু, শপ/মার্কেট ও রাইডার লজিস্টিকস ম্যানেজমেন্ট।
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/80 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                সিস্টেম লাইভ (খুলনা)
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs font-semibold">সক্রিয় ডেলিভারি</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-slate-900">{activeOrdersCount} টি</div>
              <span className="text-[10px] text-amber-600 font-medium">প্রক্রিয়াধীন রয়েছে</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs font-semibold">কাস্টম শপিং রিকোয়েস্ট</span>
                <Sparkles className="w-4 h-4 text-red-500" />
              </div>
              <div className="text-2xl font-black text-red-600">{customRequestsCount} টি</div>
              <span className="text-[10px] text-slate-500 font-medium">কোটেশন ও যাচাই প্রয়োজন</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs font-semibold">নিবন্ধিত শপ ও রেস্টুরেন্ট</span>
                <Store className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-black text-slate-900">{restaurants.length} টি</div>
              <span className="text-[10px] text-emerald-600 font-medium">১০টি ক্যাটাগরিতে</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs font-semibold">মোট ডেলিভারি ভলিউম</span>
                <DollarSign className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-emerald-600">৳{totalRevenue.toLocaleString()}</div>
              <span className="text-[10px] text-emerald-600 font-medium">সম্পন্ন ও সক্রিয় মিলিয়ে</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
              activeTab === 'orders'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>সকল অর্ডারসমূহ ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('custom_requests')}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
              activeTab === 'custom_requests'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>কাস্টম শপিং রিকোয়েস্ট ({customOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('stores')}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
              activeTab === 'stores'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>শপ ও রেস্টুরেন্ট তালিকা ({restaurants.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
              activeTab === 'pricing'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>দূরত্বভিত্তিক ডেলিভারি ফি কনফিগ</span>
          </button>

          <button
            onClick={() => setActiveTab('riders')}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
              activeTab === 'riders'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>রাইডার টিম ({riders.length})</span>
          </button>
        </div>

        {/* TAB 1: ALL ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="অর্ডার আইডি, কাস্টমার, ফোন..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                {(['all', 'received', 'availability_checking', 'awaiting_approval', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => setOrderFilter(status)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-colors ${
                      orderFilter === status
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {status === 'all' ? 'সবগুলো' : status.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">অর্ডার নং ও ধরন</th>
                      <th className="p-4">কাস্টমার ও ঠিকানা</th>
                      <th className="p-4">দোকান / বাজার</th>
                      <th className="p-4">দূরত্ব ও ডেলিভারি ফি</th>
                      <th className="p-4">সর্বমোট</th>
                      <th className="p-4">স্ট্যাটাস</th>
                      <th className="p-4">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.map(order => (
                      <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4">
                          <button
                            onClick={() => {
                              setTrackingOrderId(order.orderNumber);
                              setActiveView('track');
                            }}
                            className="font-mono font-black text-red-600 hover:underline block"
                          >
                            {order.orderNumber}
                          </button>
                          <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            order.type === 'custom_request' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {order.type === 'custom_request' ? 'কাস্টম শপিং' : 'স্টোর অর্ডার'}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="font-bold text-slate-900">{order.customer.name}</div>
                          <div className="text-slate-500 font-mono text-[11px]">{order.customer.phone}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                            {order.customer.deliveryAddress}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="font-semibold text-slate-800">
                            {order.restaurantBanglaName || order.restaurantName}
                          </div>
                          <span className="text-[10px] text-slate-400 capitalize">
                            ক্যাটাগরি: {order.storeCategory}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-1.5 font-bold text-slate-900">
                            <Route className="w-3.5 h-3.5 text-blue-600" />
                            <span>{order.distanceKm} কিমি</span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            ফি: {order.deliveryFee}৳
                          </div>
                          <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            order.isDistanceConfirmedByAdmin ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {order.isDistanceConfirmedByAdmin ? 'যাচাইকৃত' : 'ম্যানুয়াল অনুমান'}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="font-black text-slate-900 text-sm">৳{order.total}</div>
                          <span className="text-[10px] text-slate-400 uppercase">
                            {order.paymentMethod}
                          </span>
                        </td>

                        <td className="p-4">
                          <select
                            value={order.status}
                            onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className="text-xs font-bold py-1 px-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
                          >
                            <option value="received">অনুরোধ গৃহীত (Received)</option>
                            <option value="availability_checking">যাচাই চলছে (Checking)</option>
                            <option value="awaiting_approval">অনুমোদন অপেক্ষমাণ (Approval)</option>
                            <option value="confirmed">নিশ্চিত (Confirmed)</option>
                            <option value="preparing">প্রস্তুত হচ্ছে (Preparing)</option>
                            <option value="rider_collecting">সংগৃহীত (Collected)</option>
                            <option value="out_for_delivery">ডেলিভারির পথে (Out)</option>
                            <option value="delivered">ডেলিভারি সম্পন্ন (Delivered)</option>
                            <option value="cancelled">বাতিল (Cancelled)</option>
                          </select>
                        </td>

                        <td className="p-4 space-y-1">
                          <button
                            onClick={() => openQuotationModal(order)}
                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 shadow-xs transition-colors"
                          >
                            <Send className="w-3 h-3" />
                            <span>কোটেশন / দূরত্ব</span>
                          </button>

                          {/* Rider assign dropdown */}
                          <select
                            value={order.riderId || ''}
                            onChange={e => assignRiderToOrder(order.id, e.target.value)}
                            className="text-[10px] font-semibold py-1 px-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 w-full"
                          >
                            <option value="">রাইডার নির্বাচন...</option>
                            {riders.map(r => (
                              <option key={r.id} value={r.id}>
                                {r.name} ({r.zone})
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CUSTOM SHOPPING REQUESTS */}
        {activeTab === 'custom_requests' && (
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-xs text-amber-900">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <strong>কাস্টম শপিং রিকোয়েস্ট ম্যানেজমেন্ট:</strong> কাস্টমার অ্যাপে তালিকাভুক্ত নয় এমন দোকান/বাজারের পণ্যের অনুরোধ পাঠালে শপার দোকানে গিয়ে প্রাপ্যতা ও আসল মূল্য জেনে কাস্টমারকে কোটেশন পাঠাবে।
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customOrders.map(order => (
                <div key={order.id} className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="font-mono font-black text-red-600 text-base">{order.orderNumber}</span>
                      <span className="text-[11px] text-slate-400 block">
                        সময়: {new Date(order.createdAt).toLocaleTimeString()}
                      </span>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      order.status === 'awaiting_approval'
                        ? 'bg-amber-100 text-amber-800 animate-pulse'
                        : order.status === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {order.status === 'awaiting_approval' ? 'কাস্টমার সম্মতির অপেক্ষায়' : order.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">অনুরোধকৃত দোকান/বাজার:</span>
                      <span className="font-bold text-slate-800">{order.restaurantBanglaName || order.restaurantName}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">কাস্টমারের কাঙ্ক্ষিত বাজেট:</span>
                      <span className="font-black text-slate-900">৳{order.subtotal}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">রোড দূরত্ব (কিলোমিটার):</span>
                      <span className="font-bold text-blue-700">~{order.distanceKm} কিমি</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                      <span className="text-[10px] text-slate-400 block font-semibold">কাস্টমারের চাহিদাপত্র / আইটেম:</span>
                      <p className="text-slate-700 font-medium">
                        {order.customRequestDetails?.requestedItems || order.items.map(i => i.banglaName || i.name).join(', ')}
                      </p>
                    </div>

                    {order.customer.instructions && (
                      <div className="text-[11px] text-amber-800 italic">
                        নোট: "{order.customer.instructions}"
                      </div>
                    )}
                  </div>

                  {order.revisedQuotation && (
                    <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs space-y-1">
                      <div className="font-bold text-blue-900">প্রেরিত সংশোধিত কোটেশন:</div>
                      <div className="text-blue-800 text-[11px]">
                        আসল আইটেম খরচ: ৳{order.revisedQuotation.newProductCost} | ডেলিভারি ফি: ৳{order.revisedQuotation.newDeliveryFee} ({order.revisedQuotation.newDistanceKm} কিমি)
                      </div>
                      <div className="font-black text-slate-900">
                        সংশোধিত মোট: ৳{order.revisedQuotation.newTotal}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        কাস্টমার স্ট্যাটাস: {order.revisedQuotation.customerApproved === true ? 'অনুমোদিত ✓' : order.revisedQuotation.customerApproved === false ? 'বাতিল ✗' : 'অপেক্ষমাণ...'}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => openQuotationModal(order)}
                      className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>সংশোধিত কোটেশন ও দূরত্ব নিশ্চিত করুন</span>
                    </button>
                    <button
                      onClick={() => {
                        setTrackingOrderId(order.orderNumber);
                        setActiveView('track');
                      }}
                      className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
                    >
                      ট্র্যাক
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: STORES & CATEGORIES MANAGEMENT */}
        {activeTab === 'stores' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  খুলনার তালিকাভুক্ত স্টোর ও রেস্টুরেন্ট
                </h3>
                <p className="text-xs text-slate-500">
                  রেস্টুরেন্ট, সুপার শপ, কাঁচাবাজার, মাছ-মাংস, ফার্মেসি ইত্যাদি ১০টি ক্যাটাগরির স্টোর।
                </p>
              </div>

              <button
                onClick={() => setIsAddingStore(!isAddingStore)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন স্টোর / শপ যুক্ত করুন</span>
              </button>
            </div>

            {/* Add Store Form Modal / Collapsible */}
            {isAddingStore && (
              <form onSubmit={handleCreateStore} className="bg-white p-6 rounded-3xl border-2 border-red-200 shadow-md space-y-4">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Store className="w-4 h-4 text-red-600" />
                  নতুন শপ / স্টোর তথ্য ফর্ম
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">স্টোরের নাম (বাংলা)</label>
                    <input
                      type="text"
                      required
                      value={newStore.banglaName}
                      onChange={e => setNewStore({ ...newStore, banglaName: e.target.value })}
                      placeholder="উদা: ময়লাপোতা তাজা মাছের আড়ত"
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">স্টোরের নাম (ইংরেজি)</label>
                    <input
                      type="text"
                      required
                      value={newStore.name}
                      onChange={e => setNewStore({ ...newStore, name: e.target.value })}
                      placeholder="উদা: Moylapota Fresh Fish Market"
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">ক্যাটাগরি</label>
                    <select
                      value={newStore.category}
                      onChange={e => setNewStore({ ...newStore, category: e.target.value as StoreCategory })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="restaurant">১. Restaurant Food</option>
                      <option value="grocery">২. Grocery & Daily Essentials</option>
                      <option value="vegetables">৩. Fresh Vegetables</option>
                      <option value="fruits">৪. Fresh Fruits</option>
                      <option value="meat_fish">৫. Fish, Meat & Poultry</option>
                      <option value="spices_oil">৬. Rice, Oil & Spices</option>
                      <option value="bakery_snacks">৭. Bakery & Snacks</option>
                      <option value="personal_care">৮. Personal Care</option>
                      <option value="pharmacy">৯. Pharmacy / Health</option>
                      <option value="custom_shopping">১০. Custom Shopping</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">খুলনার এলাকা (Zone)</label>
                    <input
                      type="text"
                      value={newStore.area}
                      onChange={e => setNewStore({ ...newStore, area: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">সড়ক দূরত্ব (আনুমানিক কিমি)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newStore.approxDistanceKm}
                      onChange={e => setNewStore({ ...newStore, approxDistanceKm: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">বিশেষ আকর্ষণ / বিশেষত্ব</label>
                    <input
                      type="text"
                      value={newStore.popularFor}
                      onChange={e => setNewStore({ ...newStore, popularFor: e.target.value })}
                      placeholder="উদা: তাজা নদীর চিংড়ি ও ইলিশ"
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingStore(false)}
                    className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 text-xs font-bold"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md"
                  >
                    সংরক্ষণ করুন
                  </button>
                </div>
              </form>
            )}

            {/* Store Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {restaurants.map(store => (
                <div key={store.id} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={store.coverImage}
                      alt={store.name}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0"
                    />
                    <div>
                      <h4 className="font-black text-slate-900 text-sm">{store.banglaName || store.name}</h4>
                      <p className="text-[11px] text-slate-500">{store.address}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {store.category}
                        </span>
                        <span className="text-[10px] font-mono text-blue-700 font-bold">
                          ~{store.approxDistanceKm || 3} কিমি
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className={`font-bold text-[11px] ${store.isOpen ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {store.isOpen ? '● বর্তমানে খোলা' : '○ বন্ধ'}
                    </span>
                    <button
                      onClick={() => toggleRestaurantOpenStatus(store.id)}
                      className={`px-3 py-1 rounded-xl font-bold text-[11px] transition-colors ${
                        store.isOpen
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                      }`}
                    >
                      {store.isOpen ? 'বন্ধ করুন' : 'চালু করুন'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: DISTANCE-BASED DELIVERY FEE CONFIGURATION */}
        {activeTab === 'pricing' && (
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-2">
                <Route className="w-3.5 h-3.5" />
                <span>ম্যাপস API বিহীন ম্যানুয়াল দূরত্ব মূল্য নির্ধারণ</span>
              </div>
              <h3 className="text-xl font-black text-slate-900">
                ডেলিভারি ফি ক্যালকুলেটর কনফিগারেশন
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                গুগল ম্যাপস ছাড়া সড়ক দূরত্বের স্বচ্ছ ফর্মুলা: <br />
                <code className="text-red-600 font-bold">
                  Delivery Fee = Base Fee + max(0, Road Distance - Included Distance) × Extra Rate
                </code>
              </p>
            </div>

            {pricingSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>ডেলিভারি ফি কনফিগারেশন সফলভাবে আপডেট করা হয়েছে!</span>
              </div>
            )}

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">
                    বেস ডেলিভারি ফি (Base Fee - ৳)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={configForm.baseFee}
                    onChange={e => setConfigForm({ ...configForm, baseFee: Number(e.target.value) })}
                    className="w-full p-3 rounded-xl border border-slate-200 font-mono font-bold"
                  />
                  <span className="text-[10px] text-slate-400">প্রাথমিক নির্দিষ্ট চার্জ (উদা: ৫০৳)</span>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">
                    বেস ফি-তে অন্তর্ভুক্ত দূরত্ব (Included Distance - KM)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="15"
                    value={configForm.includedDistanceKm}
                    onChange={e => setConfigForm({ ...configForm, includedDistanceKm: Number(e.target.value) })}
                    className="w-full p-3 rounded-xl border border-slate-200 font-mono font-bold"
                  />
                  <span className="text-[10px] text-slate-400">যত কিমি পর্যন্ত অতিরিক্ত চার্জ লাগবে না (উদা: ৩ কিমি)</span>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">
                    প্রতি অতিরিক্ত কিলোমিটার রেট (Extra Rate / KM - ৳)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={configForm.extraRatePerKm}
                    onChange={e => setConfigForm({ ...configForm, extraRatePerKm: Number(e.target.value) })}
                    className="w-full p-3 rounded-xl border border-slate-200 font-mono font-bold"
                  />
                  <span className="text-[10px] text-slate-400">অন্তর্ভুক্ত দূরত্বের পরের প্রতি কিমি চার্জ (উদা: ১৫৳/কিমি)</span>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">
                    সর্বনিম্ন ডেলিভারি ফি (Minimum Delivery Fee - ৳)
                  </label>
                  <input
                    type="number"
                    min="20"
                    max="200"
                    value={configForm.minDeliveryFee}
                    onChange={e => setConfigForm({ ...configForm, minDeliveryFee: Number(e.target.value) })}
                    className="w-full p-3 rounded-xl border border-slate-200 font-mono font-bold"
                  />
                  <span className="text-[10px] text-slate-400">যেকোনো অর্ডারের ন্যূনতম ডেলিভারি চার্জ</span>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-600 font-bold mb-1">
                    শপিং ও কনসিয়ার্জ হ্যান্ডলিং ফি (Handling Fee - ৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={configForm.handlingFee}
                    onChange={e => setConfigForm({ ...configForm, handlingFee: Number(e.target.value) })}
                    className="w-full p-3 rounded-xl border border-slate-200 font-mono font-bold"
                  />
                  <span className="text-[10px] text-slate-400">
                    কাঁচাবাজার/মুদি/কাস্টম কেনাকাটার জন্য শপার হ্যান্ডলিং ফি (উদা: ৩০৳)
                  </span>
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-700 block">লাইভ উদাহরণ হিসাব (Live Formula Simulation):</span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">২ কিমি দূরত্ব</span>
                    <span className="font-bold text-slate-800">
                      ৳{Math.max(configForm.minDeliveryFee, configForm.baseFee)}
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">৫ কিমি দূরত্ব</span>
                    <span className="font-bold text-slate-800">
                      ৳{Math.max(configForm.minDeliveryFee, configForm.baseFee + (5 - configForm.includedDistanceKm) * configForm.extraRatePerKm)}
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">৮ কিমি দূরত্ব</span>
                    <span className="font-bold text-slate-800">
                      ৳{Math.max(configForm.minDeliveryFee, configForm.baseFee + (8 - configForm.includedDistanceKm) * configForm.extraRatePerKm)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-colors"
              >
                ডেলিভারি ফি সেটিংস সেভ করুন
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: RIDERS LIST */}
        {activeTab === 'riders' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {riders.map(rider => (
                <div key={rider.id} className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 font-black text-lg flex items-center justify-center">
                      {rider.name.slice(0, 1)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{rider.name}</h4>
                      <p className="text-xs text-slate-500">{rider.phone}</p>
                      <span className="text-[10px] text-slate-400 block">{rider.vehicle}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-xs flex justify-between items-center text-slate-600">
                    <span>কভার এরিয়া: <strong>{rider.zone}</strong></span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      rider.status === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {rider.status === 'available' ? 'অ্যাভেইলেবল' : 'ব্যস্ত'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REVISED QUOTATION MODAL */}
        {quotationModalOrder && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
                    কাস্টমার অনুমোদন ওয়ার্কফ্লো
                  </span>
                  <h3 className="text-lg font-black text-slate-900">
                    সংশোধিত কোটেশন ও সড়ক দূরত্ব আপডেট
                  </h3>
                </div>
                <span className="font-mono font-bold text-sm text-red-600">
                  {quotationModalOrder.orderNumber}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl text-xs space-y-1">
                <div className="font-semibold text-slate-800">
                  দোকান: {quotationModalOrder.restaurantBanglaName || quotationModalOrder.restaurantName}
                </div>
                <div className="text-slate-500">
                  কাস্টমার: {quotationModalOrder.customer.name} ({quotationModalOrder.customer.deliveryAddress})
                </div>
              </div>

              <form onSubmit={handleSendQuotationSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    দোকানের আসল ক্রয়মূল্য (Revised Product Cost - ৳)
                  </label>
                  <input
                    type="number"
                    required
                    value={revisedProductCost}
                    onChange={e => setRevisedProductCost(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold text-sm"
                  />
                  <span className="text-[10px] text-slate-400">
                    পূর্বের আনুমানিক আইটেম খরচ: ৳{quotationModalOrder.subtotal}
                  </span>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    যাচাইকৃত রোড দূরত্ব (Confirmed Road Distance - KM)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="30"
                    required
                    value={revisedDistanceKm}
                    onChange={e => setRevisedDistanceKm(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold text-sm text-blue-700"
                  />
                  <div className="mt-1 flex justify-between text-[11px] text-blue-800">
                    <span>হিসাবকৃত নতুন ডেলিভারি ফি:</span>
                    <strong className="font-bold">৳{calculateFeeForDistance(revisedDistanceKm).fee}</strong>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    কাস্টমারকে জানানোর কারণ / নোট
                  </label>
                  <textarea
                    rows={2}
                    value={quotationReason}
                    onChange={e => setQuotationReason(e.target.value)}
                    placeholder="উদা: দোকানে গরুর মাংসের কেজি ৭২০৳ এর বদলে ৭৫০৳ হয়েছে..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                {/* Calculation Summary */}
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>নতুন আইটেম মূল্য:</span>
                    <span className="font-mono font-bold">৳{revisedProductCost}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>নতুন ডেলিভারি চার্জ ({revisedDistanceKm} কিমি):</span>
                    <span className="font-mono font-bold">৳{calculateFeeForDistance(revisedDistanceKm).fee}</span>
                  </div>
                  <div className="pt-1 border-t border-amber-200 flex justify-between items-center font-black text-sm text-slate-900">
                    <span>কাস্টমারের সংশোধিত সর্বমোট:</span>
                    <span className="text-red-600 text-base">
                      ৳{revisedProductCost + calculateFeeForDistance(revisedDistanceKm).fee + (quotationModalOrder.handlingFee || 0) + (quotationModalOrder.serviceFee || 15)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setQuotationModalOrder(null)}
                    className="px-4 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100 font-bold text-xs"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>কাস্টমারকে কোটেশন পাঠান</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
