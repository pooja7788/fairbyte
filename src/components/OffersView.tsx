import React, { useState } from "react";
import { Tag, Sparkles, Copy, Check, ShieldCheck, ArrowRight, UtensilsCrossed } from "lucide-react";
import { Coupon } from "../types";
import { MOCK_COUPONS } from "../mockData";

interface OffersViewProps {
  onApplyCouponAndOrder: (coupon: Coupon) => void;
  onBrowseRestaurants: () => void;
}

export default function OffersView({
  onApplyCouponAndOrder,
  onBrowseRestaurants
}: OffersViewProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24">
      
      {/* Header */}
      <div className="text-center space-y-2 py-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold">
          <Tag className="w-3.5 h-3.5" />
          <span>EXCLUSIVE PROMOTIONS</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-zinc-950 font-sans tracking-tight">
          Transparent Savings & Offers
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
          Honest discounts with zero inflated base prices or sneaky service additions.
        </p>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_COUPONS.map((coupon) => (
          <div
            key={coupon.code}
            className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5 relative overflow-hidden"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase px-2.5 py-1 rounded-full font-mono">
                  {coupon.code}
                </span>
                <Sparkles className="w-4 h-4 text-emerald-500" />
              </div>

              <h3 className="font-black text-base text-zinc-950">
                {coupon.title}
              </h3>

              <p className="text-xs text-zinc-500 leading-relaxed">
                {coupon.description}
              </p>

              <p className="text-[11px] text-zinc-400">
                Applicable on orders above ₹{coupon.minOrder}
              </p>
            </div>

            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between gap-2">
              <button
                onClick={() => handleCopy(coupon.code)}
                className="cursor-pointer text-xs font-bold text-zinc-700 hover:text-zinc-950 flex items-center gap-1 bg-zinc-100 px-3 py-2 rounded-xl"
              >
                {copiedCode === coupon.code ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onApplyCouponAndOrder(coupon)}
                className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-zinc-950 text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1 shadow-xs active:scale-95"
              >
                <span>Use & Order</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Banner */}
      <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-base font-black text-white">Ready to order from your favorite kitchen?</h3>
          <p className="text-xs text-zinc-300">Browse verified local restaurants with direct menu prices.</p>
        </div>
        <button
          onClick={onBrowseRestaurants}
          className="cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black px-6 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95"
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Explore Restaurants</span>
        </button>
      </div>

    </div>
  );
}
