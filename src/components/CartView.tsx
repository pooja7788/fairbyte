import React from "react";
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft,
  Sparkles, 
  ShieldCheck, 
  TrendingDown, 
  Bike, 
  Receipt,
  UtensilsCrossed
} from "lucide-react";
import { CartItem, BillingBreakdown, FoodItem } from "../types";

interface CartViewProps {
  items: CartItem[];
  billing: BillingBreakdown | null;
  onIncrement: (item: FoodItem) => void;
  onDecrement: (item: FoodItem) => void;
  onClear: () => void;
  onProceed: () => void;
  onBackToShopping: () => void;
}

export default function CartView({
  items,
  billing,
  onIncrement,
  onDecrement,
  onClear,
  onProceed,
  onBackToShopping
}: CartViewProps) {
  const totalItemCount = items.reduce((acc, match) => acc + match.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-5">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto border border-emerald-100 shadow-sm">
          <ShoppingCart className="w-9 h-9" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-zinc-950 font-sans">Your cart is empty</h2>
          <p className="text-sm text-zinc-500 max-w-sm mx-auto">
            Add something delicious from our partner restaurants to experience transparent pricing.
          </p>
        </div>
        <button
          onClick={onBackToShopping}
          className="cursor-pointer inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-black px-6 py-3 rounded-2xl text-sm shadow-md transition-all active:scale-95"
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Explore Restaurants</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToShopping}
          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white hover:bg-zinc-100 border border-zinc-200 text-xs font-bold text-zinc-800 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 font-bold">
            {totalItemCount} {totalItemCount === 1 ? "item" : "items"} in cart
          </span>
          <button
            onClick={onClear}
            className="cursor-pointer text-red-600 hover:text-red-700 text-xs font-bold flex items-center gap-1 border border-red-200 bg-red-50 px-3 py-1.5 rounded-xl"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Items & Comparison */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Order Items List */}
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-sm space-y-4">
            <h3 className="font-black text-base text-zinc-950 font-sans border-b border-zinc-100 pb-3">
              Your RestoX Order
            </h3>

            <div className="divide-y divide-zinc-100">
              {items.map(({ item, quantity, restaurantName }) => (
                <div key={item.id} className="py-4 flex gap-4 items-center justify-between">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-14 h-14 rounded-2xl object-cover border border-zinc-200/60 shrink-0"
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            item.isVeg ? "bg-emerald-500" : "bg-red-500"
                          }`}
                        />
                        <h4 className="font-extrabold text-xs sm:text-sm text-zinc-900 truncate max-w-[200px]">
                          {item.title}
                        </h4>
                      </div>
                      
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                        {restaurantName}
                      </p>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs sm:text-sm font-black text-zinc-950 font-sans">
                          ₹{item.price * quantity}
                        </span>
                        <span className="text-[11px] text-zinc-400">
                          (₹{item.price} each)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="bg-zinc-50 border border-zinc-200 rounded-xl flex items-center p-1 font-mono shrink-0 shadow-2xs">
                    <button
                      onClick={() => onDecrement(item)}
                      className="cursor-pointer p-1.5 text-zinc-600 hover:text-zinc-950 rounded-lg hover:bg-white transition-all active:scale-95"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-black text-zinc-900 px-2.5 leading-none">
                      {quantity}
                    </span>
                    <button
                      onClick={() => onIncrement(item)}
                      className="cursor-pointer p-1.5 text-zinc-600 hover:text-zinc-950 rounded-lg hover:bg-white transition-all active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAIRBYTE TRANSPARENT PRICE COMPARISON */}
          {billing?.traditionalComparison && (
            <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950 text-white rounded-3xl p-6 border border-emerald-500/30 shadow-xl space-y-5">
              
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-6 h-6 text-emerald-400" />
                  <div>
                    <h3 className="text-base font-black text-white font-sans tracking-tight">
                      See the difference
                    </h3>
                    <span className="text-[11px] text-zinc-400 font-medium">
                      Illustrative comparison
                    </span>
                  </div>
                </div>

                <div className="bg-emerald-500 text-zinc-950 text-xs font-black px-3 py-1.5 rounded-xl shadow-xs">
                  Save ₹{billing.traditionalComparison.savings}
                </div>
              </div>

              {/* Side-by-Side Comparison Box */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                
                {/* Traditional Side */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2.5">
                  <span className="text-xs font-bold text-zinc-400 block uppercase tracking-wider">
                    Traditional App
                  </span>
                  <div className="space-y-1 text-zinc-300 text-xs">
                    <div className="flex justify-between">
                      <span>Food:</span>
                      <span className="font-mono">₹{billing.traditionalComparison.foodPrice}</span>
                    </div>
                    <div className="flex justify-between text-red-300">
                      <span>Additional charges:</span>
                      <span className="font-mono">+₹{billing.traditionalComparison.traditionalTotal - billing.traditionalComparison.foodPrice}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-zinc-200 text-sm">
                    <span>Total:</span>
                    <span className="font-mono text-red-400 line-through">
                      ₹{billing.traditionalComparison.traditionalTotal}
                    </span>
                  </div>
                </div>

                {/* RestoX Side */}
                <div className="bg-emerald-900/40 border border-emerald-500/40 rounded-2xl p-4 space-y-2.5 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-300 uppercase tracking-wider">
                      RestoX
                    </span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="space-y-1 text-zinc-200 text-xs">
                    <div className="flex justify-between">
                      <span>Food:</span>
                      <span className="font-mono">₹{billing.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery:</span>
                      <span className="font-mono">₹{billing.deliveryFee}</span>
                    </div>
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Platform fee:</span>
                      <span className="font-mono">₹0</span>
                    </div>
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Service fee:</span>
                      <span className="font-mono">₹0</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-emerald-500/30 flex justify-between font-black text-emerald-300 text-base">
                    <span>Total:</span>
                    <span className="font-mono text-emerald-400">
                      ₹{billing.grandTotal}
                    </span>
                  </div>
                </div>

              </div>

              {/* Tag Message */}
              <div className="bg-black/40 p-4 rounded-2xl border border-white/5 space-y-1">
                <p className="font-black text-sm text-emerald-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>"You see exactly what you're paying for."</span>
                </p>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Restaurant menu price + transparent delivery. No surprise platform charges in this demo.
                </p>
              </div>

            </div>
          )}

          {/* 3 Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white border border-zinc-200 p-4 rounded-2xl space-y-1">
              <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center">1</span>
              <h4 className="font-bold text-xs text-zinc-950">Restaurant Menu Price</h4>
              <p className="text-[11px] text-zinc-500">The food price shown comes directly from the restaurant's menu.</p>
            </div>
            <div className="bg-white border border-zinc-200 p-4 rounded-2xl space-y-1">
              <span className="w-6 h-6 rounded-lg bg-teal-50 text-teal-800 font-bold text-xs flex items-center justify-center">2</span>
              <h4 className="font-bold text-xs text-zinc-950">Transparent Delivery</h4>
              <p className="text-[11px] text-zinc-500">The delivery cost is shown separately before checkout.</p>
            </div>
            <div className="bg-white border border-zinc-200 p-4 rounded-2xl space-y-1">
              <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-800 font-bold text-xs flex items-center justify-center">3</span>
              <h4 className="font-bold text-xs text-zinc-950">Clear Final Price</h4>
              <p className="text-[11px] text-zinc-500">Customers see the complete price before placing the order.</p>
            </div>
          </div>

        </div>

        {/* Right Column: Billing Summary & Promo */}
        <div className="lg:col-span-5 space-y-6">

          {/* Billing Card */}
          {billing && (
            <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-sm space-y-5">
              <h3 className="font-black text-base text-zinc-950 font-sans border-b border-zinc-100 pb-3">
                Bill Summary
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-zinc-700">
                  <span>Food subtotal</span>
                  <span className="font-bold text-zinc-950 font-mono">₹{billing.subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center text-zinc-700">
                  <span>CGST (2.5%)</span>
                  <span className="font-bold text-zinc-950 font-mono">₹{billing.cgst.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center text-zinc-700">
                  <span>SGST (2.5%)</span>
                  <span className="font-bold text-zinc-950 font-mono">₹{billing.sgst.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center text-emerald-700">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Platform fee</span>
                  </span>
                  <span className="font-bold font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px]">
                    ₹0.00
                  </span>
                </div>

                <div className="flex justify-between items-center text-zinc-700">
                  <span className="flex items-center gap-1.5">
                    <Bike className="w-3.5 h-3.5 text-[#365229]" />
                    <span>Delivery {billing.distanceKm ? `(${billing.distanceKm} km @ ₹7/km)` : ""}</span>
                  </span>
                  <span className="font-bold text-zinc-950 font-mono">
                    {billing.deliveryFee === 0 ? "FREE" : `₹${billing.deliveryFee.toFixed(2)}`}
                  </span>
                </div>

                <div className="border-t-2 border-zinc-200 pt-4 flex justify-between items-center">
                  <div>
                    <span className="font-extrabold text-zinc-950 text-base block">Total</span>
                    <span className="text-[11px] text-zinc-400">Guaranteed final amount</span>
                  </div>
                  <span className="font-black text-3xl text-emerald-700 font-sans">
                    ₹{billing.grandTotal.toFixed(2)}
                  </span>
                </div>

                {/* Transparency Reassurance */}
                <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3 text-center mt-2">
                  <p className="text-xs text-emerald-900 font-bold">
                    No platform fee. You see the complete price before ordering.
                  </p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Restaurant menu price + transparent GST + delivery
                  </p>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={onProceed}
                className="cursor-pointer w-full bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-black py-4 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 active:scale-98 text-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
