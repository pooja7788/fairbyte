import React, { useState, useMemo } from "react";
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  Bike, 
  MapPin, 
  Search, 
  Leaf, 
  Pizza, 
  Sparkles,
  ShieldCheck,
  ShoppingBag
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
}

export default function RestaurantDetailView({
  restaurant,
  menuItems,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onBack,
  onOpenCart
}: RestaurantDetailViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [dietFilter, setDietFilter] = useState<"all" | "veg" | "non-veg">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Categories list based on restaurant's specific categories
  const categories = useMemo(() => {
    return ["All", ...restaurant.categories];
  }, [restaurant]);

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Must match restaurant
      if (item.restaurantId !== restaurant.id) return false;

      // Match category
      const matchesCat = selectedCategory === "All" || item.category === selectedCategory;

      // Match dietary
      let matchesDiet = true;
      if (dietFilter === "veg") matchesDiet = item.isVeg;
      if (dietFilter === "non-veg") matchesDiet = !item.isVeg;

      // Match search query
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCat && matchesDiet && matchesSearch;
    });
  }, [menuItems, restaurant.id, selectedCategory, dietFilter, searchQuery]);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-zinc-200 text-xs font-bold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 shadow-xs transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Restaurants</span>
        </button>

        {totalCartCount > 0 && (
          <button
            onClick={onOpenCart}
            className="cursor-pointer sm:hidden bg-zinc-900 text-white px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span>Cart ({totalCartCount})</span>
          </button>
        )}
      </div>

      {/* Hero Banner Card */}
      <div className="bg-white border border-zinc-200/80 rounded-3xl overflow-hidden shadow-sm relative">
        {/* Banner Image */}
        <div className="h-52 sm:h-64 lg:h-72 w-full relative overflow-hidden bg-zinc-900">
          <img
            src={restaurant.bannerImage || restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          
          {/* Transparent Badge in banner */}
          <div className="absolute top-4 right-4 bg-emerald-500/90 backdrop-blur-md text-zinc-950 font-black text-xs px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>FairByte Verified Menu Prices</span>
          </div>
        </div>

        {/* Restaurant Header Info */}
        <div className="p-6 sm:p-8 relative -mt-16 sm:-mt-20 z-10 space-y-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/80 shadow-lg space-y-4">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
                    {restaurant.name}
                  </h1>
                  {restaurant.isPureVeg && (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-500/20 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                      <Leaf className="w-3 h-3" />
                      Pure Veg
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 font-normal">
                  {restaurant.tagline}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{restaurant.address}</span>
                </div>
              </div>

              {/* Key Metrics Pill Box */}
              <div className="flex items-center gap-3 self-start md:self-auto bg-zinc-50 border border-zinc-200/80 p-3 rounded-2xl shrink-0">
                <div className="text-center px-3 border-r border-zinc-200">
                  <div className="flex items-center gap-1 font-black text-sm text-zinc-900 justify-center">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{restaurant.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-medium">{restaurant.reviewCount}+ ratings</span>
                </div>

                <div className="text-center px-3 border-r border-zinc-200">
                  <div className="flex items-center gap-1 font-black text-sm text-zinc-900 justify-center">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{restaurant.deliveryTimeMin}m</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-medium">Delivery ETA</span>
                </div>

                <div className="text-center px-3">
                  <div className="flex items-center gap-1 font-black text-sm text-emerald-700 justify-center font-mono">
                    <Bike className="w-3.5 h-3.5" />
                    <span>₹{restaurant.deliveryFee}</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-medium">Fair Delivery</span>
                </div>
              </div>
            </div>

            {/* Transparency guarantee callout */}
            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-600">
              <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                No surprise platform charges. You pay direct menu price + ₹{restaurant.deliveryFee} delivery.
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* Menu Filter & Search Bar */}
      <div className="bg-white border border-zinc-200/80 rounded-3xl p-5 shadow-xs space-y-4 sticky top-[76px] z-30 backdrop-blur-md bg-white/95">
        
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search inside menu */}
          <div className="relative w-full sm:max-w-xs">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in this menu..."
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-9 pr-3 py-2 text-xs font-medium text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Dietary filters */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setDietFilter("all")}
              className={`cursor-pointer px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                dietFilter === "all"
                  ? "bg-zinc-950 text-white shadow-xs"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              All Items
            </button>

            <button
              onClick={() => setDietFilter(dietFilter === "veg" ? "all" : "veg")}
              className={`cursor-pointer px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                dietFilter === "veg"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
              }`}
            >
              <Leaf className="w-3 h-3" />
              <span>Pure Veg</span>
            </button>

            <button
              onClick={() => setDietFilter(dietFilter === "non-veg" ? "all" : "non-veg")}
              className={`cursor-pointer px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                dietFilter === "non-veg"
                  ? "bg-red-600 text-white shadow-xs"
                  : "bg-red-50 text-red-800 border border-red-200 hover:bg-red-100"
              }`}
            >
              <Pizza className="w-3 h-3" />
              <span>Non-Veg</span>
            </button>
          </div>
        </div>

        {/* Category Horizontal Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 smooth-scroll">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`cursor-pointer px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/15"
                    : "bg-zinc-100/80 text-zinc-600 hover:bg-zinc-200/80"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

      </div>

      {/* Menu Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-12 text-center space-y-3">
          <span className="text-4xl">🍽️</span>
          <h3 className="font-extrabold text-base text-zinc-900">No dishes match your filter</h3>
          <p className="text-xs text-zinc-500">
            Try adjusting your search query or dietary preferences.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setDietFilter("all");
              setSearchQuery("");
            }}
            className="cursor-pointer text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 mt-2"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const cartItem = cart.find(c => c.item.id === item.id);
            const quantity = cartItem ? cartItem.quantity : 0;
            return (
              <FoodCard
                key={item.id}
                item={item}
                quantity={quantity}
                onIncrement={() => onAddToCart(item, restaurant)}
                onDecrement={() => onRemoveFromCart(item)}
              />
            );
          })}
        </div>
      )}

    </div>
  );
}
