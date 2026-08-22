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
  isFavorite?: boolean;
  onToggleFavorite?: (itemId?: string, e?: React.MouseEvent) => void;
}

export default function FoodCard({
  item,
  restaurant,
  quantityInCart,
  onAddToCart,
  onRemoveFromCart,
  isFavorite = false,
  onToggleFavorite
}: FoodCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-zinc-200/80 hover:border-emerald-400/40 p-4 sm:p-5 flex gap-4 items-start justify-between shadow-xs hover:shadow-md transition-all duration-200 group">
      
      {/* Left Details */}
      <div className="space-y-2 flex-1 min-w-0">
        
        {/* Veg / Non-Veg Indicator & Badges */}
        <div className="flex items-center gap-2">
          <div
            className={`w-4 h-4 rounded-sm border flex items-center justify-center ${
              item.isVeg ? "border-emerald-600" : "border-red-600"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                item.isVeg ? "bg-emerald-600" : "bg-red-600"
              }`}
            />
          </div>

          {item.isPopular && (
            <span className="bg-amber-100 text-amber-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Bestseller</span>
            </span>
          )}

          {item.prepTime && (
            <span className="text-[10px] text-zinc-400 flex items-center gap-0.5">
              <Clock className="w-3 h-3" />
              <span>{item.prepTime}</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h4 className="font-extrabold text-zinc-950 text-sm sm:text-base leading-snug group-hover:text-emerald-700 transition-colors">
          {item.title}
        </h4>

        {/* Price & Rating */}
        <div className="flex items-center gap-3">
          <span className="font-black text-base sm:text-lg text-zinc-950 font-sans">
            ₹{item.price}
          </span>

          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
            <span>{item.rating}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed max-w-md">
          {item.description}
        </p>

      </div>

      {/* Right Image & Add Controls */}
      <div className="relative flex flex-col items-center shrink-0 w-28 sm:w-32">
        
        {/* Food Thumbnail */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200/60 shadow-xs">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(item.id, e);
            }}
            className="cursor-pointer absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-zinc-600 hover:text-red-500 shadow-xs active:scale-90 transition-all"
            title={isFavorite ? "Remove favorite" : "Favorite item"}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                isFavorite ? "fill-red-500 text-red-500" : "text-zinc-600"
              }`}
            />
          </button>
        </div>

        {/* ADD / Quantity Selector Pill */}
        <div className="relative -mt-4 z-10 w-full px-2">
          {quantityInCart === 0 ? (
            <button
              onClick={() => onAddToCart(item, restaurant)}
              className="cursor-pointer w-full bg-white hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800 border-2 border-emerald-600 font-black text-xs py-2 px-3 rounded-xl shadow-md flex items-center justify-center gap-1 transition-all active:scale-95 uppercase tracking-wider"
            >
              <span>ADD</span>
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          ) : (
            <div className="w-full bg-emerald-700 text-white rounded-xl shadow-md flex items-center justify-between p-1 font-mono">
              <button
                onClick={() => onRemoveFromCart(item)}
                className="cursor-pointer w-7 h-7 rounded-lg bg-emerald-800 hover:bg-emerald-900 flex items-center justify-center transition-colors active:scale-95"
                title="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5 stroke-[3]" />
              </button>

              <span className="text-xs font-black px-1 leading-none">
                {quantityInCart}
              </span>

              <button
                onClick={() => onAddToCart(item, restaurant)}
                className="cursor-pointer w-7 h-7 rounded-lg bg-emerald-800 hover:bg-emerald-900 flex items-center justify-center transition-colors active:scale-95"
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
