import React from "react";
import { ShieldCheck, CheckCircle2, Utensils, Bike, Sparkles } from "lucide-react";

export default function FairBytePromiseSection() {
  return (
    <section className="mt-16 mb-8 max-w-5xl mx-auto px-4">
      <div className="bg-white border border-[#eae4d8] rounded-[2.5rem] p-8 sm:p-10 lg:p-12 shadow-sm relative overflow-hidden">
        
        {/* Decorative subtle background gradient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#edf4e8]/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#f6f1e8]/80 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f0eae0] pb-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#2d4023] flex items-center justify-center text-white font-black text-base shadow-md shadow-[#2d4023]/20">
                <svg className="w-6 h-6 text-[#f3f7ee]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                  <line x1="6" y1="1" x2="6" y2="4" />
                  <line x1="10" y1="1" x2="10" y2="4" />
                  <line x1="14" y1="1" x2="14" y2="4" />
                </svg>
              </div>
              <div>
                <h3 className="font-black text-2xl text-[#1c271b] tracking-tight">
                  The FairByte Promise
                </h3>
                <p className="text-xs sm:text-sm text-[#616e5c] font-medium mt-0.5">
                  Pure transparency at checkout with zero hidden markups
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 self-start sm:self-auto bg-[#edf4e8] text-[#2c4021] text-xs font-black px-3.5 py-1.5 rounded-full border border-[#d2e2ca]">
              <Sparkles className="w-3.5 h-3.5 text-[#365029]" />
              <span>Direct In-Store Price</span>
            </div>
          </div>

          {/* 3 Core Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Pillar 1 */}
            <div className="bg-[#faf7f2] border border-[#ded5c5] rounded-3xl p-6 space-y-3 transition-transform hover:-translate-y-1">
              <div className="w-9 h-9 rounded-2xl bg-[#edf4e8] text-[#2d4023] flex items-center justify-center font-bold">
                <Utensils className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-[#717e6d] font-extrabold uppercase tracking-wider block">
                  Pillar 1
                </span>
                <h4 className="font-black text-base text-[#1c271b] mt-0.5">
                  Restaurant In-Store Price
                </h4>
              </div>
              <div className="pt-2 border-t border-[#ede6db] flex items-center justify-between">
                <span className="text-xs text-[#525f4d] font-medium">Menu inflation</span>
                <span className="font-mono font-black text-sm text-[#2d4023]">100% Real</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-[#faf7f2] border border-[#ded5c5] rounded-3xl p-6 space-y-3 transition-transform hover:-translate-y-1">
              <div className="w-9 h-9 rounded-2xl bg-[#edf4e8] text-[#2d4023] flex items-center justify-center font-bold">
                <Bike className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-[#717e6d] font-extrabold uppercase tracking-wider block">
                  Pillar 2
                </span>
                <h4 className="font-black text-base text-[#1c271b] mt-0.5">
                  Transparent Distance Delivery
                </h4>
              </div>
              <div className="pt-2 border-t border-[#ede6db] flex items-center justify-between">
                <span className="text-xs text-[#525f4d] font-medium">Direct courier rate</span>
                <span className="font-mono font-black text-sm text-[#2d4023]">Fixed (₹7/km)</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-[#edf4e8] border border-[#cde0c5] rounded-3xl p-6 space-y-3 transition-transform hover:-translate-y-1">
              <div className="w-9 h-9 rounded-2xl bg-[#2d4023] text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-[#365029] font-extrabold uppercase tracking-wider block">
                  Pillar 3
                </span>
                <h4 className="font-black text-base text-[#1c271b] mt-0.5">
                  Platform & Service Markups
                </h4>
              </div>
              <div className="pt-2 border-t border-[#c5dbbd] flex items-center justify-between">
                <span className="text-xs text-[#365029] font-bold">Convenience fees</span>
                <span className="font-mono font-black text-sm text-[#2d4023] bg-white px-2.5 py-0.5 rounded-lg">₹0 (ZERO)</span>
              </div>
            </div>

          </div>

          {/* Bottom Reassurance Banner */}
          <div className="bg-[#f7faf4] border border-[#dbe6d5] p-4 sm:p-5 rounded-2xl flex items-center gap-3.5">
            <CheckCircle2 className="w-5 h-5 text-[#355029] shrink-0 stroke-[2.5]" />
            <p className="text-xs sm:text-sm text-[#4f5c4a] font-medium leading-relaxed">
              Select your dishes from top partner kitchens and review your transparent bill before placing your order. No surprise surge markups at checkout.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
