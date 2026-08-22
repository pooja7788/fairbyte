import React from "react";
import { Star, Clock, Bike, Leaf, ShieldCheck } from "lucide-react";
import { Restaurant } from "../types";

export interface RestaurantCardProps {
  key?: React.Key;
  restaurant: Restaurant;
  onClick: () => void;
  dynamicDeliveryFee?: number;
  dynamicDistanceKm?: number;
}

export default function RestaurantCard({
  restaurant,
  onClick,
  dynamicDeliveryFee,
  dynamicDistanceKm
}: RestaurantCardProps) {
  const displayDeliveryFee = dynamicDeliveryFee !== undefined ? dynamicDeliveryFee : restaurant.deliveryFee;

  return (
    <div
      onClick={onClick}
      className="cursor-pointer group bg-white rounded-[1.75rem] border border-[#eae3d5] hover:border-[#365229]/50 shadow-2xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
    >
      {/* Image Container */}
      <div className="relative h-52 w-full overflow-hidden bg-[#f4f0e6]">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay for bottom text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

        {/* Pure Veg Badge */}
        {restaurant.isPureVeg && (
          <div className="absolute top-3 left-3 bg-[#2d4023] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
            <Leaf className="w-3 h-3 text-[#bfe0b0]" />
            <span>Pure Veg</span>
          </div>
        )}

        {/* Rating badge on top right */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#fbf9f4]/95 text-[#24351d] backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-black shadow-md border border-white/40">
          <Star className="w-3.5 h-3.5 fill-[#eab308] text-[#eab308]" />
          <span>{restaurant.rating}</span>
        </div>

        {/* Distance & Delivery Time Overlay on Image bottom */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-bold">
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
            <Clock className="w-3 h-3 text-[#bde0ad]" />
            <span>{restaurant.deliveryTimeMin} mins</span>
          </div>

          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
            <Bike className="w-3 h-3 text-[#bde0ad]" />
            <span>
              {dynamicDistanceKm !== undefined ? `${dynamicDistanceKm} km away` : "Nearby"}
            </span>
          </div>
        </div>
      </div>

      {/* Info Body */}
      <div className="p-5 flex-grow flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          <h3 className="font-black text-[#1c271b] text-base group-hover:text-[#365229] transition-colors tracking-tight line-clamp-1">
            {restaurant.name}
          </h3>

          {/* Cuisines */}
          <p className="text-xs text-[#63705f] line-clamp-1 font-medium">
            {restaurant.cuisine.join(" • ")}
          </p>

          {/* Tagline */}
          <p className="text-[11px] text-[#828f7f] line-clamp-2 leading-relaxed">
            {restaurant.tagline}
          </p>
        </div>

        {/* Bottom Menu Guarantee Tag */}
        <div className="pt-2.5 border-t border-[#f0eae0] flex items-center justify-between text-[11px] text-[#63705f] font-medium">
          <div className="flex items-center gap-1 text-[#365229] font-bold">
            <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>True Menu Price</span>
          </div>
          <span className="font-mono font-bold text-[#354332] bg-[#f4f0e8] px-2 py-0.5 rounded-md text-[10px]">
            {restaurant.priceRange}
          </span>
        </div>

      </div>
    </div>
  );
}
