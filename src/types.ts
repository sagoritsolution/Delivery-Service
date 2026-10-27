export type OrderStatus =
  | 'received'                 // Request Received / অর্ডার অনুরোধ গ্রহণ করা হয়েছে
  | 'availability_checking'    // Awaiting Availability Confirmation / প্রাপ্যতা ও দাম যাচাই করা হচ্ছে
  | 'confirming'               // Confirming with Store / রেস্টুরেন্টের সাথে নিশ্চিত করা হচ্ছে
  | 'awaiting_approval'        // Awaiting Customer Approval / গ্রাহকের মূল্য অনুমোদন প্রয়োজন
  | 'confirmed'                // Order Confirmed / অর্ডার নিশ্চিত হয়েছে
  | 'preparing'                // Shopping / Food Preparation in Progress / পণ্য সংগ্রহ বা খাবার প্রস্তুত হচ্ছে
  | 'pickup_completed'         // Pickup Completed / পিকআপ সম্পন্ন
  | 'rider_collecting'         // Rider Collecting / রাইডার সংগ্রহ করছে
  | 'out_for_delivery'         // Out for Delivery / ডেলিভারির পথে
  | 'delivered'                // Delivered / সফলভাবে ডেলিভারি সম্পন্ন
  | 'cancelled';               // Cancelled / বাতিলকৃত

export type StoreCategory =
  | 'restaurant'       // Restaurant Food / রেস্টুরেন্টের খাবার
  | 'grocery'          // Grocery & Daily Essentials / মুদি ও নিত্যপ্রয়োজনীয়
  | 'vegetables'       // Fresh Vegetables / তাজা শাকসবজি ও কাঁচাবাজার
  | 'fruits'           // Fresh Fruits / তাজা ফলমূল
  | 'meat_fish'        // Fish, Meat & Poultry / তাজা মাছ, মাংস ও মুরগি
  | 'rice_oil_spices'  // Rice, Oil, Spices & Household Groceries / চাল, ডাল, তেল ও মশলা
  | 'bakery_snacks'    // Bakery & Snacks / বেকারি, মিষ্টি ও নাস্তা
  | 'personal_care'    // Personal Care & Household / প্রসাধন ও গৃহস্থালি পণ্য
  | 'pharmacy'         // Pharmacy & Health Essentials / ফার্মেসি ও স্বাস্থ্য সুরক্ষা
  | 'custom_shopping'; // Custom Shopping / যেকোনো দোকান থেকে শপিং

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  banglaName: string;
  description: string;
  banglaDescription: string;
  price: number;
  unit?: string; // e.g. "১ কেজি", "১ লিটার", "১ বাটি", "১ পিস"
  image: string;
  category: string;
  isVeg: boolean;
  isPopular?: boolean;
  isAvailable: boolean;
}

export type ProductItem = MenuItem;

export interface Restaurant {
  id: string;
  name: string;
  banglaName: string;
  category: StoreCategory;
  slug: string;
  coverImage: string;
  cuisine: string[];
  banglaCuisine: string[];
  rating: number;
  reviewCount: number;
  address: string;
  banglaAddress: string;
  area: string;
  approxDistanceKm: number; // Estimated road distance from central hubs
  deliveryTime: string;
  deliveryFeeBase: number;
  minOrder: number;
  isOpen: boolean;
  isVerifiedPartner: boolean;
  isChuijhalSpecial?: boolean;
  isFeatured?: boolean;
  phone: string;
  openingHours: string;
  menu: MenuItem[];
}

export type Store = Restaurant;

export interface CartItem {
  item: MenuItem;
  restaurant: {
    id: string;
    name: string;
    banglaName: string;
    area: string;
    category?: StoreCategory;
    address?: string;
    approxDistanceKm?: number;
  };
  quantity: number;
  instructions?: string;
}

export interface RevisedQuotation {
  oldTotal: number;
  newProductCost: number;
  newDistanceKm: number;
  newDeliveryFee: number;
  newTotal: number;
  reason: string;
  customerApproved: boolean | null; // null = pending, true = approved, false = rejected
}

export interface CustomFoodRequestData {
  restaurantName: string;
  restaurantLocation: string;
  requestedItems: string;
  expectedBudget: number;
  confirmedRestaurantPrice?: number;
  photoUrl?: string;
  additionalNotes?: string;
  storeCategory?: StoreCategory;
  estimatedDistanceKm?: number;
  confirmedDistanceKm?: number;
  isDistanceConfirmed?: boolean;
  revisedQuotation?: RevisedQuotation;
}

export interface OrderItem {
  id: string;
  name: string;
  banglaName?: string;
  quantity: number;
  price: number;
  unit?: string;
  instructions?: string;
}

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  type: 'standard' | 'custom_request';
  storeCategory: StoreCategory;
  customer: {
    name: string;
    phone: string;
    deliveryAddress: string;
    deliveryArea: string;
    instructions?: string;
  };
  pickupAddress: string;
  pickupArea: string;
  distanceKm: number;
  isDistanceEstimated: boolean; // clearly indicates manual estimate vs confirmed
  isDistanceConfirmedByAdmin: boolean;
  items: OrderItem[];
  customRequestDetails?: CustomFoodRequestData;
  restaurantId?: string;
  restaurantName: string;
  restaurantBanglaName: string;
  restaurantArea: string;
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  handlingFee: number;
  discount: number;
  total: number;
  paymentMethod: 'cod' | 'bkash' | 'nagad';
  paymentStatus: 'pending' | 'verified';
  status: OrderStatus;
  statusHistory: OrderStatusHistoryItem[];
  createdAt: string;
  estimatedDeliveryTime?: string;
  riderId?: string;
  riderName?: string;
  riderPhone?: string;
  adminNotes?: string;
  revisedQuotation?: RevisedQuotation;
}

export interface DeliveryZone {
  id: string;
  nameBangla: string;
  nameEnglish: string;
  baseDeliveryFee: number;
  estimatedMinutes: string;
  approxDistanceKmFromCenter: number;
}

export interface Rider {
  id: string;
  name: string;
  banglaName: string;
  phone: string;
  zone: string;
  vehicle: string;
  activeOrdersCount: number;
  status: 'available' | 'busy' | 'offline';
  rating: number;
}

export interface DeliveryConfig {
  baseFee: number;                  // e.g. ৳40
  includedDistanceKm: number;       // e.g. 2 km
  extraRatePerKm: number;           // e.g. ৳12/km
  minDeliveryFee: number;           // e.g. ৳40
  serviceFee: number;               // e.g. ৳15 (packaging & safety)
  handlingFee: number;              // e.g. ৳10 (shopping concierge)
  peakHourSurcharge: number;        // e.g. ৳0
  maxServiceDistanceKm: number;     // e.g. 30 km
  zoneFees: Record<string, number>; // fallback zone fees
}

export interface UserAddress {
  id: string;
  label: string;
  address: string;
  area: string;
  isDefault?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  addresses: UserAddress[];
}
