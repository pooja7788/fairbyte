import React from "react";
import { motion } from "motion/react";
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Receipt, 
  BadgePercent, 
  CheckCircle2,
  TrendingDown,
  Bike
} from "lucide-react";

interface HeroSectionProps {
  onExploreClick: () => void;
  onHowItWorksClick: () => void;
  onComparisonClick: () => void;
}

export default function HeroSection({
  onExploreClick,
  onHowItWorksClick,
  onComparisonClick
}: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-zinc-900 to-zinc-950 text-white pt-12 pb-16 md:pt-18 md:pb-24 px-4 sm:px-6 lg:px-8 rounded-3xl mx-2 sm:mx-4 my-4 shadow-2xl border border-emerald-900/30">
      {/* Glow Backdrops */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Heading & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Tag Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wide"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>THE TRANSPARENT FOOD DELIVERY PLATFORM</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight font-sans"
            >
              Great food. <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
                Fair prices.
              </span>
            </motion.h1>

            {/* Supporting Text */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-zinc-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed"
            >
              Order from your favorite restaurants using their actual menu prices, with transparent delivery costs and zero surprise platform markups.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2"
            >
              <button
                onClick={onExploreClick}
                className="cursor-pointer w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold px-7 py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/25 active:scale-95 text-sm"
              >
                <span>Explore Restaurants</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onComparisonClick}
                className="cursor-pointer w-full sm:w-auto bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 text-sm backdrop-blur-xs"
              >
                <TrendingDown className="w-4 h-4 text-emerald-400" />
                <span>See Price Difference</span>
              </button>

              <button
                onClick={onHowItWorksClick}
                className="cursor-pointer hidden md:flex text-zinc-400 hover:text-zinc-200 font-semibold px-4 py-3.5 text-xs transition-colors items-center gap-1.5"
              >
                <span>How FairByte Works</span>
              </button>
            </motion.div>

            {/* Value Checkpoints */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-zinc-400"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="font-medium text-zinc-300">Original Menu Prices</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="font-medium text-zinc-300">₹0 Platform Fee</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="font-medium text-zinc-300">Zero Surge Multipliers</span>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Hero Visual Card with Transparent Pricing formula */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-zinc-900/90 border border-emerald-500/20 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl space-y-5"
            >
              {/* Formula Badge */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white">The FairByte Formula</h3>
                    <p className="text-[11px] text-zinc-400">What you see is what you pay</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full font-bold">
                  100% TRANSPARENT
                </span>
              </div>

              {/* Mathematical Equation Visualizer */}
              <div className="space-y-3 font-mono text-xs">
                
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-zinc-300 font-sans font-medium">Restaurant Menu Price</span>
                  </div>
                  <span className="text-white font-bold">₹320</span>
                </div>

                <div className="flex items-center justify-center text-emerald-400 text-lg font-black -my-1">
                  +
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <Bike className="w-4 h-4 text-emerald-400" />
                    <span className="text-zinc-300 font-sans font-medium">Transparent Delivery</span>
                  </div>
                  <span className="text-white font-bold">₹48</span>
                </div>

                <div className="flex items-center justify-center text-emerald-400 text-lg font-black -my-1">
                  +
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-emerald-300">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="font-sans font-bold">Platform & Service Fees</span>
                  </div>
                  <span className="font-black bg-emerald-500/20 px-2 py-0.5 rounded-md text-[11px]">
                    ₹0 (ZERO)
                  </span>
                </div>

                <div className="border-t-2 border-emerald-500/30 pt-3 flex items-center justify-between">
                  <span className="text-zinc-300 font-sans font-extrabold text-sm">Final Clear Price</span>
                  <span className="text-2xl font-black text-emerald-400 font-sans">
                    ₹368
                  </span>
                </div>

              </div>

              {/* Instant Savings Highlight */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-300 block">
                    Typical Competitor Bill: ₹410
                  </span>
                  <p className="text-xs font-bold text-white">You save ₹42 on this single meal</p>
                </div>
                <button
                  onClick={onComparisonClick}
                  className="cursor-pointer text-[11px] font-bold text-emerald-300 hover:text-emerald-200 underline decoration-emerald-400 shrink-0 pl-2"
                >
                  Compare &rarr;
                </button>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
