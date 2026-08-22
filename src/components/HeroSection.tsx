import React from "react";
import { motion } from "motion/react";
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Bike,
  UtensilsCrossed,
  Tag,
  CheckCircle2
} from "lucide-react";

interface HeroSectionProps {
  onExploreClick: () => void;
  onOffersClick: () => void;
  onHowItWorksClick: () => void;
}

export default function HeroSection({
  onExploreClick,
  onOffersClick,
  onHowItWorksClick
}: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-zinc-900 to-zinc-950 text-white pt-10 pb-14 md:pt-16 md:pb-20 px-4 sm:px-6 lg:px-8 rounded-3xl mx-1 sm:mx-2 shadow-2xl border border-emerald-900/30">
      {/* Background Subtle Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Value Proposition */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            
            {/* Tag Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wide"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>THE HONEST FOOD ORDERING PLATFORM</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight font-sans"
            >
              Great food. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
                Fair prices.
              </span>
            </motion.h1>

            {/* Supporting Text */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base text-zinc-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed"
            >
              Order from your favorite restaurants using their menu prices, with transparent delivery costs.
            </motion.p>

            {/* Value Checkpoints */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-xs text-zinc-300"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero Menu Inflation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>₹0 Platform Fees</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Fair Courier Pay</span>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2"
            >
              <button
                onClick={onExploreClick}
                className="cursor-pointer w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black px-7 py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/25 active:scale-95 text-sm"
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>Explore Restaurants</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOffersClick}
                className="cursor-pointer w-full sm:w-auto bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 text-sm backdrop-blur-xs"
              >
                <Tag className="w-4 h-4 text-emerald-400" />
                <span>View Offers</span>
              </button>
            </motion.div>

          </div>

          {/* Right: Modern Visual Card */}
          <div className="lg:col-span-5 hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-zinc-900/90 border border-emerald-500/30 rounded-3xl p-6 shadow-2xl backdrop-blur-md space-y-4"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-sm">
                    F
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-xs">The FairByte Promise</h3>
                    <p className="text-[10px] text-emerald-400">Pure transparency at checkout</p>
                  </div>
                </div>
                <span className="bg-emerald-950 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded-md border border-emerald-800/60">
                  Direct Price
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-zinc-300">
                  <span>1. Restaurant In-Store Price</span>
                  <span className="font-mono text-white font-bold">100% Real</span>
                </div>
                <div className="flex justify-between items-center text-zinc-300">
                  <span>2. Transparent Distance Delivery</span>
                  <span className="font-mono text-white font-bold">Fixed & Clear</span>
                </div>
                <div className="flex justify-between items-center text-emerald-400 font-bold">
                  <span>3. Platform & Service Markups</span>
                  <span className="font-mono bg-emerald-500/20 px-2 py-0.5 rounded text-[10px]">
                    ₹0 (ZERO)
                  </span>
                </div>
              </div>

              <div className="bg-emerald-950/80 border border-emerald-800/40 p-3 rounded-2xl flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <p className="text-[11px] text-zinc-300 leading-snug">
                  Select your dishes from top partner kitchens and review your transparent bill before placing your order.
                </p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
