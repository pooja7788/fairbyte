import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  TrendingDown, 
  CheckCircle2, 
  XCircle, 
  Info, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

interface BillComparisonHeroProps {
  onExploreClick?: () => void;
}

export default function BillComparisonHero({ onExploreClick }: BillComparisonHeroProps) {
  // Preset order amounts or slider for live interactive demonstration
  const [orderAmount, setOrderAmount] = useState<number>(320);

  // Calculate traditional fees for comparison
  const traditionalFood = orderAmount;
  const traditionalPlatformFee = 15;
  const traditionalDeliveryFee = 45;
  const traditionalPackagingAndService = Math.round(orderAmount * 0.09) + 15;
  const traditionalSurge = Math.round(orderAmount * 0.05);
  const traditionalAdditionalCharges = traditionalPlatformFee + traditionalDeliveryFee + traditionalPackagingAndService + traditionalSurge;
  const traditionalTotal = traditionalFood + traditionalAdditionalCharges;

  // Calculate RestoX
  const fairByteFood = orderAmount;
  const fairByteCGST = Math.round((orderAmount * 0.025) * 100) / 100;
  const fairByteSGST = Math.round((orderAmount * 0.025) * 100) / 100;
  const fairByteDelivery = 48;
  const fairBytePlatformFee = 0;
  const fairByteTotal = Math.round((fairByteFood + fairByteCGST + fairByteSGST + fairByteDelivery + fairBytePlatformFee) * 100) / 100;

  const savings = Math.round((traditionalTotal - fairByteTotal) * 100) / 100;
  const savingsPercent = Math.round((savings / traditionalTotal) * 100);

  return (
    <section id="bill-comparison-section" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-700 text-xs font-extrabold uppercase tracking-wider">
          <TrendingDown className="w-3.5 h-3.5" />
          <span>HERO TRANSPARENCY COMPARISON</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight font-sans">
          See the difference
        </h2>
        <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
          Compare how your bill is calculated on standard delivery apps versus RestoX's transparent restaurant pricing model.
        </p>
      </div>

      {/* Interactive Order Value Selector */}
      <div className="max-w-xl mx-auto mb-10 bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-zinc-700">
          <span>Simulate Order Value (Restaurant Menu Price):</span>
          <span className="font-mono text-base text-emerald-600 font-extrabold">₹{orderAmount}</span>
        </div>

        <input
          type="range"
          min={150}
          max={1200}
          step={10}
          value={orderAmount}
          onChange={(e) => setOrderAmount(Number(e.target.value))}
          className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
        />

        <div className="flex justify-between items-center text-[10px] text-zinc-400 font-mono">
          <button 
            onClick={() => setOrderAmount(180)}
            className={`cursor-pointer px-2.5 py-1 rounded-lg border transition-all ${orderAmount === 180 ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-bold" : "border-zinc-200 hover:bg-zinc-50"}`}
          >
            ₹180 Quick Snack
          </button>
          <button 
            onClick={() => setOrderAmount(320)}
            className={`cursor-pointer px-2.5 py-1 rounded-lg border transition-all ${orderAmount === 320 ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-bold" : "border-zinc-200 hover:bg-zinc-50"}`}
          >
            ₹320 Dinner (Default)
          </button>
          <button 
            onClick={() => setOrderAmount(650)}
            className={`cursor-pointer px-2.5 py-1 rounded-lg border transition-all ${orderAmount === 650 ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-bold" : "border-zinc-200 hover:bg-zinc-50"}`}
          >
            ₹650 Family Meal
          </button>
        </div>
      </div>

      {/* Main Dual Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto items-stretch">
        
        {/* CARD 1: Traditional Delivery Example */}
        <div className="bg-white border-2 border-red-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-red-50 text-red-700 text-[10px] font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-bl-2xl border-b border-l border-red-200/50 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-red-500" />
            <span>Traditional Delivery</span>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-black text-zinc-900 tracking-tight">
                Traditional delivery example
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Standard industry model with stacked convenience & platform charges
              </p>
            </div>

            {/* Line Items */}
            <div className="space-y-3 text-xs border-t border-b border-zinc-100 py-4">
              <div className="flex justify-between items-center text-zinc-700">
                <span>Food (Menu Price)</span>
                <span className="font-semibold text-zinc-900 font-mono">₹{traditionalFood.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-zinc-600 pl-2 border-l-2 border-red-200">
                <span className="flex items-center gap-1 text-zinc-500">
                  Platform Fee
                </span>
                <span className="font-mono text-red-600 font-medium">+₹{traditionalPlatformFee.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-zinc-600 pl-2 border-l-2 border-red-200">
                <span className="flex items-center gap-1 text-zinc-500">
                  Standard Delivery Charge
                </span>
                <span className="font-mono text-red-600 font-medium">+₹{traditionalDeliveryFee.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-zinc-600 pl-2 border-l-2 border-red-200">
                <span className="flex items-center gap-1 text-zinc-500">
                  Packaging & Service Fee
                </span>
                <span className="font-mono text-red-600 font-medium">+₹{traditionalPackagingAndService.toFixed(2)}</span>
              </div>

              {traditionalSurge > 0 && (
                <div className="flex justify-between items-center text-zinc-600 pl-2 border-l-2 border-red-200">
                  <span className="flex items-center gap-1 text-zinc-500">
                    Surge / High Demand Fee
                  </span>
                  <span className="font-mono text-red-600 font-medium">+₹{traditionalSurge.toFixed(2)}</span>
                </div>
              )}

              <div className="pt-2 flex justify-between items-center font-bold text-red-700 bg-red-50/60 p-2.5 rounded-xl">
                <span>Total Additional Charges</span>
                <span className="font-mono font-extrabold text-sm">₹{traditionalAdditionalCharges.toFixed(2)}</span>
              </div>
            </div>

            {/* Total Block */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">Total You Pay</span>
                <span className="text-2xl font-black text-zinc-900 font-sans">
                  ₹{traditionalTotal.toFixed(2)}
                </span>
              </div>
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-xl">
                Stacked markups
              </span>
            </div>
          </div>
        </div>

        {/* CARD 2: RestoX (Hero Winner) */}
        <div className="bg-gradient-to-br from-emerald-950 via-zinc-900 to-zinc-950 border-2 border-emerald-500 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-500 text-zinc-950 text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-bl-2xl shadow-md flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>RestoX Transparent</span>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                <span>RestoX</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </h3>
              <p className="text-xs text-emerald-300 mt-1 font-medium">
                Restaurant menu price + transparent GST + delivery = zero surprise charges
              </p>
            </div>

            {/* Line Items */}
            <div className="space-y-2.5 text-xs border-t border-b border-zinc-800 py-4">
              <div className="flex justify-between items-center text-zinc-200">
                <span>Food subtotal</span>
                <span className="font-semibold text-white font-mono">₹{fairByteFood.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-zinc-300 pl-2 border-l-2 border-emerald-500">
                <span>CGST (2.5%)</span>
                <span className="font-mono text-emerald-400 font-bold">₹{fairByteCGST.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-zinc-300 pl-2 border-l-2 border-emerald-500">
                <span>SGST (2.5%)</span>
                <span className="font-mono text-emerald-400 font-bold">₹{fairByteSGST.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-emerald-300 pl-2 border-l-2 border-emerald-500">
                <span className="flex items-center gap-1 font-bold">
                  Platform fee
                </span>
                <span className="font-mono text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded">₹0.00</span>
              </div>

              <div className="flex justify-between items-center text-zinc-300 pl-2 border-l-2 border-emerald-500">
                <span className="flex items-center gap-1">
                  Delivery
                </span>
                <span className="font-mono text-emerald-400 font-bold">₹{fairByteDelivery.toFixed(2)}</span>
              </div>

              <div className="pt-2 flex justify-between items-center font-bold text-emerald-300 bg-emerald-900/30 p-2.5 rounded-xl border border-emerald-500/20">
                <span>Total</span>
                <span className="font-mono font-extrabold text-sm text-emerald-400">₹{fairByteTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Total Block & Savings Badge */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">Final Total</span>
                  <span className="text-3xl font-black text-emerald-400 font-sans">
                    ₹{fairByteTotal.toFixed(2)}
                  </span>
                </div>
                
                {/* Savings Pill */}
                <div className="bg-emerald-500 text-zinc-950 px-4 py-2 rounded-2xl text-right shadow-lg shadow-emerald-500/30 animate-pulse">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider block leading-none">
                    You Save
                  </span>
                  <span className="text-lg font-black font-sans leading-tight">
                    ₹{savings.toFixed(2)}
                  </span>
                </div>
              </div>

              {onExploreClick && (
                <button
                  onClick={onExploreClick}
                  className="cursor-pointer w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black py-3 rounded-xl flex items-center justify-center gap-2 text-xs transition-all active:scale-95"
                >
                  <span>Order at Restaurant Price</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Illustrative Disclaimer Note */}
      <div className="mt-8 text-center max-w-2xl mx-auto flex items-center justify-center gap-2 text-zinc-400 text-[11px] bg-zinc-50 border border-zinc-200/80 p-3 rounded-2xl">
        <Info className="w-4 h-4 text-zinc-500 shrink-0" />
        <p>
          <strong>Illustrative comparison:</strong> Shows standard delivery platform markups vs RestoX's zero-hidden-fee transparent model. Taxes remain compliant with applicable statutory standards.
        </p>
      </div>

    </section>
  );
}
