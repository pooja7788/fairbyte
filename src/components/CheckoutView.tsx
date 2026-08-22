import React, { useState } from "react";
import { 
  ArrowLeft, 
  MapPin, 
  Plus, 
  ShieldCheck, 
  Bike, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Sparkles, 
  Check, 
  QrCode,
  Tag,
  AlertCircle
} from "lucide-react";
import { Address, BillingBreakdown, CartItem } from "../types";

interface CheckoutViewProps {
  cartItems: CartItem[];
  addresses: Address[];
  selectedAddress: Address | null;
  setSelectedAddress: (addr: Address) => void;
  billing: BillingBreakdown | null;
  onOpenAddAddress: () => void;
  onPlaceOrder: (paymentMethod: string) => void;
  onBackToMenu: () => void;
  isProcessing: boolean;
}

export default function CheckoutView({
  cartItems,
  addresses,
  selectedAddress,
  setSelectedAddress,
  billing,
  onOpenAddAddress,
  onPlaceOrder,
  onBackToMenu,
  isProcessing
}: CheckoutViewProps) {
  const [selectedPayment, setSelectedPayment] = useState<"cod" | "upi" | "card">("upi");
  const [selectedUpiApp, setSelectedUpiApp] = useState<"gpay" | "phonepe" | "paytm" | "qr">("gpay");
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8821");
  const [cardExpiry, setCardExpiry] = useState("08/29");
  const [cardCvv, setCardCvv] = useState("•••");

  if (!billing || cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-black text-zinc-900">Your cart is empty</h2>
        <button
          onClick={onBackToMenu}
          className="cursor-pointer bg-emerald-600 text-zinc-950 font-bold px-5 py-2.5 rounded-2xl text-xs"
        >
          Return to Menu
        </button>
      </div>
    );
  }

  const handleConfirmOrder = () => {
    let paymentLabel = "Cash on Delivery";
    if (selectedPayment === "upi") {
      paymentLabel = `UPI (${selectedUpiApp.toUpperCase()})`;
    } else if (selectedPayment === "card") {
      paymentLabel = "Credit/Debit Card";
    }

    onPlaceOrder(paymentLabel);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24">
      
      {/* 1. TOP NAV / BACK BUTTON */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToMenu}
          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white hover:bg-zinc-100 border border-zinc-200 text-xs font-bold text-zinc-800 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Transparent Pricing Guaranteed</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Address, Items & Payment */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* STEP 1: DELIVERY ADDRESS */}
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h3 className="font-black text-base text-zinc-950 font-sans">
                  Delivery Address
                </h3>
              </div>

              <button
                onClick={onOpenAddAddress}
                className="cursor-pointer text-emerald-700 hover:text-emerald-800 text-xs font-bold flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddress(addr)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                    selectedAddress?.id === addr.id
                      ? "border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600/30"
                      : "border-zinc-200 hover:border-zinc-300 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <MapPin className={`w-5 h-5 shrink-0 mt-0.5 ${
                      selectedAddress?.id === addr.id ? "text-emerald-600" : "text-zinc-400"
                    }`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-zinc-950">{addr.label}</span>
                        {addr.isDefault && (
                          <span className="bg-zinc-200 text-zinc-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">{addr.text}</p>
                    </div>
                  </div>

                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    selectedAddress?.id === addr.id
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-zinc-300"
                  }`}>
                    {selectedAddress?.id === addr.id && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 2: ORDER ITEMS SUMMARY */}
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h3 className="font-black text-base text-zinc-950 font-sans">
                  Order Summary
                </h3>
              </div>
              <span className="text-xs font-bold text-zinc-500">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
              </span>
            </div>

            <div className="divide-y divide-zinc-100">
              {cartItems.map(({ item, quantity, restaurantName }) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${
                      item.isVeg ? "bg-emerald-500" : "bg-red-500"
                    }`} />
                    <span className="font-extrabold text-zinc-900 truncate max-w-[220px]">
                      {item.title}
                    </span>
                    <span className="text-zinc-400 font-mono">× {quantity}</span>
                  </div>
                  <span className="font-black text-zinc-950 font-sans">
                    ₹{item.price * quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 3: PAYMENT METHOD (Frontend-Only Mock) */}
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="font-black text-base text-zinc-950 font-sans">
                Select Payment Option
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* UPI Option */}
              <button
                type="button"
                onClick={() => setSelectedPayment("upi")}
                className={`cursor-pointer p-4 rounded-2xl border text-left transition-all space-y-2 ${
                  selectedPayment === "upi"
                    ? "border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600/30"
                    : "border-zinc-200 hover:border-zinc-300 bg-white"
                }`}
              >
                <Smartphone className="w-5 h-5 text-emerald-600" />
                <div>
                  <h4 className="font-black text-xs text-zinc-950">Instant UPI</h4>
                  <p className="text-[10px] text-zinc-500">GPay, PhonePe, Paytm, QR</p>
                </div>
              </button>

              {/* Card Option */}
              <button
                type="button"
                onClick={() => setSelectedPayment("card")}
                className={`cursor-pointer p-4 rounded-2xl border text-left transition-all space-y-2 ${
                  selectedPayment === "card"
                    ? "border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600/30"
                    : "border-zinc-200 hover:border-zinc-300 bg-white"
                }`}
              >
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <div>
                  <h4 className="font-black text-xs text-zinc-950">Credit / Debit</h4>
                  <p className="text-[10px] text-zinc-500">Visa, Mastercard, RuPay</p>
                </div>
              </button>

              {/* Cash On Delivery Option */}
              <button
                type="button"
                onClick={() => setSelectedPayment("cod")}
                className={`cursor-pointer p-4 rounded-2xl border text-left transition-all space-y-2 ${
                  selectedPayment === "cod"
                    ? "border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600/30"
                    : "border-zinc-200 hover:border-zinc-300 bg-white"
                }`}
              >
                <Banknote className="w-5 h-5 text-emerald-600" />
                <div>
                  <h4 className="font-black text-xs text-zinc-950">Pay on Delivery</h4>
                  <p className="text-[10px] text-zinc-500">Cash or UPI at doorstep</p>
                </div>
              </button>

            </div>

            {/* Sub-panels for selected payment */}
            {selectedPayment === "upi" && (
              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200/80 space-y-3 animate-in fade-in duration-150">
                <span className="text-[11px] font-bold text-zinc-700 block">Choose UPI App / Scan QR:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "gpay", label: "Google Pay" },
                    { id: "phonepe", label: "PhonePe" },
                    { id: "paytm", label: "Paytm" },
                    { id: "qr", label: "Scan QR Code" }
                  ].map(app => (
                    <button
                      key={app.id}
                      onClick={() => setSelectedUpiApp(app.id as any)}
                      className={`cursor-pointer px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        selectedUpiApp === app.id
                          ? "bg-zinc-950 text-white border-zinc-950"
                          : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                      }`}
                    >
                      {app.label}
                    </button>
                  ))}
                </div>
                {selectedUpiApp === "qr" && (
                  <div className="p-3 bg-white border border-zinc-200 rounded-xl flex items-center gap-3 text-xs">
                    <QrCode className="w-8 h-8 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold text-zinc-900">Dynamic UPI QR Code</p>
                      <p className="text-[11px] text-zinc-500">Simulated one-touch verification upon order placement</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedPayment === "card" && (
              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200/80 space-y-3 animate-in fade-in duration-150 text-xs">
                <span className="font-bold text-zinc-700 block">Mock Card Details:</span>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={cardNumber}
                    readOnly
                    className="col-span-3 bg-white border border-zinc-200 rounded-xl p-2 font-mono text-zinc-700"
                  />
                  <input
                    type="text"
                    value={cardExpiry}
                    readOnly
                    className="bg-white border border-zinc-200 rounded-xl p-2 font-mono text-zinc-700"
                  />
                  <input
                    type="text"
                    value={cardCvv}
                    readOnly
                    className="bg-white border border-zinc-200 rounded-xl p-2 font-mono text-zinc-700"
                  />
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Right Column: Transparent Bill Breakdown & Place Order */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Transparency Guarantee Card */}
          <div className="bg-emerald-950 text-white rounded-3xl p-5 border border-emerald-800/40 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h4 className="font-black text-xs text-emerald-300">
                No surprises. You see your complete price before you pay.
              </h4>
            </div>
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              Direct restaurant in-store pricing + exact distance-based delivery fee. Zero surprise platform markups.
            </p>
          </div>

          {/* Transparent Bill Breakdown Card */}
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-sm space-y-5">
            <h3 className="font-black text-base text-zinc-950 font-sans border-b border-zinc-100 pb-3">
              Transparent Bill Breakdown
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center text-zinc-700">
                <span>Food Subtotal (Menu Price)</span>
                <span className="font-bold text-zinc-950 font-mono">₹{billing.subtotal}</span>
              </div>

              <div className="flex justify-between items-center text-zinc-700">
                <span className="flex items-center gap-1.5">
                  <Bike className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Delivery Charge</span>
                </span>
                <span className="font-bold text-zinc-950 font-mono">
                  {billing.deliveryFee === 0 ? "FREE" : `₹${billing.deliveryFee}`}
                </span>
              </div>

              <div className="flex justify-between items-center text-emerald-700 font-bold">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Platform Fee</span>
                </span>
                <span className="font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px]">
                  ₹0
                </span>
              </div>

              <div className="flex justify-between items-center text-emerald-700 font-bold">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Service Fee</span>
                </span>
                <span className="font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px]">
                  ₹0
                </span>
              </div>

              {billing.discount > 0 && (
                <div className="flex justify-between items-center text-emerald-700 font-bold">
                  <span>Discount Applied ({billing.appliedCoupon?.code})</span>
                  <span className="font-mono">-₹{billing.discount}</span>
                </div>
              )}

              <div className="border-t-2 border-zinc-200 pt-4 flex justify-between items-center">
                <div>
                  <span className="font-extrabold text-zinc-950 text-base block">Final Total</span>
                  <span className="text-[11px] text-zinc-400">All fees included</span>
                </div>
                <span className="font-black text-3xl text-emerald-700 font-sans">
                  ₹{billing.grandTotal}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              onClick={handleConfirmOrder}
              disabled={isProcessing}
              className="cursor-pointer w-full bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-black py-4 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 active:scale-98 text-sm disabled:opacity-50"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  <span>Securing Order...</span>
                </div>
              ) : (
                <span>Place Order • ₹{billing.grandTotal}</span>
              )}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
