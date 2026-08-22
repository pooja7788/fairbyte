import React from "react";
import { Star, Clock, Bike, Heart, Leaf, ShieldCheck } from "lucide-react";
import { Restaurant } from "../types";

export interface RestaurantCardProps {
  key?: React.Key;
  restaurant: Restaurant;
  onClick: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (restaurantId: string, e?: React.MouseEvent) => void;
}

export default function RestaurantCard({
  restaurant,
  onClick,
  isFavorite = false,
  onToggleFavorite
}: RestaurantCardProps) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer group bg-white rounded-3xl border border-zinc-200/80 hover:border-emerald-500/40 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
    >
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-zinc-100">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay for bottom text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(restaurant.id, e);
          }}
          className="cursor-pointer absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-zinc-700 hover:text-red-600 transition-colors shadow-sm active:scale-90"
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? "fill-red-500 text-red-500" : "text-zinc-600"
            }`}
          />
        </button>

        {/* Pure Veg Badge */}
        {restaurant.isPureVeg && (
          <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
            <Leaf className="w-3 h-3" />
            <span>Pure Veg</span>
          </div>
        )}

        {/* Delivery & Price Range Overlay on Image bottom */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-bold">
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>{restaurant.deliveryTimeMin} mins</span>
          </div>

          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
            <Bike className="w-3.5 h-3.5 text-emerald-400" />
            <span>₹{restaurant.deliveryFee} delivery</span>
          </div>
        </div>
      </div>

      {/* Info Body */}
      <div className="p-5 flex-grow flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-black text-zinc-950 text-base group-hover:text-emerald-700 transition-colors tracking-tight line-clamp-1">
              {restaurant.name}
            </h3>

            {/* Rating pill */}
            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-900 border border-emerald-200/80 px-2 py-0.5 rounded-lg text-xs font-black shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{restaurant.rating}</span>
            </div>
          </div>

          {/* Cuisines */}
          <p className="text-xs text-zinc-500 line-clamp-1">
            {restaurant.cuisine.join(" • ")}
          </p>

          {/* Tagline */}
          <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
            {restaurant.tagline}
          </p>
        </div>

        {/* Bottom Menu Guarantee Tag */}
        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500 font-medium">
          <div className="flex items-center gap-1 text-emerald-700 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>True Menu Price</span>
          </div>
          <span className="font-mono font-bold text-zinc-700">{restaurant.priceRange}</span>
        </div>

      </div>
    </div>
  );
}
