import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Restaurant,
  MenuItem,
  CartItem,
  Order,
  OrderStatus,
  DeliveryZone,
  Rider,
  DeliveryConfig,
  UserProfile,
  CustomFoodRequestData,
  StoreCategory,
  RevisedQuotation,
} from '../types';
import {
  KHULNA_ZONES,
  INITIAL_DELIVERY_CONFIG,
  INITIAL_RESTAURANTS,
  INITIAL_RIDERS,
  INITIAL_ORDERS,
  calculateDeliveryFeeFromDistance,
} from '../data/mockData';

interface ConflictModalData {
  isOpen: boolean;
  newItem?: MenuItem;
  newRestaurant?: Restaurant;
  quantity?: number;
  instructions?: string;
}

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error' | 'warning';
  title: string;
  message?: string;
}

interface StoreContextType {
  // Navigation / Views
  activeView: string;
  setActiveView: (view: string) => void;
  selectedRestaurantId: string | null;
  setSelectedRestaurantId: (id: string | null) => void;
  trackingOrderId: string;
  setTrackingOrderId: (id: string) => void;

  // Selected Category filter
  selectedCategoryFilter: StoreCategory | 'all';
  setSelectedCategoryFilter: (cat: StoreCategory | 'all') => void;

  // Delivery Zone & Distance
  selectedZone: DeliveryZone;
  setSelectedZone: (zone: DeliveryZone) => void;
  deliveryZones: DeliveryZone[];
  customerManualDistanceKm: number;
  setCustomerManualDistanceKm: (km: number) => void;

  // Stores & Restaurants
  restaurants: Restaurant[];
  addRestaurant: (res: Restaurant) => void;
  updateRestaurant: (res: Restaurant) => void;
  deleteRestaurant: (id: string) => void;
  toggleRestaurantOpenStatus: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: MenuItem, restaurant: Restaurant, quantity?: number, instructions?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartRestaurant: Restaurant | null;
  cartItemCount: number;
  cartSubtotal: number;
  cartDistanceKm: number;
  cartDeliveryFee: number;
  cartServiceFee: number;
  cartHandlingFee: number;
  cartTotal: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  appliedPromoCode: string;
  promoDiscount: number;
  applyPromoCode: (code: string) => { success: boolean; message: string };

  // Cart Conflict Modal (1 store/restaurant per order constraint)
  conflictModal: ConflictModalData;
  resolveConflictAndAdd: () => void;
  closeConflictModal: () => void;

