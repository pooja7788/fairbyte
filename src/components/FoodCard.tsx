import React from "react";
import { Star, Plus, Minus, Clock, Sparkles } from "lucide-react";
import { FoodItem } from "../types";

export interface FoodCardProps {
  item: FoodItem;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  key?: React.Key;
}

export default function FoodCard({ item, quantity, onIncrement, onDecrement }: FoodCardProps) {
  const isAvailable = item.isAvailable;

  return (
    <div
      className={`group relative bg-white border border-zinc-200/80 hover:border-emerald-500/40 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col h-full ${
        !isAvailable ? "opacity-75 grayscale-[20%]" : ""
      }`}
    >
      {/* Food Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
        <img
          src={item.image}
          alt={item.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Dietary Indicator Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <span
            className={`px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow-sm backdrop-blur-xs ${
              item.isVeg
                ? "bg-white/95 text-emerald-800 border border-emerald-500/20"
                : "bg-white/95 text-red-800 border border-red-500/20"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                item.isVeg ? "bg-emerald-500" : "bg-red-500"
              }`}
            />
            {item.isVeg ? "Veg" : "Non-Veg"}
          </span>

          {item.isPopular && (
            <span className="bg-amber-500 text-zinc-950 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5 fill-current" />
              Bestseller
            </span>
          )}
        </div>

        {/* Star Rating Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-white/95 backdrop-blur-xs border border-zinc-200/60 text-zinc-900 font-extrabold text-[11px] px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-sm">
            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
            <span>{item.rating.toFixed(1)}</span>
          </span>
        </div>

        {/* Prep Time Pill */}
        {item.prepTime && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
              <Clock className="w-2.5 h-2.5 text-emerald-400" />
              <span>{item.prepTime}</span>
            </span>
          </div>
        )}

        {/* Out of stock overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-xs z-20">
            <span className="bg-white text-zinc-900 border border-zinc-200 font-bold text-xs uppercase tracking-wider py-1.5 px-4 rounded-xl shadow-lg">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow space-y-2">
        <div className="flex items-start justify-between gap-1.5">
          <h3 className="font-extrabold text-base text-zinc-950 tracking-tight leading-snug group-hover:text-emerald-700 transition-colors">
            {item.title}
          </h3>
        </div>

        <p className="text-zinc-500 text-xs leading-relaxed font-normal flex-grow line-clamp-2">
          {item.description}
        </p>

        {/* Price and Add Control */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-100 mt-2">
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider leading-none">
              Menu Price
            </span>
            <span className="text-lg font-black text-zinc-950 font-sans tracking-tight">
              ₹{item.price}
            </span>
          </div>

          <div className="relative">
            {isAvailable ? (
              quantity === 0 ? (
                <button
                  onClick={onIncrement}
                  className="cursor-pointer bg-white text-emerald-700 hover:bg-emerald-50 border-2 border-emerald-500/40 hover:border-emerald-600 text-xs font-black uppercase tracking-wider px-5 py-2 rounded-2xl transition-all active:scale-95 shadow-xs min-w-[90px] flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>ADD</span>
                </button>
              ) : (
                <div className="bg-emerald-600 border border-emerald-700 text-white flex items-center justify-between rounded-2xl px-2 py-1.5 min-w-[90px] shadow-sm shadow-emerald-600/20 transition-all">
                  <button
                    onClick={onDecrement}
                    className="cursor-pointer hover:bg-emerald-700 p-1 rounded-xl transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-extrabold leading-none select-none px-2 font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={onIncrement}
                    className="cursor-pointer hover:bg-emerald-700 p-1 rounded-xl transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              )
            ) : (
              <button
                disabled
                className="bg-zinc-100 text-zinc-400 border border-zinc-200 text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-xl cursor-not-allowed"
              >
                Sold Out
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
