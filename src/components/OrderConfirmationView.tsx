import React from "react";
import { motion } from "motion/react";
import { 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Bike, 
  Receipt, 
  Home, 
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { Order } from "../types";

interface OrderConfirmationViewProps {
  order: Order;
  onTrackOrder: () => void;
  onBackToHome: () => void;
}

export default function OrderConfirmationView({
  order,
  onTrackOrder,
  onBackToHome
}: OrderConfirmationViewProps) {
  return (
    <div className="max-w-2xl mx-auto py-8 sm:py-12 px-4 space-y-6">
      
      {/* Main Success Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-10 shadow-xl text-center space-y-7"
      >
        
        {/* Animated Celebration Badge */}
        <div className="flex justify-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 }}
            className="w-20 h-20 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/10"
          >
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </motion.div>
        </div>

        {/* Title & Tag */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CONFIRMED AT MENU PRICE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight font-sans">
            Order placed successfully 🎉
          </h1>

          <p className="text-xs sm:text-sm text-zinc-500 font-normal max-w-md mx-auto">
            Your order has been transmitted directly to the kitchen. Transparent pricing locked with zero hidden fees.
          </p>
        </div>

        {/* Order Details Grid */}
        <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-5 text-left space-y-4 font-sans">
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-4 border-b border-zinc-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Order ID</span>
              <span className="font-mono font-extrabold text-sm text-zinc-900">{order.id}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Restaurant</span>
              <span className="font-bold text-sm text-zinc-900 truncate block">{order.restaurantName}</span>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Estimated Delivery</span>
              <div className="flex items-center gap-1 font-extrabold text-sm text-emerald-700">
                <Clock className="w-3.5 h-3.5" />
                <span>{order.estimatedDeliveryMin}</span>
              </div>
            </div>
          </div>

          {/* Transparent Itemized Summary */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center text-zinc-600">
              <span>Food Total ({order.items.length} dishes)</span>
              <span className="font-mono font-bold text-zinc-900">₹{order.billing.subtotal}</span>
            </div>

            <div className="flex justify-between items-center text-zinc-600">
              <span className="flex items-center gap-1.5">
                <Bike className="w-3.5 h-3.5 text-emerald-600" />
                <span>Transparent Delivery</span>
              </span>
              <span className="font-mono font-bold text-zinc-900">₹{order.billing.deliveryFee}</span>
            </div>

            <div className="flex justify-between items-center text-emerald-700">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Platform & Service Fee</span>
              </span>
              <span className="font-bold font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px]">
                ₹0 ZERO
              </span>
            </div>

            <div className="border-t border-zinc-200 pt-3 flex justify-between items-center">
              <span className="font-black text-sm text-zinc-950">Final Total Paid</span>
              <span className="font-black text-2xl text-emerald-700 font-sans">
                ₹{order.billing.grandTotal}
              </span>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={onTrackOrder}
            className="cursor-pointer w-full bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/25 active:scale-98 text-sm"
          >
            <span>Track Order Live</span>
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>

          <button
            onClick={onBackToHome}
            className="cursor-pointer w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold py-3 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all text-xs"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </button>
        </div>

      </motion.div>

    </div>
  );
}