  // Orders
  orders: Order[];
  placeStandardOrder: (data: {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    deliveryInstructions?: string;
    paymentMethod: 'cod' | 'bkash' | 'nagad';
    customDistanceKm?: number;
  }) => Order;
  submitCustomRequest: (data: {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    restaurantName: string;
    restaurantLocation: string;
    requestedItems: string;
    expectedBudget: number;
    photoUrl?: string;
    additionalNotes?: string;
    storeCategory?: StoreCategory;
    estimatedDistanceKm?: number;
    paymentMethod?: 'cod' | 'bkash' | 'nagad';
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  updateCustomRequestPrice: (orderId: string, confirmedPrice: number, deliveryFee?: number, distanceKm?: number) => void;
  sendRevisedQuotation: (orderId: string, quote: { newProductCost: number; newDistanceKm: number; newDeliveryFee: number; reason: string }) => void;
  customerRespondToQuotation: (orderId: string, approved: boolean) => void;
  assignRiderToOrder: (orderId: string, riderId: string) => void;

  // Delivery Config & Pricing Engine
  deliveryConfig: DeliveryConfig;
  updateDeliveryConfig: (config: DeliveryConfig) => void;
  calculateFeeForDistance: (distanceKm: number) => { fee: number; formulaExplanation: string };

  // Riders
  riders: Rider[];
  addRider: (rider: Rider) => void;
  updateRider: (rider: Rider) => void;

  // Auth / User Profile
  currentUser: UserProfile | null;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (logged: boolean) => void;
  loginUser: (phone: string, name?: string) => void;
  logoutUser: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  addSavedAddress: (address: { label: string; address: string; area: string }) => void;

  // Notification Toast
  toasts: ToastMessage[];
  showToast: (title: string, message?: string, type?: 'success' | 'info' | 'error' | 'warning') => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<string>('home');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string>('KF-QUOT-302');
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<StoreCategory | 'all'>('all');

  // Customer manual estimated distance (default 3.0 km)
  const [customerManualDistanceKm, setCustomerManualDistanceKm] = useState<number>(3.0);

  // Delivery Zone
  const [deliveryZones] = useState<DeliveryZone[]>(KHULNA_ZONES);
  const [selectedZone, setSelectedZoneState] = useState<DeliveryZone>(() => {
    const saved = localStorage.getItem('khulna_selected_zone');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return KHULNA_ZONES[0];
  });

  const setSelectedZone = (zone: DeliveryZone) => {
    setSelectedZoneState(zone);
    localStorage.setItem('khulna_selected_zone', JSON.stringify(zone));
  };

  // Delivery Pricing Config
  const [deliveryConfig, setDeliveryConfigState] = useState<DeliveryConfig>(() => {
    const saved = localStorage.getItem('khulna_delivery_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_DELIVERY_CONFIG;
  });

  const updateDeliveryConfig = (config: DeliveryConfig) => {
    setDeliveryConfigState(config);
    localStorage.setItem('khulna_delivery_config', JSON.stringify(config));
    showToast('ডেলিভারি প্রাইসিং রুলস সংরক্ষিত', `বেস ফি: ${config.baseFee}৳, অতিরিক্ত প্রতি কি.মি.: ${config.extraRatePerKm}৳`, 'success');
  };

  const calculateFeeForDistance = (distanceKm: number) => {
    return calculateDeliveryFeeFromDistance(distanceKm, deliveryConfig);
  };

  // Stores & Restaurants
  const [restaurants, setRestaurants] = useState<Restaurant[]>(() => {
    const saved = localStorage.getItem('khulna_stores_all');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_RESTAURANTS;
  });

  useEffect(() => {
    localStorage.setItem('khulna_stores_all', JSON.stringify(restaurants));
  }, [restaurants]);

  const addRestaurant = (res: Restaurant) => {
    setRestaurants(prev => [res, ...prev]);
    showToast('নতুন স্টোর যুক্ত হয়েছে', res.banglaName, 'success');
  };

  const updateRestaurant = (updated: Restaurant) => {
    setRestaurants(prev => prev.map(r => (r.id === updated.id ? updated : r)));
    showToast('স্টোরের তথ্য আপডেট হয়েছে', updated.banglaName, 'info');
  };

  const deleteRestaurant = (id: string) => {
    setRestaurants(prev => prev.filter(r => r.id !== id));
    showToast('স্টোর মুছে ফেলা হয়েছে', '', 'info');
  };

  const toggleRestaurantOpenStatus = (id: string) => {
    setRestaurants(prev =>
      prev.map(r => (r.id === id ? { ...r, isOpen: !r.isOpen } : r))
    );
  };

  // Riders
  const [riders, setRiders] = useState<Rider[]>(() => {
    const saved = localStorage.getItem('khulna_riders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_RIDERS;
  });

  useEffect(() => {
    localStorage.setItem('khulna_riders', JSON.stringify(riders));
  }, [riders]);

  const addRider = (rider: Rider) => {
    setRiders(prev => [...prev, rider]);
    showToast('নতুন রাইডার যুক্ত হয়েছে', rider.banglaName, 'success');
  };

  const updateRider = (updated: Rider) => {
    setRiders(prev => prev.map(r => (r.id === updated.id ? updated : r)));
  };

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('khulna_orders_all');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('khulna_orders_all', JSON.stringify(orders));
  }, [orders]);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('khulna_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('khulna_cart', JSON.stringify(cart));
  }, [cart]);

  // Promo code
  const [appliedPromoCode, setAppliedPromoCode] = useState<string>('');
  const [promoDiscount, setPromoDiscount] = useState<number>(0);

  // Cart Conflict Modal (1 store restriction)
  const [conflictModal, setConflictModal] = useState<ConflictModalData>({
    isOpen: false,
  });

  const cartRestaurant = cart.length > 0
    ? restaurants.find(r => r.id === cart[0].restaurant.id) || {
        id: cart[0].restaurant.id,
        name: cart[0].restaurant.name,
        banglaName: cart[0].restaurant.banglaName,
        area: cart[0].restaurant.area,
        address: cart[0].restaurant.address,
        approxDistanceKm: cart[0].restaurant.approxDistanceKm || 2.5,
      } as Restaurant
    : null;

  const addToCart = (
    item: MenuItem,
    restaurant: Restaurant,
    quantity = 1,
    instructions?: string
  ) => {
    // Check single store rule
    if (cart.length > 0 && cart[0].restaurant.id !== restaurant.id) {
      setConflictModal({
        isOpen: true,
        newItem: item,
        newRestaurant: restaurant,
        quantity,
        instructions,
      });
      return;
    }

    setCart(prev => {
      const existingIndex = prev.findIndex(ci => ci.item.id === item.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
          instructions: instructions || next[existingIndex].instructions,
        };
        return next;
      } else {
        return [
          ...prev,
          {
            item,
            restaurant: {
              id: restaurant.id,
              name: restaurant.name,
              banglaName: restaurant.banglaName,
              area: restaurant.area,
              category: restaurant.category,
              address: restaurant.address,
              approxDistanceKm: restaurant.approxDistanceKm,
            },
            quantity,
            instructions,
          },
        ];
      }
    });

    showToast('কার্টে যোগ করা হয়েছে!', `${item.banglaName || item.name} কার্টে যোগ হয়েছে।`, 'success');
  };

