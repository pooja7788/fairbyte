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
  Info
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
        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white border-l border-zinc-200 shadow-2xl z-50 flex flex-col h-full overflow-hidden"
      >
        {/* Header section */}
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-zinc-950 tracking-tight text-base">
                Your FairByte Order
              </h3>
              <p className="text-[10px] text-zinc-500 font-medium">
                Direct restaurant pricing • No hidden markups
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
                  Browse through top local restaurants and order delicious food at true menu prices.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              
              {/* Active Items Header */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400 font-extrabold tracking-wider uppercase">
                  Order Items
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
              <div className="divide-y divide-zinc-100">
                {items.map(({ item, quantity, restaurantName }) => (
                  <div key={item.id} className="py-3.5 flex gap-3 items-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-14 h-14 rounded-2xl object-cover border border-zinc-200/60 shrink-0"
                    />

                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            item.isVeg ? "bg-emerald-500" : "bg-red-500"
                          }`}
                        />
                        <h4 className="font-bold text-xs text-zinc-900 truncate">
                          {item.title}
                        </h4>
                      </div>
                      
                      <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                        {restaurantName}
                      </p>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-black text-zinc-950 font-sans">
                          ₹{item.price * quantity}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          (₹{item.price} each)
                        </span>
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="bg-zinc-100 border border-zinc-200/80 rounded-xl flex items-center p-1 font-mono shrink-0">
                      <button
                        onClick={() => onDecrement(item)}
                        className="cursor-pointer p-1 text-zinc-600 hover:text-zinc-950 bg-white border border-zinc-200/50 rounded-lg shadow-2xs hover:shadow-xs transition-all active:scale-95"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-extrabold text-zinc-900 px-2.5 leading-none">
                        {quantity}
                      </span>
                      <button
                        onClick={() => onIncrement(item)}
                        className="cursor-pointer p-1 text-zinc-600 hover:text-zinc-950 bg-white border border-zinc-200/50 rounded-lg shadow-2xs hover:shadow-xs transition-all active:scale-95"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Strong Transparency Banner Card */}
              <div className="bg-emerald-950 text-white p-4.5 rounded-2xl border border-emerald-800/40 space-y-2 relative overflow-hidden">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <h4 className="font-extrabold text-xs text-emerald-300">
                    "You see exactly what you're paying for."
                  </h4>
                </div>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  Restaurant menu price + transparent delivery. No surprise platform charges in this demo.
                </p>
              </div>

              {/* Comparative Savings Pill if computed */}
              {billing?.traditionalComparison && (
                <div className="bg-amber-50 border border-amber-200/80 p-3.5 rounded-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <span className="font-bold text-amber-900 block leading-tight">
                        You save ₹{billing.traditionalComparison.savings} on this order
                      </span>
                      <span className="text-[10px] text-amber-700 font-medium">
                        vs traditional platform fees (₹{billing.traditionalComparison.traditionalTotal})
                      </span>
                    </div>
                  </div>
                  <span className="bg-amber-500 text-zinc-950 text-[10px] font-black uppercase px-2 py-1 rounded-lg shrink-0">
                    Fair Deal
                  </span>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Transparent Billing Breakdown & Proceed Button */}
        {items.length > 0 && billing && (
          <div className="p-5 bg-zinc-50 border-t border-zinc-200 space-y-4">
            
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-zinc-700">
                <span>Food Subtotal</span>
                <span className="font-bold text-zinc-950 font-mono">₹{billing.subtotal}</span>
              </div>

              <div className="flex justify-between items-center text-zinc-700">
                <span className="flex items-center gap-1.5">
                  <Bike className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Transparent Delivery</span>
                </span>
                <span className="font-bold text-zinc-950 font-mono">₹{billing.deliveryFee}</span>
              </div>

              <div className="flex justify-between items-center text-emerald-700">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Platform Fee</span>
                </span>
                <span className="font-bold font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px]">
                  ₹0 FREE
                </span>
              </div>

              <div className="flex justify-between items-center text-emerald-700">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Service Fee</span>
                </span>
                <span className="font-bold font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px]">
                  ₹0 ZERO
                </span>
              </div>

              <div className="border-t-2 border-zinc-200 pt-3 flex justify-between items-center">
                <div>
                  <span className="font-extrabold text-zinc-900 text-sm block">Total</span>
                  <span className="text-[10px] text-zinc-400">Guaranteed final amount</span>
                </div>
                <span className="font-black text-2xl text-emerald-700 font-sans">
                  ₹{billing.grandTotal}
                </span>
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
