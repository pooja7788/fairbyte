import React, { useState, useEffect } from "react";
import { 
  MapPin, 
  Plus, 
  Navigation, 
  ShieldCheck, 
  CreditCard, 
  ChevronRight, 
  Check, 
  Bike, 
  Sparkles,
  ArrowLeft,
  Smartphone,
  Wallet,
  Building,
  CheckCircle2,
  Lock
} from "lucide-react";
import { Address, BillingBreakdown, CartItem } from "../types";

interface CheckoutViewProps {
  cartItems: CartItem[];
  addresses: Address[];
  selectedAddress: Address | null;
  setSelectedAddress: (addr: Address) => void;
  billing: BillingBreakdown | null;
  onAddAddress: (newAddr: { label: string; text: string; lat: number; lng: number }) => void;
  onPlaceOrder: (paymentMethod: string) => void;
  onBackToMenu: () => void;
  isProcessing: boolean;
}

const MOCK_LOCALES = [
  { label: "Lavelle Road, MG Road Area", text: "Flat 402, Royal Palms, Lavelle Road, Bengaluru - 560001", lat: 12.9698, lng: 77.5972 },
  { label: "Vittal Mallya Road, MG Road", text: "Prestige Sphinx, Vittal Mallya Rd, Shanthala Nagar, Bengaluru", lat: 12.9722, lng: 77.5980 },
  { label: "WeWork Galaxy, Residency Road", text: "Level 11, WeWork Galaxy, Residency Rd, Bengaluru - 560025", lat: 12.9708, lng: 77.6015 },
  { label: "Koramangala 4th Block", text: "Building 12, 80 Feet Rd, Koramangala, Bengaluru - 560034", lat: 12.9343, lng: 77.6253 },
  { label: "Indiranagar 100 Feet Road", text: "Flat B, Metro Heights, 100 Feet Rd, Indiranagar, Bengaluru - 560038", lat: 12.9784, lng: 77.6408 }
];