  const resolveConflictAndAdd = () => {
    if (!conflictModal.newItem || !conflictModal.newRestaurant) return;
    const { newItem, newRestaurant, quantity = 1, instructions } = conflictModal;
    setCart([
      {
        item: newItem,
        restaurant: {
          id: newRestaurant.id,
          name: newRestaurant.name,
          banglaName: newRestaurant.banglaName,
          area: newRestaurant.area,
          category: newRestaurant.category,
          address: newRestaurant.address,
          approxDistanceKm: newRestaurant.approxDistanceKm,
        },
        quantity,
        instructions,
      },
    ]);
    setConflictModal({ isOpen: false });
    showToast(
      'কার্ট পরিবর্তন করা হয়েছে',
      `পূর্বের কার্ট খালি করে ${newRestaurant.banglaName} থেকে পণ্য যোগ করা হলো।`,
      'info'
    );
  };

  const closeConflictModal = () => {
    setConflictModal({ isOpen: false });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(c => c.item.id !== itemId));
    showToast('পণ্য সরানো হয়েছে', '', 'info');
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev =>
      prev.map(c => (c.item.id === itemId ? { ...c, quantity } : c))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromoCode('');
    setPromoDiscount(0);
  };

  // Cart calculations using distance formula
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.item.price * item.quantity,
    0
  );

  // Dynamic distance based on store or customer manual estimate
  const storeDistance = cartRestaurant?.approxDistanceKm || 2.5;
  const cartDistanceKm = Number((storeDistance).toFixed(1));
  const { fee: calculatedDeliveryFee } = calculateFeeForDistance(cartDistanceKm);
  const cartDeliveryFee = cart.length > 0 ? calculatedDeliveryFee : 0;
  const cartServiceFee = cart.length > 0 ? deliveryConfig.serviceFee : 0;
  const isCustomOrGrocery = cartRestaurant?.category !== 'restaurant';
  const cartHandlingFee = isCustomOrGrocery && cart.length > 0 ? deliveryConfig.handlingFee : 0;
  const cartTotal = Math.max(0, cartSubtotal + cartDeliveryFee + cartServiceFee + cartHandlingFee - promoDiscount);

  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'KHULNA50') {
      if (cartSubtotal < 300) {
        return { success: false, message: 'KHULNA50 কোডটি সর্বনিম্ন ৩০০৳ অর্ডারে প্রযোজ্য।' };
      }
      setAppliedPromoCode(clean);
      setPromoDiscount(50);
      showToast('প্রোমোকোড সক্রিয় হয়েছে!', '৫০৳ ডিসকাউন্ট যোগ করা হয়েছে।', 'success');
      return { success: true, message: '৫০৳ ডিসকাউন্ট সফলভাবে প্রয়োগ হয়েছে!' };
    } else if (clean === 'CHUIZHAL') {
      setAppliedPromoCode(clean);
      setPromoDiscount(30);
      showToast('চুইঝাল প্রোমোকোড প্রযোজ্য!', '৩০৳ ছাড় দেওয়া হয়েছে।', 'success');
      return { success: true, message: '৩০৳ ডিসকাউন্ট সফল হয়েছে।' };
    }
    return { success: false, message: 'অকার্যকর প্রোমোকোড! অনুগ্রহ করে KHULNA50 অথবা CHUIZHAL ব্যবহার করুন।' };
  };

  // Auth / User state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('khulna_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      id: 'usr-1',
      name: 'সাকিব আল হাসান',
      phone: '01712-345678',
      email: 'sakib.khulna@gmail.com',
      addresses: [
        {
          id: 'addr-1',
          label: 'বাসা (Home)',
          address: 'বাড়ি #২৪, রোড #৩, নিরালা আবাসিক এলাকা, খুলনা',
          area: 'nirala',
          isDefault: true,
        },
        {
          id: 'addr-2',
          label: 'অফিস (Office)',
          address: '৫ম তলা, জাহান টাওয়ার, শিববাড়ি মোড়, খুলনা',
          area: 'shibbari',
        },
      ],
    };
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('khulna_is_admin') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('khulna_is_admin', isAdminLoggedIn ? 'true' : 'false');
  }, [isAdminLoggedIn]);

  const loginUser = (phone: string, name?: string) => {
    const user: UserProfile = {
      id: 'usr-' + Date.now().toString().slice(-4),
      name: name || 'খুলনা গ্রাহক',
      phone,
      email: `${phone}@khulnafood.express`,
      addresses: [
        {
          id: 'addr-' + Date.now(),
          label: 'আমার বর্তমান ঠিকানা',
          address: `${selectedZone.nameBangla}, খুলনা`,
          area: selectedZone.id,
          isDefault: true,
        },
      ],
    };
    setCurrentUser(user);
    localStorage.setItem('khulna_current_user', JSON.stringify(user));
    showToast('লগইন সফল হয়েছে!', `স্বাগতম ${user.name}`, 'success');
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('khulna_current_user');
    showToast('লগআউট সম্পন্ন হয়েছে', '', 'info');
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...profile };
    setCurrentUser(updated);
    localStorage.setItem('khulna_current_user', JSON.stringify(updated));
    showToast('প্রোফাইল আপডেট হয়েছে', '', 'success');
  };

  const addSavedAddress = (address: { label: string; address: string; area: string }) => {
    if (!currentUser) return;
    const newAddr = {
      id: 'addr-' + Date.now(),
      ...address,
    };
    const updated = {
      ...currentUser,
      addresses: [...currentUser.addresses, newAddr],
    };
    setCurrentUser(updated);
    localStorage.setItem('khulna_current_user', JSON.stringify(updated));
    showToast('নতুন ঠিকানা সংরক্ষিত হয়েছে', '', 'success');
  };

  // Place Standard Store Order
  const placeStandardOrder = (data: {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    deliveryInstructions?: string;
    paymentMethod: 'cod' | 'bkash' | 'nagad';
    customDistanceKm?: number;
  }): Order => {
    const orderNum = `KF-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const effectiveDistance = data.customDistanceKm || cartDistanceKm;
    const { fee: finalDeliveryFee } = calculateFeeForDistance(effectiveDistance);

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber: orderNum,
      type: 'standard',
      storeCategory: cartRestaurant?.category || 'restaurant',
      customer: {
        name: data.customerName,
        phone: data.customerPhone,
        deliveryAddress: data.deliveryAddress,
        deliveryArea: selectedZone.id,
        instructions: data.deliveryInstructions,
      },
      pickupAddress: cartRestaurant?.banglaAddress || `${selectedZone.nameBangla}, খুলনা`,
      pickupArea: cartRestaurant?.area || selectedZone.id,
      distanceKm: effectiveDistance,
      isDistanceEstimated: true, // Clearly indicates estimate until admin review
      isDistanceConfirmedByAdmin: false,
      items: cart.map(c => ({
        id: c.item.id,
        name: c.item.name,
        banglaName: c.item.banglaName,
        quantity: c.quantity,
        price: c.item.price,
        unit: c.item.unit,
        instructions: c.instructions,
      })),
      restaurantId: cartRestaurant?.id || 'res-custom',
      restaurantName: cartRestaurant?.name || 'Local Store',
      restaurantBanglaName: cartRestaurant?.banglaName || 'লোকাল শপ',
      restaurantArea: cartRestaurant?.area || selectedZone.id,
      subtotal: cartSubtotal,
      deliveryFee: finalDeliveryFee,
      serviceFee: cartServiceFee,
      handlingFee: cartHandlingFee,
      discount: promoDiscount,
      total: cartSubtotal + finalDeliveryFee + cartServiceFee + cartHandlingFee - promoDiscount,
      paymentMethod: data.paymentMethod,
      paymentStatus: 'pending',
      status: 'received',
      statusHistory: [
        {
          status: 'received',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: `অর্ডার জমা নেওয়া হয়েছে (দূরত্ব: ${effectiveDistance} কি.মি. আনুমানিক)`,
        },
      ],
      createdAt: new Date().toISOString(),
      estimatedDeliveryTime: `${selectedZone.estimatedMinutes} মিনিট`,
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setTrackingOrderId(newOrder.orderNumber);
    showToast(
      'অর্ডার গ্রহণ করা হয়েছে!',
      `অর্ডার আইডি: ${newOrder.orderNumber}। আনুমানিক ডেলিভারি ফি: ${finalDeliveryFee}৳`,
      'success'
    );
    return newOrder;
  };

  // Submit Custom Shopping Request
  const submitCustomRequest = (data: {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    restaurantName: string;
    restaurantLocation: string;
    requestedItems: string;
    expectedBudget: number;
    photoUrl?: string;
    additionalNotes?: string;
    storeCategory?: StoreCategory;
    estimatedDistanceKm?: number;
    paymentMethod?: 'cod' | 'bkash' | 'nagad';
  }): Order => {
    const reqNum = `KF-REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const dist = data.estimatedDistanceKm || customerManualDistanceKm || 3.5;
    const { fee: calculatedDelivery } = calculateFeeForDistance(dist);

    const newOrder: Order = {
      id: 'req-' + Date.now(),
      orderNumber: reqNum,
      type: 'custom_request',
      storeCategory: data.storeCategory || 'custom_shopping',
      customer: {
        name: data.customerName,
        phone: data.customerPhone,
        deliveryAddress: data.deliveryAddress,
        deliveryArea: selectedZone.id,
        instructions: data.additionalNotes,
      },
      pickupAddress: data.restaurantLocation || 'নির্দিষ্ট দোকানে যাচাই করা হবে',
      pickupArea: selectedZone.id,
      distanceKm: dist,
      isDistanceEstimated: true,
      isDistanceConfirmedByAdmin: false,
      items: [
        {
          id: 'custom-item-1',
          name: data.requestedItems,
          banglaName: data.requestedItems,
          quantity: 1,
          price: data.expectedBudget,
        },
      ],
      customRequestDetails: {
        restaurantName: data.restaurantName,
        restaurantLocation: data.restaurantLocation,
        requestedItems: data.requestedItems,
        expectedBudget: data.expectedBudget,
        photoUrl: data.photoUrl,
        additionalNotes: data.additionalNotes,
        storeCategory: data.storeCategory || 'custom_shopping',
        estimatedDistanceKm: dist,
        isDistanceConfirmed: false,
      },
      restaurantName: data.restaurantName + ' (Custom Request)',
      restaurantBanglaName: data.restaurantName + ' (কাস্টম শপিং)',
      restaurantArea: selectedZone.id,
      subtotal: data.expectedBudget,
      deliveryFee: calculatedDelivery,
      serviceFee: deliveryConfig.serviceFee,
      handlingFee: deliveryConfig.handlingFee,
      discount: 0,
      total: data.expectedBudget + calculatedDelivery + deliveryConfig.serviceFee + deliveryConfig.handlingFee,
      paymentMethod: data.paymentMethod || 'cod',
      paymentStatus: 'pending',
      status: 'received',
      statusHistory: [
        {
          status: 'received',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: 'কাস্টম শপিং অনুরোধ জমা দেওয়া হয়েছে (দোকান ও মূল্য যাচাই প্রক্রিয়াধীন)',
        },
      ],
      createdAt: new Date().toISOString(),
      estimatedDeliveryTime: '৩৫-৬০ মিনিট (দোকান কনফার্মেশনের পর সুনির্দিষ্ট হবে)',
    };

    setOrders(prev => [newOrder, ...prev]);
    setTrackingOrderId(newOrder.orderNumber);
    showToast(
      'কাস্টম শপিং অনুরোধ পাঠানো হয়েছে!',
      `অনুরোধ নম্বর: ${newOrder.orderNumber}। প্রতিনিধি যাচাই করে নিশ্চিত করবেন।`,
      'success'
    );
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId || ord.orderNumber === orderId) {
          return {
            ...ord,
            status,
            statusHistory: [
              ...ord.statusHistory,
              {
                status,
                timestamp: timeStr,
                note: note || `স্ট্যাটাস পরিবর্তন: ${status}`,
              },
            ],
          };
        }
        return ord;
      })
    );
    showToast('অর্ডার স্ট্যাটাস আপডেট হয়েছে', `নতুন অবস্থা: ${status}`, 'info');
  };

  // Admin updates confirmed distance & price
  const updateCustomRequestPrice = (
    orderId: string,
    confirmedPrice: number,
    deliveryFee?: number,
    distanceKm?: number
  ) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId || ord.orderNumber === orderId) {
          const finalDist = distanceKm !== undefined ? distanceKm : ord.distanceKm;
          const { fee: autoFee } = calculateFeeForDistance(finalDist);
          const finalDeliveryFee = deliveryFee !== undefined ? deliveryFee : autoFee;
          const newSubtotal = confirmedPrice;
          const newTotal = newSubtotal + finalDeliveryFee + ord.serviceFee + ord.handlingFee - ord.discount;

          return {
            ...ord,
            subtotal: newSubtotal,
            distanceKm: finalDist,
            isDistanceEstimated: false,
            isDistanceConfirmedByAdmin: true,
            deliveryFee: finalDeliveryFee,
            total: newTotal,
            customRequestDetails: ord.customRequestDetails
              ? {
                  ...ord.customRequestDetails,
                  confirmedRestaurantPrice: confirmedPrice,
                  confirmedDistanceKm: finalDist,
                  isDistanceConfirmed: true,
                }
              : undefined,
            status: 'confirmed',
            statusHistory: [
              ...ord.statusHistory,
              {
                status: 'confirmed',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                note: `অ্যাডমিন কর্তৃক নিশ্চিত মূল্য: ${confirmedPrice}৳, নিশ্চিত দূরত্ব: ${finalDist} কি.মি., ডেলিভারি ফি: ${finalDeliveryFee}৳`,
              },
            ],
          };
        }
        return ord;
      })
    );
    showToast('মূল্য ও দূরত্ব নিশ্চিত হয়েছে', `মোট: ${confirmedPrice}৳ খাবার + দূরত্ব কনফার্ম`, 'success');
  };

  // Admin sends revised quotation when store price or distance changed
  const sendRevisedQuotation = (
    orderId: string,
    quote: {
      newProductCost: number;
      newDistanceKm: number;
      newDeliveryFee: number;
      reason: string;
    }
  ) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId || ord.orderNumber === orderId) {
          const newTotal = quote.newProductCost + quote.newDeliveryFee + ord.serviceFee + ord.handlingFee - ord.discount;
          const revised: RevisedQuotation = {
            oldTotal: ord.total,
            newProductCost: quote.newProductCost,
            newDistanceKm: quote.newDistanceKm,
            newDeliveryFee: quote.newDeliveryFee,
            newTotal,
            reason: quote.reason,
            customerApproved: null,
          };
          return {
            ...ord,
            status: 'awaiting_approval',
            revisedQuotation: revised,
            statusHistory: [
              ...ord.statusHistory,
              {
                status: 'awaiting_approval',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                note: `সংশোধিত কোটেশন পাঠানো হয়েছে (${newTotal}৳): ${quote.reason}`,
              },
            ],
          };
        }
        return ord;
      })
    );
    showToast('সংশোধিত কোটেশন গ্রাহকের অনুমোদনের জন্য পাঠানো হয়েছে', '', 'warning');
  };

  // Customer responds to revised quotation
  const customerRespondToQuotation = (orderId: string, approved: boolean) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId || ord.orderNumber === orderId) {
          if (!ord.revisedQuotation) return ord;
          if (approved) {
            const req = ord.revisedQuotation;
            return {
              ...ord,
              subtotal: req.newProductCost,
              distanceKm: req.newDistanceKm,
              deliveryFee: req.newDeliveryFee,
              total: req.newTotal,
              status: 'confirmed',
              revisedQuotation: { ...req, customerApproved: true },
              statusHistory: [
                ...ord.statusHistory,
                {
                  status: 'confirmed',
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  note: `গ্রাহক সংশোধিত মূল্য (${req.newTotal}৳) অনুমোদন করেছেন`,
                },
              ],
            };
          } else {
            return {
              ...ord,
              status: 'cancelled',
              revisedQuotation: { ...ord.revisedQuotation, customerApproved: false },
              statusHistory: [
                ...ord.statusHistory,
                {
                  status: 'cancelled',
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  note: 'গ্রাহক সংশোধিত কোটেশন প্রত্যাখ্যান করেছেন এবং অর্ডার বাতিল করা হয়েছে',
                },
              ],
            };
          }
        }
        return ord;
      })
    );
    showToast(approved ? 'কোটেশন অনুমোদিত হয়েছে' : 'কোটেশন বাতিল করা হয়েছে', '', approved ? 'success' : 'info');
  };

  const assignRiderToOrder = (orderId: string, riderId: string) => {
    const rider = riders.find(r => r.id === riderId);
    if (!rider) return;

    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId || ord.orderNumber === orderId) {
          return {
            ...ord,
            riderId: rider.id,
            riderName: rider.banglaName || rider.name,
            riderPhone: rider.phone,
            status: ord.status === 'received' || ord.status === 'availability_checking' || ord.status === 'confirming' ? 'confirmed' : ord.status,
            statusHistory: [
              ...ord.statusHistory,
              {
                status: 'rider_collecting',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                note: `রাইডার ${rider.banglaName} কে অ্যাসাইন করা হয়েছে (${rider.phone})`,
              },
            ],
          };
        }
        return ord;
      })
    );

    setRiders(prev =>
      prev.map(r => (r.id === riderId ? { ...r, activeOrdersCount: r.activeOrdersCount + 1, status: 'busy' } : r))
    );

    showToast('রাইডার নিয়োগ দেওয়া হয়েছে', `${rider.banglaName} কে দায়িত্ব দেওয়া হলো`, 'success');
  };

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (
    title: string,
    message?: string,
    type: 'success' | 'info' | 'error' | 'warning' = 'info'
  ) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <StoreContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedRestaurantId,
        setSelectedRestaurantId,
        trackingOrderId,
        setTrackingOrderId,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        selectedZone,
        setSelectedZone,
        deliveryZones,
        customerManualDistanceKm,
        setCustomerManualDistanceKm,
        restaurants,
        addRestaurant,
        updateRestaurant,
        deleteRestaurant,
        toggleRestaurantOpenStatus,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartRestaurant,
        cartItemCount,
        cartSubtotal,
        cartDistanceKm,
        cartDeliveryFee,
        cartServiceFee,
        cartHandlingFee,
        cartTotal,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        appliedPromoCode,
        promoDiscount,
        applyPromoCode,
        conflictModal,
        resolveConflictAndAdd,
        closeConflictModal,
        orders,
        placeStandardOrder,
        submitCustomRequest,
        updateOrderStatus,
        updateCustomRequestPrice,
        sendRevisedQuotation,
        customerRespondToQuotation,
        assignRiderToOrder,
        deliveryConfig,
        updateDeliveryConfig,
        calculateFeeForDistance,
        riders,
        addRider,
        updateRider,
        currentUser,
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        loginUser,
        logoutUser,
        updateUserProfile,
        addSavedAddress,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
