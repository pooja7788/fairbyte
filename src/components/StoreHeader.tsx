import React from "react";
import { Search, Compass, Leaf, Pizza } from "lucide-react";

interface StoreHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  vegOnly: boolean | null; // null for both, true for veg, false for non-veg
  setVegOnly: (val: boolean | null) => void;
}

const CATEGORIES = ["All", "Main Course", "Snacks", "Beverages", "Desserts"];

export default function StoreHeader({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  vegOnly,
  setVegOnly
}: StoreHeaderProps) {
  return (
    <div className="sticky top-[72px] z-20 bg-white/70 backdrop-blur-xl border-b border-gray-100/80 py-4 px-6 md:px-8 space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Dynamic Search Box */}
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search premium butter chicken, paneer, lassi..."
            className="w-full bg-zinc-50 leading-none pl-11 pr-4 py-3 border border-zinc-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm font-medium text-zinc-800 placeholder-zinc-400 transition-all duration-200"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
            <Search className="w-4 h-4" />
          </div>
        </div>

        {/* Dietary Preference (Veg / Non-Veg) Quick Toggles */}
        <div className="flex gap-2">
          <button
            onClick={() => setVegOnly(vegOnly === true ? null : true)}
            className={`cursor-pointer px-4 py-2 border rounded-full text-xs font-bold leading-none flex items-center gap-1.5 transition-all duration-200 ${
              vegOnly === true
                ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/40 font-semibold scale-[1.03] shadow-sm shadow-emerald-500/5"
                : "bg-zinc-50 text-zinc-500 border-zinc-200 hover:border-zinc-300"
            }`}
          >
            <Leaf className="w-3.5 h-3.5" />
            <span>Pure Veg</span>
          </button>

          <button
            onClick={() => setVegOnly(vegOnly === false ? null : false)}
            className={`cursor-pointer px-4 py-2 border rounded-full text-xs font-bold leading-none flex items-center gap-1.5 transition-all duration-200 ${
              vegOnly === false
                ? "bg-red-500/10 text-red-700 border-red-500/40 font-semibold scale-[1.03] shadow-sm shadow-red-500/5"
                : "bg-zinc-50 text-zinc-500 border-zinc-200 hover:border-zinc-300"
            }`}
          >
            <Pizza className="w-3.5 h-3.5" />
            <span>Non-Veg Focus</span>
          </button>
        </div>

      </div>

      {/* Category Horizontal Filter Scroller */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-2 px-2 mask-horizontal smooth-scroll">
        <div className="flex gap-2">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`cursor-pointer px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? "bg-zinc-950 text-white shadow-md shadow-zinc-950/15"
                    : "bg-zinc-50 text-zinc-600 border border-transparent hover:bg-zinc-100"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
