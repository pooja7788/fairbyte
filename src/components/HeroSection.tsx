import React from "react";
import { motion } from "motion/react";
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Bike,
  UtensilsCrossed,
  CheckCircle2,
  Play
} from "lucide-react";

interface HeroSectionProps {
  onExploreClick: () => void;
  onHowItWorksClick: () => void;
}

export default function HeroSection({
  onExploreClick,
  onHowItWorksClick
}: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden bg-[#fbf9f4] text-[#1c271b] pt-10 pb-12 md:pt-14 md:pb-16 px-6 sm:px-8 lg:px-12 rounded-[2.5rem] border border-[#ebe4d7] shadow-xs">
      
      {/* Background Decorative Food Flatlay Image on Right Corner (Pinterest reference) */}
      <div className="absolute -top-12 -right-12 w-96 h-96 md:w-[480px] md:h-[480px] rounded-full overflow-hidden opacity-90 pointer-events-none hidden lg:block">
        <img 
          src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=900" 
          alt="Delicious food platter" 
          className="w-full h-full object-cover object-center filter saturate-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#fbf9f4]/40 to-[#fbf9f4]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Value Proposition (Pinterest styling) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Tag Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e8efe4] border border-[#d3e2cc] text-[#2b3e21] text-xs font-black tracking-wide"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#355029]" />
              <span>THE HONEST FOOD ORDERING PLATFORM</span>
            </motion.div>

            {/* Headline */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-1"
            >
              <h1 className="text-5xl sm:text-6xl lg:text-[68px] font-black tracking-tight text-[#1a2618] leading-[1.08] font-sans">
                Great food. <br />
                <span className="text-[#365229]">
                  Fair prices.
                </span>
              </h1>
            </motion.div>

            {/* Supporting Text */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base text-[#5c6857] max-w-xl font-medium leading-relaxed"
            >
              Order from your favorite restaurants using their menu prices, with transparent delivery costs.
            </motion.p>

            {/* Value Checkpoints */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex flex-wrap items-center gap-4 sm:gap-6 pt-1 text-xs sm:text-sm font-bold text-[#2b3c25]"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#39552b] stroke-[2.5]" />
                <span>Zero Menu Inflation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#39552b] stroke-[2.5]" />
                <span>₹0 Platform Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#39552b] stroke-[2.5]" />
                <span>Fair Courier Pay</span>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-3.5 pt-2"
            >
              <button
                onClick={onExploreClick}
                className="cursor-pointer w-full sm:w-auto bg-[#365029] hover:bg-[#2b4120] text-white font-extrabold px-8 py-4 rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-[#365029]/25 active:scale-95 text-sm"
              >
                <span>Explore Restaurants</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                onClick={onHowItWorksClick}
                className="cursor-pointer w-full sm:w-auto bg-white hover:bg-[#f6f2e8] border border-[#ded5c5] text-[#25351f] font-bold px-7 py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 text-sm shadow-2xs"
              >
                <Play className="w-3.5 h-3.5 fill-[#365029] text-[#365029]" />
                <span>How FairByte Works</span>
              </button>
            </motion.div>

          </div>

          {/* Right: Pinterest Food Platter Visual Showcase */}
          <div className="lg:col-span-5 hidden lg:flex justify-end items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative w-80 h-80 rounded-full p-2 bg-gradient-to-tr from-[#365029]/20 via-[#e4ede0] to-white shadow-xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800" 
                alt="Fresh prepared dishes" 
                className="w-full h-full object-cover rounded-full filter saturate-[1.15] shadow-inner"
              />
              <div className="absolute -bottom-2 -left-2 bg-white/95 backdrop-blur-md border border-[#e4dcce] px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#365029] animate-pulse" />
                <span className="text-xs font-black text-[#1c271b]">100% In-Store Pricing</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
