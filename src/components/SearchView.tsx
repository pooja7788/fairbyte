import React, { useState, useMemo } from "react";
import { Search, Sparkles, Star, Clock, Bike, ArrowRight, Leaf, Heart, Plus, Minus } from "lucide-react";
import { Restaurant, FoodItem, CartItem } from "../types";
import FoodCard from "./FoodCard";
import RestaurantCard from "./RestaurantCard";

interface SearchViewProps {
  restaurants: Restaurant[];
  menuItems: FoodItem[];
  cart: CartItem[];
  onAddToCart: (item: FoodItem, restaurant: Restaurant) => void;
  onRemoveFromCart: (item: FoodItem) => void;
  onOpenRestaurant: (restaurant: Restaurant) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  favorites: string[];
  onToggleFavoriteRestaurant: (id: string) => void;
  onToggleFavoriteItem: (id: string) => void;
}

const POPULAR_SEARCHES = [
  "Biryani",
  "Butter Chicken",
  "Dosa",
  "Burger",
  "Dal Makhani",
  "Salad",
  "Lassi",
  "Tandoori"
];

export default function SearchView({
  restaurants,
  menuItems,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onOpenRestaurant,
  searchQuery,
  onSearchChange,
  favorites,
  onToggleFavoriteRestaurant,
  onToggleFavoriteItem
}: SearchViewProps) {
  const [activeTab, setActiveTab] = useState<"all" | "dishes" | "restaurants">("all");
  const [onlyVeg, setOnlyVeg] = useState(false);

  // Search Results Filtering
  const matchingRestaurants = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return restaurants.filter(r => {
      const matchText = 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cuisine.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
        r.tagline.toLowerCase().includes(searchQuery.toLowerCase());
      const matchVeg = !onlyVeg || r.isPureVeg;
      return matchText && matchVeg;
    });
  }, [restaurants, searchQuery, onlyVeg]);

  const matchingDishes = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return menuItems.filter(item => {
      const matchText = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchVeg = !onlyVeg || item.isVeg;
      return matchText && matchVeg;
    });
  }, [menuItems, searchQuery, onlyVeg]);

  const totalResultsCount = matchingRestaurants.length + matchingDishes.length;

  return (
    <div className="space-y-6 pb-20">
      
      {/* 1. SEARCH INPUT & FILTER BAR */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 sm:p-6 shadow-sm space-y-4">
        
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search for restaurants, dishes (biryani, pizza, dosa...)"
            autoFocus
            className="w-full bg-zinc-50 border border-zinc-200/80 rounded-2xl pl-12 pr-4 py-3.5 text-sm sm:text-base font-semibold text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-inner"
          />
          <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />

          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400 hover:text-zinc-700 bg-zinc-200/60 px-2.5 py-1 rounded-lg"
            >
              Clear
            </button>
          )}
        </div>

        {/* Tab Selectors & Veg Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "all"
                  ? "bg-zinc-950 text-white shadow-xs"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              All Results ({totalResultsCount})
            </button>

            <button
              onClick={() => setActiveTab("dishes")}
              className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "dishes"
                  ? "bg-zinc-950 text-white shadow-xs"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              Dishes ({matchingDishes.length})
            </button>

            <button
              onClick={() => setActiveTab("restaurants")}
              className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "restaurants"
                  ? "bg-zinc-950 text-white shadow-xs"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              Restaurants ({matchingRestaurants.length})
            </button>
          </div>

          <button
            onClick={() => setOnlyVeg(!onlyVeg)}
            className={`cursor-pointer px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              onlyVeg
                ? "bg-emerald-600 text-white border-emerald-700 shadow-xs"
                : "bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-50"
            }`}
          >
            <Leaf className="w-3.5 h-3.5" />
            <span>Veg Only</span>
          </button>
        </div>

        {/* Popular Searches Pills */}
        {!searchQuery && (
          <div className="space-y-2 pt-2 border-t border-zinc-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
              Popular Searches
            </span>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((query) => (
                <button
                  key={query}
                  onClick={() => onSearchChange(query)}
                  className="cursor-pointer px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-emerald-50 hover:text-emerald-800 text-zinc-700 text-xs font-bold border border-zinc-200/60 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>{query}</span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 2. RESULTS CONTAINER */}
      {searchQuery.trim() === "" ? (
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-12 text-center space-y-3">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto border border-emerald-100">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="font-black text-lg text-zinc-900">Find Food & Partner Kitchens</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Search for your favorite dishes or discover top local restaurants with transparent menu pricing.
          </p>
        </div>
      ) : totalResultsCount === 0 ? (
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-12 text-center space-y-3">
          <span className="text-4xl">🔍</span>
          <h3 className="font-extrabold text-base text-zinc-900">No results found for "{searchQuery}"</h3>
          <p className="text-xs text-zinc-500 max-w-xs mx-auto">
            Try searching for common terms like "Biryani", "Butter Chicken", "Dosa", or "Spice Route".
          </p>
          <div className="pt-2 flex justify-center gap-2">
            {POPULAR_SEARCHES.slice(0, 4).map(s => (
              <button
                key={s}
                onClick={() => onSearchChange(s)}
                className="cursor-pointer text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* RESTAURANTS RESULTS */}
          {(activeTab === "all" || activeTab === "restaurants") && matchingRestaurants.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-black text-zinc-950 flex items-center gap-2">
                <span>Matching Restaurants</span>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  {matchingRestaurants.length}
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchingRestaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    onClick={() => onOpenRestaurant(restaurant)}
                    isFavorite={favorites.includes(restaurant.id)}
                    onToggleFavorite={() => onToggleFavoriteRestaurant(restaurant.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* DISHES RESULTS */}
          {(activeTab === "all" || activeTab === "dishes") && matchingDishes.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-black text-zinc-950 flex items-center gap-2">
                <span>Matching Dishes & Food Items</span>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  {matchingDishes.length}
                </span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {matchingDishes.map((item) => {
                  const rest = restaurants.find(r => r.id === item.restaurantId) || restaurants[0];
                  const cartEntry = cart.find(c => c.item.id === item.id);
                  const quantity = cartEntry ? cartEntry.quantity : 0;
                  const isItemFav = favorites.includes(item.id);

                  return (
                    <FoodCard
                      key={item.id}
                      item={item}
                      restaurant={rest}
                      quantityInCart={quantity}
                      onAddToCart={onAddToCart}
                      onRemoveFromCart={onRemoveFromCart}
                      isFavorite={isItemFav}
                      onToggleFavorite={() => onToggleFavoriteItem(item.id)}
                    />
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
