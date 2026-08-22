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
  TrendingDown
} from "lucide-react";
import { Address } from "../types";

interface NavbarProps {
  currentView: "home" | "restaurant" | "checkout" | "confirmation" | "tracking";
  onNavigateHome: () => void;
  onNavigateHowItWorks: () => void;
  onNavigateComparison: () => void;
  onOpenCart: () => void;
  cartCount: number;
  cartTotal: number;
  addresses: Address[];
  selectedAddress: Address | null;
  onSelectAddress: (addr: Address) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function Navbar({
  currentView,
  onNavigateHome,
  onNavigateHowItWorks,
  onNavigateComparison,
  onOpenCart,
  cartCount,
  cartTotal,
  addresses,
  selectedAddress,
  onSelectAddress,
  searchQuery,
  onSearchChange
}: NavbarProps) {
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-200/80 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-3 sm:gap-6">
          
          {/* 1. BRAND LOGO & TAGLINE */}
          <div className="flex items-center gap-4 shrink-0">
            <button 
              onClick={onNavigateHome}
              className="cursor-pointer flex items-center gap-2.5 group text-left"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white font-black text-xl shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
                F
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-zinc-950 font-sans">
                    Fair<span className="text-emerald-600">Byte</span>
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider border border-emerald-300/40">
                    Transparent
                  </span>
                </div>
                <p className="hidden sm:block text-[10px] text-zinc-500 font-medium tracking-tight">
                  Your food. The restaurant's price. Fair delivery.
                </p>
              </div>
            </button>
          </div>

          {/* 2. LOCATION SELECTOR */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              className="cursor-pointer flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/70 text-xs font-semibold text-zinc-800 transition-all"
            >
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="max-w-[140px] truncate text-left">
                {selectedAddress?.label || "Select Location"}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {showLocationDropdown && (
              <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl border border-zinc-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-100">
                  Deliver to Bengaluru Locale
                </div>
                <div className="py-1 space-y-1">
                  {addresses.map((addr) => (
                    <button
                      key={addr.id}
                      onClick={() => {
                        onSelectAddress(addr);
                        setShowLocationDropdown(false);
                      }}
                      className="cursor-pointer w-full text-left p-2.5 rounded-xl hover:bg-emerald-50/70 transition-colors flex items-center justify-between text-xs font-medium text-zinc-800"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="font-bold text-zinc-900 truncate">{addr.label}</p>
                        <p className="text-[11px] text-zinc-500 truncate">{addr.text}</p>
                      </div>
                      {selectedAddress?.id === addr.id && (
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
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
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search restaurants, biryani, butter chicken, dosas..."
                className="w-full bg-zinc-50 border border-zinc-200/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-medium text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* 4. NAVIGATION LINKS & ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Links */}
            <button
              onClick={onNavigateHome}
              className={`cursor-pointer hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                currentView === "home" 
                  ? "text-emerald-700 bg-emerald-50" 
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
              }`}
            >
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>Explore</span>
            </button>

            <button
              onClick={onNavigateComparison}
              className="cursor-pointer hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
            >
              <TrendingDown className="w-4 h-4 text-amber-500" />
              <span>Price Compare</span>
            </button>

            <button
              onClick={onNavigateHowItWorks}
              className="cursor-pointer hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>How It Works</span>
            </button>

            {/* CART TRIGGER BUTTON */}
            <button
              onClick={onOpenCart}
              className="cursor-pointer relative bg-zinc-950 hover:bg-zinc-800 text-white flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md shadow-zinc-950/15 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="bg-emerald-500 text-zinc-950 font-black px-2 py-0.5 rounded-full text-[10px] leading-none">
                  {cartCount}
                </span>
              )}
              {cartTotal > 0 && (
                <span className="border-l border-zinc-700 pl-2 text-emerald-300 font-mono">
                  ₹{cartTotal}
                </span>
              )}
            </button>

            {/* USER PILL */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-zinc-200">
              <div className="w-9 h-9 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700">
                <User className="w-4 h-4" />
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