export default function CheckoutView({
  cartItems,
  addresses,
  selectedAddress,
  setSelectedAddress,
  billing,
  onAddAddress,
  onPlaceOrder,
  onBackToMenu,
  isProcessing
}: CheckoutViewProps) {
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newText, setNewText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<typeof MOCK_LOCALES>([]);
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "CARD" | "NET_BANKING" | "CASH">("UPI");

  // Center reference
  const restLat = 12.9716;
  const restLng = 77.5946;

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const filtered = MOCK_LOCALES.filter(l =>
        l.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const selectSuggestion = (loc: typeof MOCK_LOCALES[number]) => {
    onAddAddress({
      label: loc.label,
      text: loc.text,
      lat: loc.lat,
      lng: loc.lng
    });
    setSuggestions([]);
    setSearchQuery("");
    setShowNewAddressForm(false);
  };

  const handleCustomAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel || !newText) return;

    onAddAddress({
      label: newLabel,
      text: newText,
      lat: restLat + (Math.random() - 0.5) * 0.04,
      lng: restLng + (Math.random() - 0.5) * 0.04
    });

    setNewLabel("");
    setNewText("");
    setShowNewAddressForm(false);
  };

  // Draw interactive map pin canvas
  useEffect(() => {
    const canvas = document.getElementById("checkout-map-canvas") as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const centerX = w / 2;
    const centerY = h / 2;

    ctx.clearRect(0, 0, w, h);

    // Map background
    ctx.fillStyle = "#f4f4f5";
    ctx.fillRect(0, 0, w, h);

    // Roads
    ctx.strokeStyle = "#e4e4e7";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(0, centerY); ctx.lineTo(w, centerY);
    ctx.moveTo(centerX, 0); ctx.lineTo(centerX, h);
    ctx.moveTo(0, 0); ctx.lineTo(w, h);
    ctx.moveTo(w, 0); ctx.lineTo(0, h);
    ctx.stroke();

    // Road ring
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 45, 0, 2 * Math.PI);
    ctx.stroke();

    // Landmark labels
    ctx.font = "bold 9px sans-serif";
    ctx.fillStyle = "#a1a1aa";
    ctx.fillText("CENTRAL KITCHEN", centerX - 40, centerY - 55);
    ctx.fillText("INDIRANAGAR", w - 70, 35);
    ctx.fillText("KORAMANGALA", 25, h - 25);

    // Kitchen restaurant pin
    ctx.fillStyle = "#10b981"; // Emerald
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
    ctx.fill();

    // Label
    ctx.fillStyle = "#064e3b";
    ctx.fillRect(centerX - 35, centerY - 25, 70, 14);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 8px sans-serif";
    ctx.fillText("RESTAURANT", centerX - 28, centerY - 15);

    if (selectedAddress) {
      const latDiff = selectedAddress.lat - restLat;
      const lngDiff = selectedAddress.lng - restLng;
      const pinX = Math.max(25, Math.min(w - 25, centerX + (lngDiff * 1400)));
      const pinY = Math.max(25, Math.min(h - 25, centerY - (latDiff * 1400)));

      // Dotted path
      ctx.strokeStyle = "#059669";
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(pinX, pinY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Customer Pin
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.arc(pinX, pinY, 7, 0, 2 * Math.PI);
      ctx.fill();

      // Outer halo
      ctx.strokeStyle = "rgba(5, 150, 105, 0.4)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pinX, pinY, 12, 0, 2 * Math.PI);
      ctx.stroke();

      // Tooltip
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(pinX - 30, pinY - 24, 60, 13);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 7px sans-serif";
      ctx.fillText(selectedAddress.label.toUpperCase(), pinX - 26, pinY - 15);
    }
  }, [selectedAddress]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToMenu}
          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-zinc-200 text-xs font-bold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 shadow-xs transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Transparent Final Total</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Address & Payment Selection */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. DELIVERY ADDRESS SELECTOR */}
          <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-zinc-950">Delivery Address</h3>
                  <p className="text-[11px] text-zinc-500">Select where your food will be dispatched</p>
                </div>
              </div>

              <button
                onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                className="cursor-pointer text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100/60 px-3 py-1.5 rounded-full transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </button>
            </div>

            {/* Address Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {addresses.map((addr) => {
                const isSelected = selectedAddress?.id === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr)}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all text-left ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/20 shadow-xs ring-2 ring-emerald-500/10"
                        : "border-zinc-200 hover:border-zinc-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs text-zinc-900 uppercase tracking-wider bg-zinc-100 px-2 py-0.5 rounded-md">
                        {addr.label}
                      </span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <p className="text-zinc-600 text-xs leading-relaxed line-clamp-2">
                      {addr.text}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Expandable Address Form */}
            {showNewAddressForm && (
              <div className="bg-zinc-50 rounded-2xl border border-zinc-200 p-4 space-y-3">
                <h4 className="font-bold text-xs text-zinc-800 uppercase tracking-wider">
                  Add New Bengaluru Locale
                </h4>

                <div>
                  <input
                    type="text"
                    placeholder="Search locale (e.g. Koramangala, Indiranagar)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white px-3.5 py-2 border border-zinc-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                  {suggestions.length > 0 && (
                    <div className="bg-white border border-zinc-200 rounded-xl mt-1.5 max-h-36 overflow-y-auto divide-y divide-zinc-100 shadow-md">
                      {suggestions.map((loc, idx) => (
                        <button
                          key={idx}
                          onClick={() => selectSuggestion(loc)}
                          className="cursor-pointer w-full text-left px-3 py-2 text-xs hover:bg-zinc-50 block truncate font-medium text-zinc-700"
                        >
                          {loc.label} - <span className="text-zinc-400">{loc.text}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <form onSubmit={handleCustomAddressSubmit} className="space-y-2.5">
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Label (e.g. Home)"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      className="col-span-1 bg-white px-3 py-2 border border-zinc-200 rounded-xl text-xs font-medium"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Flat, building, street..."
                      value={newText}
                      onChange={(e) => setNewText(e.target.value)}
                      className="col-span-2 bg-white px-3 py-2 border border-zinc-200 rounded-xl text-xs font-medium"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="cursor-pointer text-xs font-bold bg-zinc-950 text-white rounded-xl px-4 py-2 hover:bg-zinc-800 transition-colors"
                  >
                    Save Address
                  </button>
                </form>
              </div>
            )}

            {/* Interactive Location Map Pin Canvas */}
            <div className="rounded-2xl overflow-hidden border border-zinc-200">
              <canvas
                id="checkout-map-canvas"
                width={500}
                height={160}
                className="w-full bg-zinc-100 block"
              />
            </div>

          </div>

          {/* 2. PAYMENT METHOD SELECTION */}
          <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-zinc-950">Payment Method</h3>
                <p className="text-[11px] text-zinc-500">Secure simulated mock checkout for hackathon demo</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "UPI", label: "Instant UPI (GPay/PhonePe)", icon: Smartphone, badge: "Instant" },
                { id: "CARD", label: "Debit / Credit Card", icon: CreditCard, badge: "Secure" },
                { id: "NET_BANKING", label: "Net Banking", icon: Building },
                { id: "CASH", label: "Cash on Delivery", icon: Wallet }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setPaymentMethod(opt.id as any)}
                  className={`cursor-pointer p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    paymentMethod === opt.id
                      ? "border-emerald-600 bg-emerald-50/30 ring-2 ring-emerald-500/10 shadow-xs"
                      : "border-zinc-200 hover:border-zinc-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <opt.icon className="w-4 h-4 text-zinc-700" />
                    {opt.badge && (
                      <span className="text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                        {opt.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-zinc-900">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Transparent Order Summary & Place Order */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
          
          {/* Order Summary Card */}
          <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-md space-y-5">
            
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="font-extrabold text-base text-zinc-950">Order Summary</h3>
              <span className="text-xs font-mono font-bold text-zinc-400">
                {cartItems.length} {cartItems.length === 1 ? "dish" : "dishes"}
              </span>
            </div>

            {/* Items mini list */}
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1 divide-y divide-zinc-100">
              {cartItems.map(({ item, quantity }) => (
                <div key={item.id} className="pt-2 first:pt-0 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span className="font-extrabold text-emerald-700 font-mono">
                      {quantity}x
                    </span>
                    <span className="font-medium text-zinc-800 truncate">
                      {item.title}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-zinc-900 shrink-0">
                    ₹{item.price * quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Transparent Bill Breakdown */}
            {billing && (
              <div className="space-y-2.5 text-xs pt-3 border-t border-zinc-100">
                
                <div className="flex justify-between items-center text-zinc-600">
                  <span>Food Subtotal</span>
                  <span className="font-mono font-bold text-zinc-900">₹{billing.subtotal}</span>
                </div>

                <div className="flex justify-between items-center text-zinc-600">
                  <span className="flex items-center gap-1">
                    <Bike className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Delivery Charge</span>
                  </span>
                  <span className="font-mono font-bold text-zinc-900">₹{billing.deliveryFee}</span>
                </div>

                <div className="flex justify-between items-center text-emerald-700">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Platform / Convenience Fee</span>
                  </span>
                  <span className="font-bold font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px]">
                    ₹0 (FREE)
                  </span>
                </div>

                <div className="flex justify-between items-center text-emerald-700">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Service Fee</span>
                  </span>
                  <span className="font-bold font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px]">
                    ₹0 (ZERO)
                  </span>
                </div>

                {/* Final Total */}
                <div className="border-t-2 border-zinc-200 pt-4 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 block">
                      Final Total
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold">
                      Zero hidden charges
                    </span>
                  </div>
                  <span className="text-3xl font-black text-zinc-950 font-sans">
                    ₹{billing.grandTotal}
                  </span>
                </div>

              </div>
            )}

            {/* Transparency Assurance Message */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>FairByte Transparency Assurance</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-snug">
                "No surprises. You see your complete price before you pay."
              </p>
            </div>

            {/* Place Order Primary CTA */}
            <button
              onClick={() => onPlaceOrder(paymentMethod)}
              disabled={isProcessing || !billing || cartItems.length === 0 || !selectedAddress}
              className="cursor-pointer w-full bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/25 active:scale-98 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                  <span>SECURING ORDER...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Place Order • ₹{billing?.grandTotal}</span>
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </button>

            <div className="text-center text-[10px] text-zinc-400 flex items-center justify-center gap-1.5">
              <Lock className="w-3 h-3 text-zinc-400" />
              <span>Safe 256-bit encrypted checkout</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
