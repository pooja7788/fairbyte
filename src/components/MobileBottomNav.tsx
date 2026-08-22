import React from "react";
import { Compass, Search, Clock, ShoppingBag, User } from "lucide-react";
import { AppView } from "../types";

interface MobileBottomNavProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onOpenCart: () => void;
  cartCount: number;
  hasActiveOrder: boolean;
}

export default function MobileBottomNav({
  currentView,
  onNavigate,
  onOpenCart,
  cartCount,
  hasActiveOrder
}: MobileBottomNavProps) {
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200/80 px-2 py-2 shadow-lg">
      <div className="grid grid-cols-5 items-center text-center">
        
        {/* 1. Home / Explore */}
        <button
          onClick={() => onNavigate("home")}
          className={`cursor-pointer flex flex-col items-center justify-center py-1 gap-1 transition-colors ${
            currentView === "home" ? "text-emerald-700 font-extrabold" : "text-zinc-500 font-medium"
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] leading-none">Home</span>
        </button>

        {/* 2. Search */}
        <button
          onClick={() => onNavigate("search")}
          className={`cursor-pointer flex flex-col items-center justify-center py-1 gap-1 transition-colors ${
            currentView === "search" ? "text-emerald-700 font-extrabold" : "text-zinc-500 font-medium"
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] leading-none">Search</span>
        </button>

        {/* 3. Orders */}
        <button
          onClick={() => onNavigate("orders")}
          className={`cursor-pointer relative flex flex-col items-center justify-center py-1 gap-1 transition-colors ${
            currentView === "orders" || currentView === "tracking"
              ? "text-emerald-700 font-extrabold"
              : "text-zinc-500 font-medium"
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className="text-[10px] leading-none">Orders</span>
          {hasActiveOrder && (
            <span className="absolute top-0 right-3 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          )}
        </button>

        {/* 4. Cart */}
        <button
          onClick={onOpenCart}
          className={`cursor-pointer relative flex flex-col items-center justify-center py-1 gap-1 transition-colors ${
            currentView === "cart" ? "text-emerald-700 font-extrabold" : "text-zinc-500 font-medium"
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] leading-none">Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-1 right-2.5 bg-emerald-600 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>

        {/* 5. Profile */}
        <button
          onClick={() => onNavigate("profile")}
          className={`cursor-pointer flex flex-col items-center justify-center py-1 gap-1 transition-colors ${
            currentView === "profile" || currentView === "help" || currentView === "favorites" || currentView === "addresses"
              ? "text-emerald-700 font-extrabold"
              : "text-zinc-500 font-medium"
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] leading-none">Profile</span>
        </button>

      </div>
    </nav>
  );
}
