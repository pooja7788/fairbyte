import React, { useState } from "react";
import { 
  ShoppingBag, 
  MapPin, 
  Search, 
  ChevronDown, 
  Sparkles, 
  ShieldCheck, 
  Compass, 
  User, 
  Check, 
  ArrowRight,
  TrendingDown,
  Bell,
  Clock,
  Plus,
  ChefHat,
  UtensilsCrossed
} from "lucide-react";
import { Address, AppView, UserProfile } from "../types";

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onOpenNotifications: () => void;
  onOpenAddAddress: () => void;
  cartCount: number;
  cartTotal: number;
  addresses: Address[];
  selectedAddress: Address | null;
  onSelectAddress: (addr: Address) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  user: UserProfile;
  unreadNotificationsCount: number;
}

export default function Navbar({
  currentView,
  onNavigate,
  onOpenCart,
  onOpenAuth,
  onOpenNotifications,
  onOpenAddAddress,
  cartCount,
  cartTotal,
  addresses,
  selectedAddress,
  onSelectAddress,
  searchQuery,
  onSearchChange,
  user,
  unreadNotificationsCount
}: NavbarProps) {
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const handleDetectLocation = () => {
    setIsDetectingLocation(true);
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsDetectingLocation(false);
          const gpsAddr: Address = {
            id: "addr-gps-" + Date.now(),
            label: "Current Location (GPS)",
            text: `Exact GPS (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}) • Bengaluru`,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            isDefault: true
          };
          onSelectAddress(gpsAddr);
          setShowLocationDropdown(false);
        },
        () => {
          setIsDetectingLocation(false);
          // Graceful fallback to central Bengaluru GPS coordinates
          const fallbackAddr: Address = {
            id: "addr-gps-" + Date.now(),
            label: "Current Location (GPS)",
            text: "Central Bengaluru (12.9716° N, 77.5946° E)",
            lat: 12.9716,
            lng: 77.5946,
            isDefault: true
          };
          onSelectAddress(fallbackAddr);
          setShowLocationDropdown(false);
        },
        { timeout: 4000 }
      );
    } else {
      setIsDetectingLocation(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#fbf9f5]/95 backdrop-blur-md border-b border-[#eae4d7] transition-all shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-2 sm:gap-4 lg:gap-6">
          
          {/* 1. BRAND LOGO & TAGLINE (Pinterest Food Emblem) */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => onNavigate("home")}
              className="cursor-pointer flex items-center gap-3 group text-left"
            >
              {/* Custom Food Logo (Plate & Cloche / Fork & Spoon with Olive Badge) */}
              <div className="w-11 h-11 rounded-full bg-[#2d4023] flex items-center justify-center text-white shadow-md shadow-[#2d4023]/25 group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6 text-[#f3f7ee]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                  <line x1="6" y1="1" x2="6" y2="4" />
                  <line x1="10" y1="1" x2="10" y2="4" />
                  <line x1="14" y1="1" x2="14" y2="4" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-2xl tracking-tight text-[#1c271b] font-sans">
                    Fair<span className="text-[#365029]">Byte</span>
                  </span>
                  <span className="bg-[#e4ede0] text-[#2b3e21] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider border border-[#cfddc7] hidden sm:inline-block">
                    TRANSPARENT
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* 2. LOCATION SELECTOR (Bangalore & GPS Access) */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-[#f6f2e8] border border-[#e4dcce] text-xs font-bold text-[#233120] transition-all shadow-2xs"
            >
              <MapPin className="w-3.5 h-3.5 text-[#375229] shrink-0" />
              <span className="max-w-[130px] truncate text-left font-bold">
                {selectedAddress?.label || "Select Location"}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#85907e]" />
            </button>

            {showLocationDropdown && (
              <div className="absolute left-0 mt-2 w-80 bg-white rounded-3xl border border-[#ded5c5] shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-2">
                
                {/* 1-Click GPS Detect Button */}
                <button
                  onClick={handleDetectLocation}
                  disabled={isDetectingLocation}
                  className="cursor-pointer w-full bg-[#2d4023] hover:bg-[#203018] text-white text-xs font-black p-3 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-[#2d4023]/25 transition-all"
                >
                  <Compass className={`w-4 h-4 text-[#e2edd8] ${isDetectingLocation ? "animate-spin" : ""}`} />
                  <span>{isDetectingLocation ? "Detecting GPS location..." : "📍 Use My Current Location"}</span>
                </button>

                <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#798573] border-b border-[#f0eae0] flex justify-between items-center">
                  <span>SAVED BANGALORE ADDRESSES</span>
                  <button 
                    onClick={() => {
                      setShowLocationDropdown(false);
                      onOpenAddAddress();
                    }}
                    className="cursor-pointer text-[#334d26] hover:underline flex items-center gap-1 font-bold text-[11px]"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ add new</span>
                  </button>
                </div>

                <div className="py-1 space-y-1 max-h-56 overflow-y-auto">
                  {addresses.map((addr) => (
                    <button
                      key={addr.id}
                      onClick={() => {
                        onSelectAddress(addr);
                        setShowLocationDropdown(false);
                      }}
                      className={`cursor-pointer w-full text-left p-2.5 rounded-xl transition-colors flex items-center justify-between text-xs font-medium ${
                        selectedAddress?.id === addr.id
                          ? "bg-[#edf4e8] text-[#22351b] font-bold"
                          : "hover:bg-[#fbf9f4] text-[#2d3a2b]"
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <p className="font-bold text-[#1c271b] truncate">{addr.label}</p>
                        <p className="text-[11px] text-[#717d6d] truncate">{addr.text}</p>
                      </div>
                      {selectedAddress?.id === addr.id && (
                        <Check className="w-4 h-4 text-[#355029] shrink-0 stroke-[3]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. SEARCH BAR */}
          <div className="flex-1 max-w-md hidden lg:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onFocus={() => {
                  if (currentView !== "search") onNavigate("search");
                }}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (currentView !== "search") onNavigate("search");
                }}
                placeholder="Search restaurants, biryani, dosas..."
                className="w-full bg-white border border-[#e4dcce] rounded-full pl-10 pr-4 py-2.5 text-xs font-medium text-[#202e1e] placeholder-[#8e998a] focus:outline-none focus:ring-2 focus:ring-[#375229]/20 focus:border-[#375229] transition-all shadow-2xs"
              />
              <Search className="w-4 h-4 text-[#8a9585] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* 4. NAVIGATION LINKS & ACTIONS (Pinterest Pill Styling) */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Explore Pill Button */}
            <button
              onClick={() => onNavigate("home")}
              className={`cursor-pointer hidden sm:flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-extrabold transition-all ${
                currentView === "home" 
                  ? "bg-[#2d4023] text-white shadow-md shadow-[#2d4023]/25" 
                  : "bg-white hover:bg-[#f6f2e8] border border-[#e4dcce] text-[#2c3d28]"
              }`}
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Explore</span>
            </button>

            {/* Mobile Search Button */}
            <button
              onClick={() => onNavigate("search")}
              className={`cursor-pointer lg:hidden flex items-center justify-center w-10 h-10 rounded-full border border-[#e4dcce] bg-white text-[#2c3d28] hover:bg-[#f6f2e8] transition-colors`}
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Orders Button */}
            <button
              onClick={() => onNavigate("orders")}
              className={`cursor-pointer hidden md:flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
                currentView === "orders" || currentView === "tracking"
                  ? "bg-[#2d4023] text-white shadow-md"
                  : "bg-white hover:bg-[#f6f2e8] border border-[#e4dcce] text-[#334230]"
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-[#6c7967]" />
              <span>Orders</span>
            </button>

            {/* ADMIN / KITCHEN DASHBOARD TRIGGER */}
            <button
              onClick={() => onNavigate("admin")}
              className={`cursor-pointer flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold transition-all border ${
                currentView === "admin"
                  ? "bg-[#2d4023] text-white border-[#2d4023] shadow-md shadow-[#2d4023]/25"
                  : "bg-white hover:bg-[#f6f2e8] text-[#334230] border-[#e4dcce]"
              }`}
              title="Admin & Kitchen Dispatch"
            >
              <ChefHat className="w-3.5 h-3.5 text-[#425d33]" />
              <span className="hidden sm:inline">Admin Panel</span>
            </button>

            {/* NOTIFICATIONS TRIGGER */}
            <button
              onClick={onOpenNotifications}
              className="cursor-pointer relative w-10 h-10 rounded-full border border-[#e4dcce] bg-white hover:bg-[#f6f2e8] flex items-center justify-center text-[#334230] transition-colors shadow-2xs"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#2d4023] text-white rounded-full text-[9px] font-black flex items-center justify-center shadow-xs">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* CART TRIGGER BUTTON (Pinterest Dark Olive Pill) */}
            <button
              onClick={onOpenCart}
              className="cursor-pointer relative bg-[#22351c] hover:bg-[#1a2a15] text-white flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs font-black transition-all shadow-md shadow-[#22351c]/25 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-[#e2edd8]" />
              {cartCount > 0 && (
                <span className="bg-[#e4ede0] text-[#1f3018] font-black px-1.5 py-0.5 rounded-full text-[10px] leading-none">
                  {cartCount}
                </span>
              )}
              {cartTotal > 0 && (
                <span className="font-mono text-[#e2edd8] hidden sm:inline ml-1 font-bold">
                  ₹{cartTotal}
                </span>
              )}
            </button>

            {/* USER PROFILE / AUTH PILL */}
            <button
              onClick={() => {
                if (user.isLoggedIn) {
                  onNavigate("profile");
                } else {
                  onOpenAuth();
                }
              }}
              className="cursor-pointer flex items-center gap-2 pl-1 sm:pl-2 group"
              title={user.isLoggedIn ? user.name : "Sign In"}
            >
              {user.isLoggedIn ? (
                <div className="flex items-center gap-2 bg-white px-2 py-1.5 rounded-full border border-[#e4dcce] hover:bg-[#f6f2e8] transition-colors">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-[#355029]"
                  />
                  <span className="hidden xl:block text-xs font-bold text-[#233120]">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#798573] hidden xl:block" />
                </div>
              ) : (
                <div className="px-4 py-2 rounded-full bg-white text-[#2a3c23] hover:bg-[#f6f2e8] border border-[#e4dcce] text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                  <User className="w-3.5 h-3.5" />
                  <span>Login</span>
                </div>
              )}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
