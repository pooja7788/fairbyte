import React from "react";
import { motion } from "motion/react";
import { 
  ShoppingCart, 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  TrendingDown, 
  Bike,
  CheckCircle2, 
  Receipt,
  Utensils,
  Eye,
  AlertCircle
} from "lucide-react";
import { CartItem, BillingBreakdown, FoodItem } from "../types";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  billing: BillingBreakdown | null;
  onIncrement: (item: FoodItem) => void;
  onDecrement: (item: FoodItem) => void;
  onClear: () => void;
  onProceed: () => void;
}

export default function CartSidebar({
  isOpen,
  onClose,
  items,
  billing,
  onIncrement,
  onDecrement,
  onClear,
  onProceed
}: CartSidebarProps) {
  if (!isOpen) return null;

  const totalItemCount = items.reduce((acc, match) => acc + match.quantity, 0);

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Main Drawer container */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white border-l border-zinc-200 shadow-2xl z-50 flex flex-col h-full overflow-hidden"
      >
        {/* Header section */}
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-zinc-950 tracking-tight text-base font-sans">
                Your RestoX Order
              </h3>
              <p className="text-[10px] text-zinc-500 font-medium">
                Direct restaurant pricing • Transparent delivery
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-0.5 rounded-full">
              {totalItemCount} {totalItemCount === 1 ? "item" : "items"}
            </span>
            <button
              onClick={onClose}
              className="cursor-pointer p-1.5 hover:bg-zinc-200/60 rounded-full text-zinc-400 hover:text-zinc-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-grow overflow-y-auto p-5 space-y-6">
          {items.length === 0 ? (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4 px-4">
              <div className="w-18 h-18 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 border border-emerald-100">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="font-extrabold text-zinc-900 text-base">Your cart is empty</p>
                <p className="text-xs text-zinc-500 max-w-xs">
                  Add something delicious from our partner kitchens to get started.
                </p>
              </div>
              <button
                onClick={onClose}
                className="cursor-pointer bg-emerald-600 text-zinc-950 font-bold px-5 py-2.5 rounded-2xl text-xs shadow-xs"
              >
                Explore Restaurants
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Active Items Header */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400 font-extrabold tracking-wider uppercase">
                  Selected Food Items
                </span>
                <button
                  onClick={onClear}
                  className="cursor-pointer text-red-600 hover:text-red-700 flex items-center gap-1 font-bold transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Cart</span>
                </button>
              </div>

              {/* Items List */}
              <div className="divide-y divide-zinc-100 bg-zinc-50/50 p-3 rounded-2xl border border-zinc-100">
                {items.map(({ item, quantity, restaurantName }) => (
                  <div key={item.id} className="py-3 flex gap-3 items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-12 rounded-xl object-cover border border-zinc-200/60 shrink-0"
                      />

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              item.isVeg ? "bg-emerald-500" : "bg-red-500"
                            }`}
                          />
                          <h4 className="font-bold text-xs text-zinc-900 truncate max-w-[180px]">
                            {item.title}
                          </h4>
                        </div>
                        
                        <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                          {restaurantName}
                        </p>

                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-black text-zinc-950 font-sans">
                            ₹{item.price * quantity}
                          </span>
                          <span className="text-[10px] text-zinc-400">
                            (₹{item.price} × {quantity})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="bg-white border border-zinc-200/80 rounded-xl flex items-center p-1 font-mono shrink-0 shadow-2xs">
                      <button
                        onClick={() => onDecrement(item)}
                        className="cursor-pointer p-1 text-zinc-600 hover:text-zinc-950 rounded-lg hover:bg-zinc-100 transition-all active:scale-95"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-black text-zinc-900 px-2 leading-none">
                        {quantity}
                      </span>
                      <button
                        onClick={() => onIncrement(item)}
                        className="cursor-pointer p-1 text-zinc-600 hover:text-zinc-950 rounded-lg hover:bg-zinc-100 transition-all active:scale-95"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>


              {/* ------------------------------------------------------------- */}
              {/* SECTION 10: FAIRBYTE TRANSPARENT PRICE COMPARISON */}
              {/* "See the difference" Card */}
              {/* ------------------------------------------------------------- */}
              {billing && billing.traditionalComparison && (
                <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950 text-white rounded-3xl p-5 border border-emerald-500/30 shadow-xl space-y-4">
                  
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-5 h-5 text-emerald-400" />
                      <div>
                        <h3 className="text-sm font-black text-white font-sans tracking-tight">
                          See the difference
                        </h3>
                        <span className="text-[10px] text-zinc-400 font-medium">
                          Illustrative comparison
                        </span>
                      </div>
                    </div>

                    <div className="bg-emerald-500 text-zinc-950 text-xs font-black px-2.5 py-1 rounded-xl shadow-xs">
                      You save ₹{billing.traditionalComparison.savings}
                    </div>
                  </div>

                  {/* Side-by-Side Comparison Box */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    
                    {/* Traditional Delivery Side */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-2">
                      <span className="text-[11px] font-bold text-zinc-400 block uppercase tracking-wider">
                        Traditional App
                      </span>
                      <div className="space-y-1 text-zinc-300 text-[11px]">
                        <div className="flex justify-between">
                          <span>Food:</span>
                          <span className="font-mono">₹{billing.traditionalComparison.foodPrice}</span>
                        </div>
                        <div className="flex justify-between text-red-300">
                          <span>Markups:</span>
                          <span className="font-mono">+₹{billing.traditionalComparison.traditionalTotal - billing.traditionalComparison.foodPrice}</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-zinc-200">
                        <span>Total:</span>
                        <span className="font-mono text-sm text-red-400 line-through">
                          ₹{billing.traditionalComparison.traditionalTotal}
                        </span>
                      </div>
                    </div>

                    {/* RestoX Side */}
                    <div className="bg-emerald-900/40 border border-emerald-500/40 rounded-2xl p-3.5 space-y-2 relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-emerald-300 uppercase tracking-wider">
                          RestoX
                        </span>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <div className="space-y-1 text-zinc-200 text-[11px]">
                        <div className="flex justify-between">
                          <span>Food:</span>
                          <span className="font-mono">₹{billing.subtotal}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Delivery:</span>
                          <span className="font-mono">₹{billing.deliveryFee}</span>
                        </div>
                        <div className="flex justify-between text-emerald-400 font-bold">
                          <span>Platform:</span>
                          <span className="font-mono">₹0</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-emerald-500/30 flex justify-between font-black text-emerald-300">
                        <span>Total:</span>
                        <span className="font-mono text-base text-emerald-400">
                          ₹{billing.grandTotal}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Clarification Messaging */}
                  <div className="bg-black/40 p-3 rounded-2xl border border-white/5 space-y-1">
                    <p className="font-black text-xs text-emerald-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>"You see exactly what you're paying for."</span>
                    </p>
                    <p className="text-[11px] text-zinc-300 leading-relaxed">
                      Restaurant menu price + transparent delivery. No surprise platform charges in this demo.
                    </p>
                  </div>

                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* SECTION 11: TRANSPARENT PRICING 3 PILLARS */}
              {/* ------------------------------------------------------------- */}
              <div className="space-y-2.5 pt-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 block">
                  How RestoX Pricing Works
                </span>

                <div className="grid grid-cols-1 gap-2.5">
                  <div className="bg-white border border-zinc-200 p-3 rounded-2xl flex items-start gap-3 shadow-2xs">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-zinc-950">Restaurant Menu Price</h4>
                      <p className="text-[11px] text-zinc-500 leading-tight mt-0.5">
                        The food price shown comes directly from the restaurant's menu.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border border-zinc-200 p-3 rounded-2xl flex items-start gap-3 shadow-2xs">
                    <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-zinc-950">Transparent Delivery</h4>
                      <p className="text-[11px] text-zinc-500 leading-tight mt-0.5">
                        The delivery cost is shown separately before checkout.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border border-zinc-200 p-3 rounded-2xl flex items-start gap-3 shadow-2xs">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-zinc-950">Clear Final Price</h4>
                      <p className="text-[11px] text-zinc-500 leading-tight mt-0.5">
                        Customers see the complete price before placing the order.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECTION 9: BILLING BREAKDOWN & CHECKOUT ACTION */}
        {/* ------------------------------------------------------------- */}
        {items.length > 0 && billing && (
          <div className="p-5 bg-zinc-50 border-t border-zinc-200 space-y-4">
            
            <div className="space-y-2 text-xs">
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

              <div className="border-t-2 border-zinc-200 pt-3 flex justify-between items-center">
                <div>
                  <span className="font-extrabold text-zinc-900 text-sm block">Total</span>
                  <span className="text-[10px] text-zinc-400">Guaranteed final amount</span>
                </div>
                <span className="font-black text-2xl text-emerald-700 font-sans">
                  ₹{billing.grandTotal.toFixed(2)}
                </span>
              </div>

              {/* Transparency Notice */}
              <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-2.5 text-center mt-2">
                <p className="text-[11px] text-emerald-900 font-bold">
                  No platform fee. You see the complete price before ordering.
                </p>
                <p className="text-[10px] text-emerald-700 mt-0.5">
                  Restaurant menu price + transparent GST + delivery
                </p>
              </div>
            </div>

            {/* Proceed CTA */}
            <button
              onClick={onProceed}
              className="cursor-pointer w-full bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-black py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 active:scale-98 text-sm"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

          </div>
        )}
      </motion.div>
    </>
  );
}
