import React, { useState, useMemo } from "react";
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  Bike, 
  ShieldCheck, 
  Heart, 
  Search, 
  Leaf, 
  Tag, 
  ShoppingBag,
  Info
} from "lucide-react";
import { Restaurant, FoodItem, CartItem } from "../types";
import FoodCard from "./FoodCard";

interface RestaurantDetailViewProps {
  restaurant: Restaurant;
  menuItems: FoodItem[];
  cart: CartItem[];
  onAddToCart: (item: FoodItem, restaurant: Restaurant) => void;
  onRemoveFromCart: (item: FoodItem) => void;
  onBack: () => void;
  onOpenCart: () => void;
  dynamicDeliveryFee?: number;
  dynamicDistanceKm?: number;
}

export default function RestaurantDetailView({
  restaurant,
  menuItems,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onBack,
  onOpenCart,
  dynamicDeliveryFee,
  dynamicDistanceKm
}: RestaurantDetailViewProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [menuSearchQuery, setMenuSearchQuery] = useState("");
  const [onlyVegMenu, setOnlyVegMenu] = useState(false);

  // Filter items for this specific restaurant
  const restaurantItems = useMemo(() => {
    return menuItems.filter(item => item.restaurantId === restaurant.id);
  }, [menuItems, restaurant.id]);

  // Derived categories from active restaurant items
  const categories = useMemo(() => {
    const set = new Set<string>(["All", "Recommended"]);
    restaurantItems.forEach(i => set.add(i.category));
    return Array.from(set);
  }, [restaurantItems]);

  // Filtered menu based on search, category & veg toggles
  const filteredItems = useMemo(() => {
    return restaurantItems.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(menuSearchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(menuSearchQuery.toLowerCase());

      const matchesCategory = 
        selectedCategory === "All" ||
        (selectedCategory === "Recommended" && (item.isPopular || item.category === "Recommended")) ||
        item.category === selectedCategory;

      const matchesVeg = !onlyVegMenu || item.isVeg;

      return matchesSearch && matchesCategory && matchesVeg;
    });
  }, [restaurantItems, menuSearchQuery, selectedCategory, onlyVegMenu]);

  const totalCartCount = cart.reduce((acc, c) => acc + c.quantity, 0);
  const displayDeliveryFee = dynamicDeliveryFee !== undefined ? dynamicDeliveryFee : restaurant.deliveryFee;

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. TOP NAVIGATION / BACK BAR */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white hover:bg-zinc-100 border border-zinc-200 text-xs font-bold text-zinc-800 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Restaurants</span>
        </button>
      </div>

      {/* 2. RESTAURANT HERO BANNER & HEADER */}
      <div className="relative rounded-3xl overflow-hidden bg-white border border-zinc-200/80 shadow-md">
        
        {/* Banner Cover */}
        <div className="relative h-56 sm:h-72 w-full bg-zinc-900">
          <img
            src={restaurant.bannerImage}
            alt={restaurant.name}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs font-bold flex items-center gap-1.5 border border-white/15">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Direct Restaurant Menu Prices</span>
          </div>
        </div>

        {/* Restaurant Header Details */}
        <div className="p-6 sm:p-8 -mt-12 relative z-10 bg-white rounded-t-3xl border-t border-zinc-100 flex flex-col md:flex-row md:items-end justify-between gap-6">
          
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-4xl font-black text-zinc-950 tracking-tight font-sans">
                {restaurant.name}
              </h1>
              {restaurant.isPureVeg && (
                <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Leaf className="w-3 h-3" />
                  <span>Pure Veg</span>
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-zinc-500 font-medium max-w-xl">
              {restaurant.tagline}
            </p>

            <p className="text-xs text-zinc-400">
              📍 {restaurant.address} • {restaurant.cuisine.join(", ")}
            </p>
          </div>

          {/* Metrics Card */}
          <div className="flex items-center gap-3 shrink-0 bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200/80 text-xs">
            <div className="px-3 py-1 bg-emerald-100 text-emerald-900 rounded-xl font-black flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>{restaurant.rating}</span>
            </div>

            <div className="border-l border-zinc-200 pl-3">
              <span className="text-zinc-400 text-[10px] block uppercase font-bold">Distance</span>
              <span className="font-bold text-zinc-900">
                {dynamicDistanceKm !== undefined ? `${dynamicDistanceKm} km` : "Nearby"}
              </span>
            </div>

            <div className="border-l border-zinc-200 pl-3">
              <span className="text-zinc-400 text-[10px] block uppercase font-bold">Est. Time</span>
              <span className="font-bold text-zinc-900">{restaurant.deliveryTimeMin} mins</span>
            </div>
          </div>

        </div>

        {/* Transparent Pricing Ribbon */}
        <div className="px-6 py-3 bg-[#f3f7ee] border-t border-[#e2edd9] flex items-center gap-2 text-xs font-bold text-[#2d4023]">
          <ShieldCheck className="w-4 h-4 text-[#355029] shrink-0" />
          <span>True Menu Pricing Guaranteed • Transparent ₹7/km distance delivery • ₹0 Platform markup</span>
        </div>

      </div>

      {/* 3. MENU CONTROLS & STICKY CATEGORY BAR */}
      <div className="sticky top-18 z-30 bg-white/95 backdrop-blur-md border border-zinc-200/80 rounded-2xl p-3.5 shadow-sm space-y-3">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Menu Search */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={menuSearchQuery}
              onChange={(e) => setMenuSearchQuery(e.target.value)}
              placeholder={`Search in ${restaurant.name}...`}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Veg Only Toggle */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-2">
            <button
              onClick={() => setOnlyVegMenu(!onlyVegMenu)}
              className={`cursor-pointer px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                onlyVegMenu
                  ? "bg-emerald-600 text-white border-emerald-700 shadow-xs"
                  : "bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-50"
              }`}
            >
              <Leaf className="w-3.5 h-3.5" />
              <span>Veg Only</span>
            </button>

            {totalCartCount > 0 && (
              <button
                onClick={onOpenCart}
                className="cursor-pointer bg-zinc-950 text-white px-4 py-1.5 rounded-xl text-xs font-black flex items-center gap-2 shadow-xs"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                <span>View Cart ({totalCartCount})</span>
              </button>
            )}
          </div>

        </div>

        {/* Category Horizontal Scroll Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`cursor-pointer px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-zinc-950 text-white shadow-xs"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* 4. FOOD DISHES GRID */}
      {filteredItems.length === 0 ? (
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-12 text-center space-y-3">
          <span className="text-4xl">🍽️</span>
          <h3 className="font-extrabold text-base text-zinc-900">No dishes match your filter</h3>
          <p className="text-xs text-zinc-500">
            Try adjusting your search query or switching category filter.
          </p>
          <button
            onClick={() => {
              setMenuSearchQuery("");
              setSelectedCategory("All");
              setOnlyVegMenu(false);
            }}
            className="cursor-pointer text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 mt-2"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredItems.map((item) => {
            const cartEntry = cart.find(c => c.item.id === item.id);
            const quantity = cartEntry ? cartEntry.quantity : 0;

            return (
              <FoodCard
                key={item.id}
                item={item}
                restaurant={restaurant}
                quantityInCart={quantity}
                onAddToCart={onAddToCart}
                onRemoveFromCart={onRemoveFromCart}
              />
            );
          })}
        </div>
      )}

    </div>
  );
}
