import React from "react";
import { Plus, Minus, Star, Heart, Clock, Sparkles } from "lucide-react";
import { FoodItem, Restaurant } from "../types";

export interface FoodCardProps {
  key?: React.Key;
  item: FoodItem;
  restaurant: Restaurant;
  quantityInCart: number;
  onAddToCart: (item: FoodItem, restaurant: Restaurant) => void;
  onRemoveFromCart: (item: FoodItem) => void;
}

export default function FoodCard({
  item,
  restaurant,
  quantityInCart,
  onAddToCart,
  onRemoveFromCart
}: FoodCardProps) {
  const isAvailable = item.isAvailable !== false;

  return (
    <div className={`bg-white rounded-3xl border border-[#eae4d8] hover:border-[#365229]/40 p-4 sm:p-5 flex gap-4 items-start justify-between shadow-2xs hover:shadow-md transition-all duration-200 group ${!isAvailable ? "opacity-75" : ""}`}>
      
      {/* Left Details */}
      <div className="space-y-2 flex-1 min-w-0">
        
        {/* Veg / Non-Veg Indicator & Badges */}
        <div className="flex items-center gap-2">
          <div
            className={`w-4 h-4 rounded-sm border flex items-center justify-center ${
              item.isVeg ? "border-[#2d4023]" : "border-red-600"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                item.isVeg ? "bg-[#2d4023]" : "bg-red-600"
              }`}
            />
          </div>

          {item.isPopular && (
            <span className="bg-[#edf4e8] text-[#24371d] text-[10px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1 border border-[#d2e2ca]">
              <Sparkles className="w-3 h-3 text-[#365029]" />
              <span>Bestseller</span>
            </span>
          )}

          {!isAvailable && (
            <span className="bg-red-100 text-red-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
              Sold Out
            </span>
          )}

          {item.prepTime && (
            <span className="text-[10px] text-[#788574] flex items-center gap-0.5 font-medium">
              <Clock className="w-3 h-3" />
              <span>{item.prepTime}</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h4 className="font-black text-[#1c271b] text-sm sm:text-base leading-snug group-hover:text-[#365229] transition-colors">
          {item.title}
        </h4>

        {/* Price & Rating */}
        <div className="flex items-center gap-3">
          <span className="font-black text-base sm:text-lg text-[#1a2618] font-sans">
            ₹{item.price}
          </span>

          <div className="flex items-center gap-1 text-[11px] font-black text-[#26371f] bg-[#eaf1e6] px-2 py-0.5 rounded-md">
            <Star className="w-3 h-3 fill-[#eab308] text-[#eab308]" />
            <span>{item.rating}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-[#63705f] line-clamp-2 leading-relaxed max-w-md font-medium">
          {item.description}
        </p>

      </div>

      {/* Right Image & Add Controls */}
      <div className="relative flex flex-col items-center shrink-0 w-28 sm:w-32">
        
        {/* Food Thumbnail */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-[#f4f0e8] border border-[#e4dcce] shadow-2xs">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {/* ADD / Quantity Selector Pill */}
        <div className="relative -mt-4 z-10 w-full px-2">
          {!isAvailable ? (
            <div className="w-full bg-[#ebe5d8] text-[#798574] text-center py-2 px-3 rounded-xl font-bold text-xs uppercase tracking-wider">
              Sold Out
            </div>
          ) : quantityInCart === 0 ? (
            <button
              onClick={() => onAddToCart(item, restaurant)}
              className="cursor-pointer w-full bg-white hover:bg-[#f6f2e8] text-[#2d4023] hover:text-[#1e2d17] border-2 border-[#2d4023] font-black text-xs py-2 px-3 rounded-xl shadow-md flex items-center justify-center gap-1 transition-all active:scale-95 uppercase tracking-wider"
            >
              <span>ADD</span>
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          ) : (
            <div className="w-full bg-[#2d4023] text-white rounded-xl shadow-md flex items-center justify-between p-1 font-mono">
              <button
                onClick={() => onRemoveFromCart(item)}
                className="cursor-pointer w-7 h-7 rounded-lg bg-[#223319] hover:bg-[#1a2713] flex items-center justify-center transition-colors active:scale-95"
                title="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5 stroke-[3]" />
              </button>

              <span className="text-xs font-black px-1 leading-none text-[#e8efe4]">
                {quantityInCart}
              </span>

              <button
                onClick={() => onAddToCart(item, restaurant)}
                className="cursor-pointer w-7 h-7 rounded-lg bg-[#223319] hover:bg-[#1a2713] flex items-center justify-center transition-colors active:scale-95"
                title="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
