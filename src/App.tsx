import React, { useState, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { 
  Sparkles, 
  Search, 
  Leaf, 
  Pizza, 
  Star, 
  TrendingDown, 
  ShieldCheck, 
  Bike, 
  Heart,
  ChevronRight,
  ArrowRight,
  Flame,
  Clock,
  Compass
} from "lucide-react";

import { 
  Restaurant, 
  FoodItem, 
  CartItem, 
  BillingBreakdown, 
  Address, 
  Order 
} from "./types";

import { 
  MOCK_RESTAURANTS, 
  MOCK_MENU_ITEMS, 
  MOCK_ADDRESSES, 
  MOCK_DELIVERY_PARTNER,
  computeBilling 
} from "./mockData";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import BillComparisonHero from "./components/BillComparisonHero";
import TransparentPricingSection from "./components/TransparentPricingSection";
import RestaurantCard from "./components/RestaurantCard";
import RestaurantDetailView from "./components/RestaurantDetailView";
import CartSidebar from "./components/CartSidebar";
import CheckoutView from "./components/CheckoutView";
import OrderConfirmationView from "./components/OrderConfirmationView";
import DeliveryTrackingView from "./components/DeliveryTrackingView";

export default function App() {
  // Navigation View State
  const [currentView, setCurrentView] = useState<"home" | "restaurant" | "checkout" | "confirmation" | "tracking">("home");
  
  // Selected Contexts
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  // Address System
  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(MOCK_ADDRESSES[0]);

  // Global Home Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisineFilter, setSelectedCuisineFilter] = useState("All");
  const [onlyVegFilter, setOnlyVegFilter] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Toast Trigger Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Dynamic Billing Breakdown computation
  const billing: BillingBreakdown | null = useMemo(() => {
    if (cart.length === 0) return null;
    const subtotal = cart.reduce((acc, c) => acc + c.item.price * c.quantity, 0);
    const deliveryFee = selectedRestaurant?.deliveryFee || 48;
    return computeBilling(subtotal, deliveryFee);
  }, [cart, selectedRestaurant]);

  // Cart actions
  const handleAddToCart = (item: FoodItem, restaurant: Restaurant) => {
    // If cart has items from another restaurant, we can allow or set current
    setSelectedRestaurant(restaurant);

    setCart((prev) => {
      const match = prev.find(i => i.item.id === item.id);
      if (match) {
        return prev.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, restaurantId: restaurant.id, restaurantName: restaurant.name, quantity: 1 }];
    });

    showToast(`Added "${item.title}" to cart at ₹${item.price}`);
  };

  const handleRemoveFromCart = (item: FoodItem) => {
    setCart((prev) => {
      const match = prev.find(i => i.item.id === item.id);
      if (match && match.quantity > 1) {
        return prev.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.item.id !== item.id);
    });
  };

  const handleClearCart = () => {
    setCart([]);
    showToast("Cart cleared");
  };

  // Open a specific restaurant page
  const handleOpenRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setCurrentView("restaurant");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Address add
  const handleAddAddress = (newAddr: { label: string; text: string; lat: number; lng: number }) => {
    const created: Address = {
      id: "addr-" + Date.now(),
      label: newAddr.label,
      text: newAddr.text,
      lat: newAddr.lat,
      lng: newAddr.lng,
      isDefault: false
    };
    setAddresses(prev => [...prev, created]);
    setSelectedAddress(created);
    showToast(`Address "${newAddr.label}" saved`);
  };

  // Proceed to Checkout
  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;
    setIsCartOpen(false);
    setCurrentView("checkout");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Place Order Simulation
  const handlePlaceOrder = (paymentMethod: string) => {
    if (!billing || !selectedAddress || cart.length === 0) return;

    setIsProcessingCheckout(true);

    setTimeout(() => {
      const rest = selectedRestaurant || MOCK_RESTAURANTS[0];
      const newOrder: Order = {
        id: "FB-2048",
        restaurantId: rest.id,
        restaurantName: rest.name,
        restaurantImage: rest.image,
        items: [...cart],
        billing: billing,
        status: "PLACED",
        address: selectedAddress,
        deliveryPartner: MOCK_DELIVERY_PARTNER,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        estimatedDeliveryMin: "30–35 min",
        paymentMethod,
        paymentStatus: "PAID"
      };

      setActiveOrder(newOrder);
      setIsProcessingCheckout(false);
      setCart([]); // Clear cart
      setCurrentView("confirmation");
      window.scrollTo({ top: 0, behavior: "smooth" });
      showToast("Order placed successfully at true menu price!");
    }, 1200);
  };

  // Track Order
  const handleTrackOrder = () => {
    setCurrentView("tracking");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Return to Home
  const handleReturnHome = () => {
    setCurrentView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Scroll Helpers
  const scrollToSection = (sectionId: string) => {
    if (currentView !== "home") {
      setCurrentView("home");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Filtered Restaurant Discovery List
  const filteredRestaurants = useMemo(() => {
    return MOCK_RESTAURANTS.filter((r) => {
      // Search filter
      const matchesSearch = 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cuisine.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

      // Cuisine category filter
      let matchesCuisine = true;
      if (selectedCuisineFilter !== "All") {
        matchesCuisine = r.cuisine.some(c => c.toLowerCase() === selectedCuisineFilter.toLowerCase());
      }

      // Veg only
      let matchesVeg = true;
      if (onlyVegFilter) {
        matchesVeg = r.isPureVeg === true;
      }

      return matchesSearch && matchesCuisine && matchesVeg;
    });
  }, [searchQuery, selectedCuisineFilter, onlyVegFilter]);

  const totalCartCount = cart.reduce((acc, c) => acc + c.quantity, 0);
  const totalCartAmount = billing ? billing.grandTotal : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-zinc-900 font-sans antialiased">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-zinc-950 text-white border border-emerald-500/40 px-5 py-2.5 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Global Navbar */}
      <Navbar
        currentView={currentView}
        onNavigateHome={handleReturnHome}
        onNavigateHowItWorks={() => scrollToSection("how-fairbyte-works-section")}
        onNavigateComparison={() => scrollToSection("bill-comparison-section")}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
        cartTotal={totalCartAmount}
        addresses={addresses}
        selectedAddress={selectedAddress}
        onSelectAddress={setSelectedAddress}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Container Routed Views */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* VIEW 1: HOME PAGE */}
        {currentView === "home" && (
          <div className="space-y-12">
            
            {/* Hero Section */}
            <HeroSection
              onExploreClick={() => scrollToSection("restaurants-discovery-section")}
              onHowItWorksClick={() => scrollToSection("how-fairbyte-works-section")}
              onComparisonClick={() => scrollToSection("bill-comparison-section")}
            />

            {/* Hero Feature: Transparent Bill Comparison */}
            <BillComparisonHero
              onExploreClick={() => scrollToSection("restaurants-discovery-section")}
            />

            {/* Transparent Pricing 3 Pillars */}
            <TransparentPricingSection />

            {/* RESTAURANT DISCOVERY SECTION */}
            <section id="restaurants-discovery-section" className="space-y-6 pt-4">
              
              {/* Section Header with Filters */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200/80 pb-5">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold">
                    <Compass className="w-3.5 h-3.5" />
                    <span>VERIFIED RESTAURANT PRICES</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight font-sans">
                    Explore Partner Restaurants
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-500 font-normal">
                    Direct menu pricing guaranteed. Browse top rated local kitchens in Bengaluru.
                  </p>
                </div>

                {/* Cuisine & Veg Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setOnlyVegFilter(!onlyVegFilter)}
                    className={`cursor-pointer px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all ${
                      onlyVegFilter
                        ? "bg-emerald-600 text-white border-emerald-700 shadow-xs"
                        : "bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-50"
                    }`}
                  >
                    <Leaf className="w-3.5 h-3.5" />
                    <span>Pure Veg Only</span>
                  </button>

                  {["All", "North Indian", "South Indian", "Biryani", "Burgers", "Healthy"].map((cuisine) => (
                    <button
                      key={cuisine}
                      onClick={() => setSelectedCuisineFilter(cuisine)}
                      className={`cursor-pointer px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                        selectedCuisineFilter === cuisine
                          ? "bg-zinc-950 text-white shadow-xs"
                          : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                      }`}
                    >
                      {cuisine}
                    </button>
                  ))}
                </div>
              </div>

              {/* Restaurant Cards Grid */}
              {filteredRestaurants.length === 0 ? (
                <div className="bg-white border border-zinc-200/80 rounded-3xl p-12 text-center space-y-3">
                  <span className="text-4xl">🔍</span>
                  <h3 className="font-extrabold text-base text-zinc-900">No restaurants match your filter</h3>
                  <p className="text-xs text-zinc-500">
                    Try clearing your search query or selecting "All" cuisines.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCuisineFilter("All");
                      setOnlyVegFilter(false);
                    }}
                    className="cursor-pointer text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 mt-2"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredRestaurants.map((restaurant) => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                      onClick={() => handleOpenRestaurant(restaurant)}
                    />
                  ))}
                </div>
              )}

            </section>

          </div>
        )}

        {/* VIEW 2: RESTAURANT MENU PAGE */}
        {currentView === "restaurant" && selectedRestaurant && (
          <RestaurantDetailView
            restaurant={selectedRestaurant}
            menuItems={MOCK_MENU_ITEMS}
            cart={cart}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onBack={handleReturnHome}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}

        {/* VIEW 3: CHECKOUT PAGE */}
        {currentView === "checkout" && (
          <CheckoutView
            cartItems={cart}
            addresses={addresses}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
            billing={billing}
            onAddAddress={handleAddAddress}
            onPlaceOrder={handlePlaceOrder}
            onBackToMenu={() => {
              if (selectedRestaurant) setCurrentView("restaurant");
              else setCurrentView("home");
            }}
            isProcessing={isProcessingCheckout}
          />
        )}

        {/* VIEW 4: ORDER CONFIRMATION PAGE */}
        {currentView === "confirmation" && activeOrder && (
          <OrderConfirmationView
            order={activeOrder}
            onTrackOrder={handleTrackOrder}
            onBackToHome={handleReturnHome}
          />
        )}

        {/* VIEW 5: DELIVERY TRACKING PAGE */}
        {currentView === "tracking" && activeOrder && (
          <DeliveryTrackingView
            order={activeOrder}
            onBackToHome={handleReturnHome}
          />
        )}

      </main>

      {/* Slide-out Shopping Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <CartSidebar
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            items={cart}
            billing={billing}
            onIncrement={(item) => {
              const rest = selectedRestaurant || MOCK_RESTAURANTS[0];
              handleAddToCart(item, rest);
            }}
            onDecrement={handleRemoveFromCart}
            onClear={handleClearCart}
            onProceed={handleProceedToCheckout}
          />
        )}
      </AnimatePresence>

      {/* Floating Bottom Cart Bar on Mobile */}
      {cart.length > 0 && currentView !== "checkout" && (
        <div className="sm:hidden fixed bottom-4 left-4 right-4 z-30">
          <button
            onClick={() => setIsCartOpen(true)}
            className="cursor-pointer w-full bg-zinc-950 text-white p-4 rounded-2xl flex items-center justify-between shadow-2xl border border-emerald-500/40 active:scale-98"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-emerald-500 text-zinc-950 font-black text-xs flex items-center justify-center">
                {totalCartCount}
              </span>
              <div className="text-left">
                <span className="font-extrabold text-xs block leading-none">View FairByte Order</span>
                <span className="text-[10px] text-zinc-400">Zero surprise platform fees</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-sm text-emerald-400">
              <span>₹{totalCartAmount}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Modern Footer */}
      <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-900 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-base">
                  F
                </div>
                <span className="font-black text-xl text-white font-sans tracking-tight">
                  Fair<span className="text-emerald-500">Byte</span>
                </span>
              </div>
              <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
                "Your food. The restaurant's price. Fair delivery."
                <br />
                A transparent food-ordering frontend MVP built for honest pricing without hidden platform markups.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Restaurant Menu Price + Fair Delivery = Clear Final Price</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-white uppercase tracking-wider block">Demo Navigation</span>
              <ul className="space-y-1.5">
                <li>
                  <button onClick={handleReturnHome} className="cursor-pointer hover:text-emerald-400 transition-colors">
                    Explore Restaurants
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("bill-comparison-section")} className="cursor-pointer hover:text-emerald-400 transition-colors">
                    See The Price Difference
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("how-fairbyte-works-section")} className="cursor-pointer hover:text-emerald-400 transition-colors">
                    How FairByte Works
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsCartOpen(true)} className="cursor-pointer hover:text-emerald-400 transition-colors">
                    View Cart & Breakdown
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-white uppercase tracking-wider block">Hackathon MVP</span>
              <p className="text-zinc-500 leading-relaxed text-[11px]">
                Built as a high-fidelity frontend prototype. Demonstrates complete order-to-tracking flow with realistic mock data and real-time telemetry simulation.
              </p>
              <div className="pt-2 text-[10px] text-zinc-500 font-mono">
                FairByte v1.0.0 • Bengaluru, India
              </div>
            </div>

          </div>

          <div className="border-t border-zinc-900 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <p>© {new Date().getFullYear()} FairByte Technologies. All demo rights reserved.</p>
            <p className="font-mono text-[11px] text-emerald-500">
              Zero Platform Fees • Transparent Bills
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
