import React, { useState } from "react";
import { 
  Clock, 
  Bike, 
  ArrowRight, 
  CheckCircle2, 
  RotateCcw, 
  Receipt, 
  UtensilsCrossed,
  ShieldCheck,
  ChevronRight,
  X
} from "lucide-react";
import { Order, CartItem, Restaurant, FoodItem } from "../types";

interface OrdersViewProps {
  activeOrder: Order | null;
  pastOrders: Order[];
  onTrackActiveOrder: () => void;
  onReorder: (order: Order) => void;
  onBrowseRestaurants: () => void;
}

export default function OrdersView({
  activeOrder,
  pastOrders,
  onTrackActiveOrder,
  onReorder,
  onBrowseRestaurants
}: OrdersViewProps) {
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);

  const hasOrders = activeOrder !== null || pastOrders.length > 0;

  if (!hasOrders) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-5">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto border border-emerald-100 shadow-sm">
          <Clock className="w-9 h-9" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-zinc-950 font-sans">No orders yet</h2>
          <p className="text-sm text-zinc-500 max-w-xs mx-auto">
            Your next favorite meal is waiting at honest restaurant menu prices.
          </p>
        </div>
        <button
          onClick={onBrowseRestaurants}
          className="cursor-pointer inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-black px-6 py-3 rounded-2xl text-sm shadow-md transition-all active:scale-95"
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Browse Restaurants</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      
      <div className="flex items-center justify-between border-b border-zinc-200/80 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 font-sans tracking-tight">
            My Orders
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Track active deliveries and review your transparent receipts
          </p>
        </div>

        <button
          onClick={onBrowseRestaurants}
          className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3.5 py-2 rounded-xl transition-colors"
        >
          <UtensilsCrossed className="w-3.5 h-3.5" />
          <span>Order Food</span>
        </button>
      </div>

      {/* 1. ACTIVE ORDER CARD */}
      {activeOrder && (
        <div className="space-y-3">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Active Live Delivery</span>
          </span>

          <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-7 border border-emerald-500/40 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={activeOrder.restaurantImage}
                  alt={activeOrder.restaurantName}
                  className="w-14 h-14 rounded-2xl object-cover border border-emerald-500/40 shrink-0"
                />
                <div>
                  <h3 className="font-black text-base sm:text-lg text-white">
                    {activeOrder.restaurantName}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Order ID: #{activeOrder.id} • Placed {activeOrder.createdAt}
                  </p>
                </div>
              </div>

              <div className="bg-emerald-500/20 border border-emerald-500/40 px-3.5 py-1.5 rounded-full text-emerald-300 text-xs font-bold font-mono self-start sm:self-auto">
                {activeOrder.estimatedDeliveryMin}
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-zinc-300">
              <p className="font-bold text-white">Items:</p>
              <p className="text-zinc-400">
                {activeOrder.items.map(i => `${i.item.title} (×${i.quantity})`).join(", ")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-white/10">
              <div>
                <span className="text-[10px] text-zinc-400 block uppercase font-bold">Total Paid</span>
                <span className="text-xl font-black text-emerald-400 font-sans">
                  ₹{activeOrder.billing.grandTotal}
                </span>
              </div>

              <button
                onClick={onTrackActiveOrder}
                className="cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black px-6 py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95"
              >
                <Bike className="w-4 h-4" />
                <span>Track Live Progress</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. PAST ORDERS LIST */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-zinc-950 font-sans">
          Past Orders History
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {pastOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-zinc-200/80 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={order.restaurantImage}
                    alt={order.restaurantName}
                    className="w-12 h-12 rounded-xl object-cover border border-zinc-200 shrink-0"
                  />
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-zinc-950">
                      {order.restaurantName}
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      Order #{order.id} • {order.createdAt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Delivered</span>
                  </span>
                  <span className="font-black text-sm text-zinc-950 font-sans">
                    ₹{order.billing.grandTotal}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="text-xs text-zinc-600 space-y-1">
                {order.items.map(i => (
                  <div key={i.item.id} className="flex justify-between">
                    <span>{i.item.title} × {i.quantity}</span>
                    <span className="font-mono text-zinc-800">₹{i.item.price * i.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Actions Footer */}
              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedReceiptOrder(order)}
                  className="cursor-pointer text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>View Breakdown</span>
                </button>

                <button
                  onClick={() => onReorder(order)}
                  className="cursor-pointer bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reorder</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. DETAILED RECEIPT BREAKDOWN MODAL */}
      {selectedReceiptOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-zinc-200 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-zinc-950 text-sm">
                  Transparent Receipt #{selectedReceiptOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="cursor-pointer p-1 rounded-full text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-zinc-700">
              <div className="flex justify-between">
                <span>Restaurant:</span>
                <span className="font-bold text-zinc-950">{selectedReceiptOrder.restaurantName}</span>
              </div>
              <div className="flex justify-between">
                <span>Food Subtotal (Menu Price):</span>
                <span className="font-mono font-bold text-zinc-950">₹{selectedReceiptOrder.billing.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                <span className="font-mono font-bold text-zinc-950">₹{selectedReceiptOrder.billing.deliveryFee}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Platform Fee:</span>
                <span className="font-mono">₹0 FREE</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Service Fee:</span>
                <span className="font-mono">₹0 FREE</span>
              </div>
              <div className="border-t border-zinc-200 pt-3 flex justify-between font-black text-sm text-zinc-950">
                <span>Grand Total:</span>
                <span className="font-sans text-emerald-700 text-lg">₹{selectedReceiptOrder.billing.grandTotal}</span>
              </div>
            </div>

            {selectedReceiptOrder.billing.traditionalComparison && (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-xs text-emerald-900 font-bold flex items-center justify-between">
                <span>FairByte Savings:</span>
                <span>₹{selectedReceiptOrder.billing.traditionalComparison.savings} saved</span>
              </div>
            )}

            <button
              onClick={() => setSelectedReceiptOrder(null)}
              className="cursor-pointer w-full bg-zinc-950 text-white font-bold py-2.5 rounded-xl text-xs"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
