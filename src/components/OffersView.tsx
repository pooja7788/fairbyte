import React from "react";
import { ShieldCheck, ArrowRight } from "lucide-react";

interface OffersViewProps {
  onBrowseRestaurants?: () => void;
}

export default function OffersView({ onBrowseRestaurants }: OffersViewProps) {
  return (
    <div className="max-w-md mx-auto py-16 text-center space-y-4">
      <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto" />
      <h2 className="text-xl font-black text-zinc-950">Pure Menu Pricing</h2>
      <p className="text-xs text-zinc-500">
        RestoX does not inflate base prices or rely on gimmicky coupons. You always get direct restaurant menu pricing.
      </p>
      {onBrowseRestaurants && (
        <button
          onClick={onBrowseRestaurants}
          className="cursor-pointer inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold px-5 py-2.5 rounded-2xl text-xs"
        >
          <span>Browse Restaurants</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
