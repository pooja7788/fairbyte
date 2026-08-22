import React from "react";
import { UtensilsCrossed, Bike, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

export default function TransparentPricingSection() {
  return (
    <section id="how-fairbyte-works-section" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>TRANSPARENT PRICING MODEL</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight font-sans">
          How RestoX Works
        </h2>
        <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
          A radically straightforward food delivery experience built on honesty, fairness, and complete bill clarity.
        </p>
      </div>

      {/* 3 Value Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Card 1: Restaurant Menu Price */}
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-7 shadow-sm hover:shadow-md transition-all duration-300 relative group flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-7 h-7" />
            </div>
            
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-amber-600 uppercase tracking-widest block">
                STEP 01
              </span>
              <h3 className="text-xl font-black text-zinc-950 tracking-tight">
                1. Restaurant Menu Price
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
              The food price shown comes directly from the restaurant's actual menu. No inflated item markups or hidden surcharges.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center gap-2 text-xs font-bold text-zinc-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Direct from kitchen menu</span>
          </div>
        </div>

        {/* Card 2: Transparent Delivery */}
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-7 shadow-sm hover:shadow-md transition-all duration-300 relative group flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Bike className="w-7 h-7" />
            </div>
            
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-emerald-600 uppercase tracking-widest block">
                STEP 02
              </span>
              <h3 className="text-xl font-black text-zinc-950 tracking-tight">
                2. Transparent Delivery
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
              The delivery cost is shown separately and directly calculated. No phantom handling fees or hidden delivery multipliers.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center gap-2 text-xs font-bold text-zinc-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Clearly itemized courier fee</span>
          </div>
        </div>

        {/* Card 3: Clear Final Price */}
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-7 shadow-sm hover:shadow-md transition-all duration-300 relative group flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-7 h-7" />
            </div>
            
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-teal-600 uppercase tracking-widest block">
                STEP 03
              </span>
              <h3 className="text-xl font-black text-zinc-950 tracking-tight">
                3. Clear Final Price
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
              Customers see the complete, honest price before placing their order. No surprise platform fees or unexpected cart jumps.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center gap-2 text-xs font-bold text-zinc-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Guaranteed zero surprises</span>
          </div>
        </div>

      </div>

    </section>
  );
}
