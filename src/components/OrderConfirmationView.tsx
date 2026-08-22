import React from "react";
import { motion } from "motion/react";
import { 
  CheckCircle2, 
  ArrowRight, 
  Compass, 
  Bike, 
  MapPin, 
  Receipt, 
  Clock, 
  ShieldCheck,
  Sparkles,
  ShoppingBag
} from "lucide-react";
import { Order } from "../types";

interface OrderConfirmationViewProps {
  order: Order;
  onTrackOrder: () => void;
  onBackToHome: () => void;
  onViewOrdersList: () => void;
}

export default function OrderConfirmationView({
  order,
  onTrackOrder,
  onBackToHome,
  onViewOrdersList
}: OrderConfirmationViewProps) {
  return (
    <div className="max-w-2xl mx-auto py-8 sm:py-12 px-4 space-y-8">
      
      {/* 1. SUCCESS ANIMATED HERO CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-gradient-to-b from-emerald-950 via-zinc-900 to-zinc-950 text-white rounded-3xl p-8 sm:p-10 border border-emerald-500/30 shadow-2xl text-center space-y-6 relative overflow-hidden"
      >
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto text-zinc-950 shadow-lg shadow-emerald-500/30"
          >
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </motion.div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight">
              Order placed successfully 🎉
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300">
              Your order has been transmitted directly to the kitchen.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-4 py-1.5 rounded-full text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Order ID: {order.id}</span>
          </div>
        </div>

        {/* Order Quick Highlights Box */}
        <div className="grid grid-cols-2 gap-3 pt-2 text-left relative z-10">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
            <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider block">
              Restaurant
            </span>
            <p className="text-sm font-extrabold text-white truncate">
              {order.restaurantName}
            </p>
            <p className="text-[11px] text-emerald-400">Menu price verified</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
            <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider block">
              Estimated Delivery
            </span>
            <p className="text-sm font-extrabold text-white">
              {order.estimatedDeliveryMin}
            </p>
            <p className="text-[11px] text-emerald-400">Partner on standby</p>
          </div>
        </div>

      </motion.div>

      {/* 2. ORDER DETAILS & BILL BREAKDOWN */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Items List */}
        <div className="space-y-3">
          <h3 className="font-extrabold text-sm text-zinc-950 font-sans border-b border-zinc-100 pb-2">
            Items Ordered ({order.items.length})
          </h3>

          <div className="divide-y divide-zinc-100">
            {order.items.map(({ item, quantity }) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${item.isVeg ? "bg-emerald-500" : "bg-red-500"}`} />
                  <span className="font-bold text-zinc-800">{item.title}</span>
                  <span className="text-zinc-400 font-mono">× {quantity}</span>
                </div>
                <span className="font-mono font-bold text-zinc-950">₹{item.price * quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transparent Bill Summary */}
        <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200/80 space-y-2 text-xs">
          <div className="flex justify-between text-zinc-700">
            <span>Food Total</span>
            <span className="font-mono font-bold text-zinc-950">₹{order.billing.subtotal}</span>
          </div>
          <div className="flex justify-between text-zinc-700">
            <span>Delivery Fee</span>
            <span className="font-mono font-bold text-zinc-950">
              {order.billing.deliveryFee === 0 ? "FREE" : `₹${order.billing.deliveryFee}`}
            </span>
          </div>
          <div className="flex justify-between text-emerald-700 font-bold">
            <span>Platform Fee</span>
            <span className="font-mono">₹0 FREE</span>
          </div>
          <div className="flex justify-between text-emerald-700 font-bold">
            <span>Service Fee</span>
            <span className="font-mono">₹0 FREE</span>
          </div>
          {order.billing.discount > 0 && (
            <div className="flex justify-between text-emerald-700 font-bold">
              <span>Coupon Discount</span>
              <span className="font-mono">-₹{order.billing.discount}</span>
            </div>
          )}
          <div className="border-t border-zinc-200 pt-2 flex justify-between items-center text-sm font-black text-zinc-950">
            <span>Final Paid Total</span>
            <span className="text-base text-emerald-700 font-sans">₹{order.billing.grandTotal}</span>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="flex items-start gap-3 text-xs text-zinc-600 bg-zinc-50 p-3.5 rounded-2xl border border-zinc-100">
          <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-zinc-900 block">{order.address.label}</span>
            <span>{order.address.text}</span>
          </div>
        </div>

        {/* 3. PRIMARY ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={onTrackOrder}
            className="cursor-pointer w-full sm:flex-1 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 active:scale-98 text-sm"
          >
            <Bike className="w-4 h-4" />
            <span>Track Order</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onViewOrdersList}
            className="cursor-pointer w-full sm:w-auto bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold py-4 px-6 rounded-2xl text-xs transition-colors"
          >
            <span>View All Orders</span>
          </button>

          <button
            onClick={onBackToHome}
            className="cursor-pointer w-full sm:w-auto text-zinc-500 hover:text-zinc-800 text-xs font-semibold py-3 px-4"
          >
            Back to Home
          </button>
        </div>

      </div>

    </div>
  );
}
