export interface FoodItem {
  id: string;
  restaurantId: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  category: string;
  isVeg: boolean;
  isAvailable: boolean;
  image: string;
  isPopular?: boolean;
  prepTime?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  cuisine: string[];
  rating: number;
  reviewCount: number;
  deliveryTimeMin: number;
  deliveryFee: number;
  priceRange: "₹" | "₹₹" | "₹₹₹";
  image: string;
  bannerImage: string;
  address: string;
  categories: string[];
  lat: number;
  lng: number;
  featured?: boolean;
  isPureVeg?: boolean;
}

export interface CartItem {
  item: FoodItem;
  restaurantId: string;
  restaurantName: string;
  quantity: number;
}

export interface TraditionalComparison {
  foodPrice: number;
  platformFee: number;
  serviceFee: number;
  deliveryFee: number;
  surgeFee: number;
  traditionalTotal: number;
  fairByteTotal: number;
  savings: number;
}

export interface BillingBreakdown {
  subtotal: number;
  deliveryFee: number;
  platformFee: number; // ₹0 for RestoX
  serviceFee: number;  // ₹0 for RestoX
  cgst: number;
  sgst: number;
  discount: number;
  grandTotal: number;
  distanceKm?: number;
  traditionalComparison?: TraditionalComparison;
}

export interface Address {
  id: string;
  label: string;
  text: string;
  flatBuilding?: string;
  landmark?: string;
  lat: number;
  lng: number;
  isDefault?: boolean;
}

export type OrderStatus =
  | "PLACED"
  | "AUTHORIZED"
  | "CONFIRMED"
  | "ACCEPTED"
  | "PREPARING"
  | "READY_FOR_PICKUP"
  | "RIDER_ASSIGNED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERING"
  | "ARRIVED"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "CANCELLED_REJECTED"
  | "CANCELLED_TIMED_OUT";

export interface DeliveryPartner {
  name: string;
  phone: string;
  photo: string;
  vehicle: string;
  vehicleNumber: string;
  rating: number;
  etaMinutes: number;
  currentLat: number;
  currentLng: number;
}

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  items: CartItem[];
  billing: BillingBreakdown;
  status: OrderStatus;
  address: Address;
  deliveryPartner: DeliveryPartner;
  createdAt: string;
  estimatedDeliveryMin: string;
  paymentMethod: string;
  paymentStatus: "PAID" | "PENDING" | "AUTHORIZED" | "CAPTURED" | "VOIDED";
  paymentIntentId?: string;
  customerPhone?: string;
  elapsedAcceptSeconds?: number;
  orderTimelineStep?: number;
}

export interface Delivery {
  orderId: string;
  uberJobId: string;
  driverName: string;
  driverPhone: string;
  driverLat: number;
  driverLng: number;
  status: "PENDING" | "PICKED_UP" | "ARRIVED" | "DELIVERED";
  trackingUrl: string;
  etaMinutes: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  isLoggedIn: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  read: boolean;
  type: "order" | "offer" | "system";
  orderId?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "pricing" | "delivery" | "restaurant" | "orders" | "refunds";
}

export interface SupportChatMessage {
  id: string;
  sender: "user" | "support";
  text: string;
  timestamp: string;
}

export type AppView =
  | "home"
  | "search"
  | "restaurant"
  | "cart"
  | "checkout"
  | "confirmation"
  | "tracking"
  | "orders"
  | "profile"
  | "addresses"
  | "admin"
  | "help"
  | "about";
