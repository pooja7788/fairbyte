import React from "react";
import { Star, Clock, Bike, Leaf, Sparkles } from "lucide-react";
import { Restaurant } from "../types";

export interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
  key?: React.Key;
}

export default function RestaurantCard({ restaurant, onClick }: RestaurantCardProps) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer group bg-white border border-zinc-200/80 hover:border-emerald-500/50 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-1"
    >
      {/* Image Banner */}
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Dietary / Feature Badges */}
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          {restaurant.isPureVeg ? (
            <span className="bg-white/95 backdrop-blur-xs text-emerald-800 border border-emerald-500/20 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Pure Veg
            </span>
          ) : (
            <span className="bg-white/95 backdrop-blur-xs text-zinc-800 border border-zinc-200/60 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-xl shadow-sm">
              Multi-Cuisine
            </span>
          )}

          {restaurant.featured && (
            <span className="bg-amber-500 text-zinc-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-xl shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-current" />
              Popular
            </span>
          )}
        </div>

        {/* Rating Pill */}
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-white/95 backdrop-blur-xs text-zinc-950 border border-zinc-200/60 text-xs font-black px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-sm">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>{restaurant.rating.toFixed(1)}</span>
            <span className="text-[10px] text-zinc-400 font-normal">({restaurant.reviewCount})</span>
          </div>
        </div>

        {/* Delivery Time & Cost Banner */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-bold text-white z-10">
          <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-emerald-400" />
            <span>{restaurant.deliveryTimeMin} mins</span>
          </span>

          <span className="bg-emerald-950/80 backdrop-blur-md border border-emerald-400/30 text-emerald-300 px-2.5 py-1 rounded-lg flex items-center gap-1">
            <Bike className="w-3 h-3" />
            <span>₹{restaurant.deliveryFee} Delivery</span>
          </span>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 pointer-events-none" />
      </div>

      {/* Restaurant Info Body */}
      <div className="p-5 flex flex-col flex-grow space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-extrabold text-lg text-zinc-950 tracking-tight group-hover:text-emerald-700 transition-colors leading-snug">
            {restaurant.name}
          </h3>
          <span className="text-xs font-mono font-bold text-zinc-400 shrink-0">
            {restaurant.priceRange}
          </span>
        </div>

        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed font-normal flex-grow">
          {restaurant.tagline}
        </p>

        {/* Cuisines Tags */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-zinc-100">
          {restaurant.cuisine.slice(0, 3).map((c, i) => (
            <span
              key={i}
              className="text-[10px] font-semibold text-zinc-600 bg-zinc-100 px-2.5 py-0.5 rounded-md"
            >
              {c}
            </span>
          ))}
          {restaurant.cuisine.length > 3 && (
            <span className="text-[10px] text-zinc-400 py-0.5">
              +{restaurant.cuisine.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
