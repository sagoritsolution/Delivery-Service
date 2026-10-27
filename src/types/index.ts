export type OrderStatus =
  | 'received'         // Order Request Received / অর্ডার অনুরোধ গ্রহণ করা হয়েছে
  | 'confirming'       // Confirming With Restaurant / রেস্টুরেন্টের সাথে নিশ্চিত করা হচ্ছে
  | 'confirmed'        // Order Confirmed / অর্ডার নিশ্চিত হয়েছে
  | 'preparing'        // Food Being Prepared / খাবার প্রস্তুত হচ্ছে
  | 'rider_collecting' // Rider Collecting Food / রাইডার খাবার সংগ্রহ করছে
  | 'out_for_delivery' // Out for Delivery / ডেলিভারির পথে
  | 'delivered'        // Delivered / সফলভাবে ডেলিভারি সম্পন্ন
  | 'cancelled';       // Cancelled / বাতিলকৃত

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  banglaName: string;
  description: string;
  banglaDescription: string;
  price: number;
  image: string;
  category: string;
  isVeg: boolean;
  isPopular?: boolean;
  isAvailable: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  banglaName: string;
  slug: string;
  coverImage: string;
  cuisine: string[];
  banglaCuisine: string[];
  rating: number;
  reviewCount: number;
  address: string;
  banglaAddress: string;
  area: string;
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

export interface CartItem {
  item: MenuItem;
  restaurant: {
    id: string;
    name: string;
    banglaName: string;
    area: string;
  };
  quantity: number;
  instructions?: string;
}

export interface CustomFoodRequestData {
  restaurantName: string;
  restaurantLocation: string;
  requestedItems: string;
  expectedBudget: number;
  confirmedRestaurantPrice?: number;
  photoUrl?: string;
  additionalNotes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  type: 'standard' | 'custom_request';
  customer: {
    name: string;
    phone: string;
    deliveryAddress: string;
    deliveryArea: string;
    instructions?: string;
  };
  items: {
    id: string;
    name: string;
    banglaName?: string;
    quantity: number;
    price: number;
    instructions?: string;
  }[];
  customRequestDetails?: CustomFoodRequestData;
  restaurantId?: string;
  restaurantName: string;
  restaurantBanglaName: string;
  restaurantArea: string;
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  discount: number;
  total: number;
  paymentMethod: 'cod' | 'bkash' | 'nagad';
  paymentStatus: 'pending' | 'verified';
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  createdAt: string;
  estimatedDeliveryTime?: string;
  riderId?: string;
  riderName?: string;
  riderPhone?: string;
  adminNotes?: string;
}

export interface DeliveryZone {
  id: string;
  nameBangla: string;
  nameEnglish: string;
  baseDeliveryFee: number;
  estimatedMinutes: string;
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
  baseFee: number;
  serviceFee: number;
  minOrder: number;
  zoneFees: Record<string, number>;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  addresses: {
    id: string;
    label: string;
    address: string;
    area: string;
    isDefault?: boolean;
  }[];
}
