import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'bn' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  bn: {
    // Header & Nav
    brandName: 'খুলনা ফুড এক্সপ্রেস',
    brandTagline: 'খুলনার যেকোনো রেস্টুরেন্টের খাবার এখন আপনার বাসায়!',
    navHome: 'হোম',
    navRestaurants: 'রেস্টুরেন্টসমূহ',
    navCustomOrder: 'যেকোনো রেস্টুরেন্ট অর্ডার',
    navHowItWorks: 'কীভাবে কাজ করে',
    navTrackOrder: 'অর্ডার ট্র্যাক',
    navContact: 'যোগাযোগ',
    navAdmin: 'অ্যাডমিন পোর্টাল',
    navLogin: 'লগইন / রেজিস্টার',
    navAccount: 'আমার প্রোফাইল',
    selectLocation: 'ডেলিভারি লোকেশন',
    allKhulna: 'সমগ্র খুলনা সিটি',
    cart: 'কার্ট',
    searchPlaceholder: 'রেস্টুরেন্ট, বিরিয়ানি, চুইঝাল বা খাবারের নাম খুঁজুন...',

    // Hero Section
    heroTitle: 'খুলনায় আপনার প্রয়োজনীয় সবকিছু, এখন ঘরে বসেই!',
    heroSubtitle: 'রেস্টুরেন্টের খাবার, কাঁচাবাজার, মুদি পণ্য কিংবা দৈনন্দিন প্রয়োজনীয় জিনিস—অর্ডার করুন, আমরা পৌঁছে দেব আপনার ঠিকানায়।',
    heroCtaOrderNow: 'আপনার প্রয়োজনীয় পণ্য অর্ডার করুন',
    heroCtaFindRestaurant: 'দোকান ও রেস্টুরেন্ট খুঁজুন',
    heroCtaCustomOrder: 'কাস্টম শপিং রিকোয়েস্ট দিন',
    heroEnterAddress: 'আপনার ডেলিভারি ঠিকানা দিন...',
    heroSpecialBadge: 'খুলনার অল-ইন-ওয়ান লোকাল ডেলিভারি সার্ভিস',

    // Special Feature: Custom Request
    customOrderTitle: 'পছন্দের দোকান বা পণ্য খুঁজে পাচ্ছেন না?',
    customOrderSubtitle: 'খুলনার যেকোনো বাজার, কাঁচা আড়ৎ, গলির মুদি দোকান কিংবা রেস্টুরেন্ট—নাম লিখুন, আমরা সংগ্রহ করে এনে দেব!',
    customOrderButton: 'কাস্টম শপিং রিকোয়েস্ট দিন',
    customOrderDisclaimer: 'আপনার পছন্দের দোকান বা পণ্য তালিকায় না থাকলেও অনুরোধ পাঠাতে পারবেন। আমাদের টিম প্রাপ্যতা, আসল মূল্য এবং দূরত্ব অনুযায়ী ডেলিভারি চার্জ যাচাই করে আপনাকে জানাবে।',

    // Trust & Benefits
    trust1Title: 'যেকোনো দোকান থেকে ডেলিভারি',
    trust1Desc: 'রেস্টুরেন্ট, কাঁচাবাজার, সুপারশপ কিংবা ফার্মেসি—খুলনার যেকোনো প্রান্তের পণ্য সরাসরি আপনার ঠিকানায়।',
    trust2Title: 'আসল মূল্য ও দূরত্ব যাচাই',
    trust2Desc: 'দোকানের আসল ভাউচার এবং প্রকৃত সড়ক দূরত্বের ভিত্তিতে ডেলিভারি চার্জ নিশ্চিত করা হয়।',
    trust3Title: 'স্বচ্ছ কিলোমিটার ভিত্তিক ফি',
    trust3Desc: 'দূরত্ব অনুযায়ী ফেয়ার রেট। কোনো গোপন কমিশন বা পণ্যের বাড়তি দাম নেওয়া হয় না।',
    trust4Title: 'গ্রাহক অনুমোদন ছাড়া ক্রয় নয়',
    trust4Desc: 'মূল্য বা দূরত্বে পরিবর্তন হলে গ্রাহকের চূড়ান্ত অনুমোদনের পরেই কেনাকাটা সম্পন্ন করা হয়।',

    // Status Timeline Steps
    status_received: 'অর্ডার অনুরোধ গ্রহণ করা হয়েছে',
    status_availability_checking: 'প্রাপ্যতা ও দাম যাচাই করা হচ্ছে',
    status_confirming: 'দোকানের সাথে নিশ্চিত করা হচ্ছে',
    status_awaiting_approval: 'গ্রাহকের মূল্য অনুমোদন প্রয়োজন',
    status_confirmed: 'অর্ডার নিশ্চিত হয়েছে',
    status_preparing: 'পণ্য সংগ্রহ বা খাবার প্রস্তুত হচ্ছে',
    status_pickup_completed: 'পিকআপ সম্পন্ন / রাইডার সংগ্রহ করেছে',
    status_rider_collecting: 'রাইডার পণ্য সংগ্রহ করছে',
    status_out_for_delivery: 'ডেলিভারির পথে',
    status_delivered: 'সফলভাবে ডেলিভারি সম্পন্ন',
    status_cancelled: 'অর্ডার বাতিল করা হয়েছে',

    // Restaurant Card & Details
    viewMenu: 'মেনু দেখুন',
    orderFromHere: 'অর্ডার করুন',
    approxDelivery: 'আনুমানিক',
    minOrder: 'সর্বনিম্ন অর্ডার',
    deliveryFee: 'ডেলিভারি চার্জ',
    openNow: 'খোলা আছে',
    closedNow: 'আপাতত বন্ধ',
    independentService: 'ইন্ডিপেন্ডেন্ট পিকআপ সার্ভিস',
    verifiedPartner: 'ভেরিফায়েড পার্টনার',
    demoNotice: 'ডেমো রেস্টুরেন্ট ডাটা - বাস্তব ব্যবসায় সকল আসল রেস্টুরেন্টের নাম থাকবে',

    // Cart & Checkout
    myCart: 'আমার কার্ট',
    singleRestaurantNotice: 'একটি অর্ডারে শুধুমাত্র একটি রেস্টুরেন্ট থেকে খাবার নেওয়া যাবে।',
    subtotal: 'খাবারের মোট মূল্য',
    serviceFee: 'সার্ভিস ও প্যাকেজিং চার্জ',
    discount: 'ডিসকাউন্ট',
    totalPayable: 'সর্বমোট প্রদেয় টাকা',
    proceedToCheckout: 'চেকআউটে যান',
    checkoutTitle: 'ডেলিভারি ঠিকানা ও পেমেন্ট',
    customerName: 'আপনার নাম',
    customerPhone: 'মোবাইল নম্বর (+৮৮০)',
    deliveryAddress: 'পূর্ণাঙ্গ ডেলিভারি ঠিকানা',
    deliveryInstructions: 'ডেলিভারি নোট বা স্পেশাল নির্দেশিকা (ঐচ্ছিক)',
    paymentMethod: 'পেমেন্ট পদ্ধতি',
    cod: 'ক্যাশ অন ডেলিভারি (Cash on Delivery)',
    bkash: 'বিকাশ (bKash)',
    nagad: 'নগদ (Nagad)',
    confirmOrderButton: 'অর্ডার কনফার্ম করুন',
    orderSuccessTitle: 'আপনার অর্ডার সফলভাবে গৃহীত হয়েছে!',

    // Tracking
    trackOrderTitle: 'লাইভ অর্ডার ট্র্যাকিং',
    enterOrderId: 'অর্ডার আইডি লিখুন (উদা: KF-2026-101 বা KF-REQ-904)',
    trackButton: 'ট্র্যাক করুন',
    riderAssigned: 'নিযুক্ত রাইডার',
    callRider: 'রাইডারকে কল করুন',
    whatsappSupport: 'হোয়াটসঅ্যাপে যোগাযোগ',
  },
  en: {
    // Header & Nav
    brandName: 'Khulna Food Express',
    brandTagline: 'Food from ANY Khulna restaurant, now at your doorstep!',
    navHome: 'Home',
    navRestaurants: 'Restaurants',
    navCustomOrder: 'Order Any Restaurant',
    navHowItWorks: 'How It Works',
    navTrackOrder: 'Track Order',
    navContact: 'Contact',
    navAdmin: 'Admin Portal',
    navLogin: 'Login / Register',
    navAccount: 'My Profile',
    selectLocation: 'Delivery Location',
    allKhulna: 'All Khulna City',
    cart: 'Cart',
    searchPlaceholder: 'Search restaurants, biryani, chuijhal, or dishes...',

    // Hero Section
    heroTitle: 'Food from ANY Khulna restaurant, delivered to your door!',
    heroSubtitle: 'No hassle of calling crowded restaurants. Tell us the food you crave, and our riders will collect and deliver it to your home.',
    heroCtaOrderNow: 'Order Food Now',
    heroCtaFindRestaurant: 'Find Restaurants',
    heroCtaCustomOrder: 'Request Any Unlisted Restaurant',
    heroEnterAddress: 'Enter your delivery address...',
    heroSpecialBadge: 'Not on Foodpanda or Foodi? No problem!',

    // Special Feature: Custom Request
    customOrderTitle: "Can't find your favorite restaurant?",
    customOrderSubtitle: "Whether it's a neighborhood biryani stall or famous Chuknagar Chuijhal—write the name, and we'll fetch it!",
    customOrderButton: 'Place Custom Order',
    customOrderDisclaimer: 'Even if your restaurant is not listed on our platform, you can submit an order request. Our team will verify restaurant availability, actual food prices, and delivery charges before purchase.',

    // Trust & Benefits
    trust1Title: 'Delivery from ANY Restaurant',
    trust1Desc: 'Not limited to partner apps. We pick up from any eatery, street stall, or hotel in Khulna.',
    trust2Title: 'Pre-Purchase Price Confirmation',
    trust2Desc: 'We confirm actual kitchen price and availability before purchasing your food.',
    trust3Title: 'Transparent Delivery Rates',
    trust3Desc: 'Honest distance-based delivery fees without hidden markups or inflated prices.',
    trust4Title: 'Direct Support & Tracking',
    trust4Desc: 'Instant phone and WhatsApp direct contact with your dedicated delivery rider.',

    // Status Timeline Steps
    status_received: 'Order Request Received',
    status_confirming: 'Confirming With Restaurant',
    status_confirmed: 'Order Confirmed',
    status_preparing: 'Food Being Prepared',
    status_rider_collecting: 'Rider Collecting Food',
    status_out_for_delivery: 'Out for Delivery',
    status_delivered: 'Delivered',
    status_cancelled: 'Order Cancelled',

    // Restaurant Card & Details
    viewMenu: 'View Menu',
    orderFromHere: 'Order Now',
    approxDelivery: 'Estimated',
    minOrder: 'Min Order',
    deliveryFee: 'Delivery Fee',
    openNow: 'Open Now',
    closedNow: 'Closed',
    independentService: 'Independent Pickup Service',
    verifiedPartner: 'Verified Partner',
    demoNotice: 'Demo Restaurant Data - In production, real restaurants will be displayed',

    // Cart & Checkout
    myCart: 'My Cart',
    singleRestaurantNotice: 'Each order can only contain food from a single restaurant.',
    subtotal: 'Item Subtotal',
    serviceFee: 'Service & Packaging Fee',
    discount: 'Discount',
    totalPayable: 'Total Payable Amount',
    proceedToCheckout: 'Proceed to Checkout',
    checkoutTitle: 'Delivery Address & Payment',
    customerName: 'Your Name',
    customerPhone: 'Mobile Number (+880)',
    deliveryAddress: 'Full Delivery Address',
    deliveryInstructions: 'Delivery Instructions (Optional)',
    paymentMethod: 'Payment Method',
    cod: 'Cash on Delivery (COD)',
    bkash: 'bKash',
    nagad: 'Nagad',
    confirmOrderButton: 'Confirm Order',
    orderSuccessTitle: 'Your order has been received!',

    // Tracking
    trackOrderTitle: 'Live Order Tracking',
    enterOrderId: 'Enter Order ID (e.g., KF-2026-101 or KF-REQ-904)',
    trackButton: 'Track',
    riderAssigned: 'Assigned Rider',
    callRider: 'Call Rider',
    whatsappSupport: 'WhatsApp Support',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('khulna_food_lang');
    return (saved as Language) || 'bn'; // Bengali primary by default as required
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('khulna_food_lang', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['bn']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
