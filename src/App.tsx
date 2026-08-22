import React, { useState, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { 
  Sparkles, 
  Search, 
  Leaf, 
  Star, 
  TrendingDown, 
  ShieldCheck, 
  Bike, 
  ChevronRight, 
  ArrowRight, 
  Clock, 
  Compass, 
  UtensilsCrossed
} from "lucide-react";

import { 
  Restaurant, 
  FoodItem, 
  CartItem, 
  BillingBreakdown, 
  Address, 
  Order, 
  OrderStatus,
  UserProfile, 
  AppNotification, 
  AppView 
} from "./types";

import { 
  MOCK_RESTAURANTS, 
  MOCK_MENU_ITEMS, 
  MOCK_ADDRESSES, 
  MOCK_DELIVERY_PARTNER,
  MOCK_USER,
  MOCK_PAST_ORDERS,
  MOCK_NOTIFICATIONS,
  computeBilling,
  calculateDynamicDeliveryFee
} from "./mockData";

import Navbar from "./components/Navbar";
import MobileBottomNav from "./components/MobileBottomNav";
import HeroSection from "./components/HeroSection";
import RestaurantCard from "./components/RestaurantCard";
import RestaurantDetailView from "./components/RestaurantDetailView";
import SearchView from "./components/SearchView";
import CartSidebar from "./components/CartSidebar";
import CartView from "./components/CartView";
import CheckoutView from "./components/CheckoutView";
import OrderConfirmationView from "./components/OrderConfirmationView";
import DeliveryTrackingView from "./components/DeliveryTrackingView";
import OrdersView from "./components/OrdersView";
import ProfileView from "./components/ProfileView";
import HelpSupportView from "./components/HelpSupportView";
import AdminDashboardView from "./components/AdminDashboardView";
import RestoXPromiseSection from "./components/RestoXPromiseSection";
import AuthModal from "./components/AuthModal";
import AddressModal from "./components/AddressModal";
import NotificationsModal from "./components/NotificationsModal";
import { saveOrderToSupabase, saveAddressToSupabase, checkSupabaseConnection } from "./lib/supabase";

export default function App() {
  // Navigation View State
  const [currentView, setCurrentView] = useState<AppView>("home");
  
  // User & Auth State
  const [user, setUser] = useState<UserProfile>(MOCK_USER);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Address System (Bangalore locales)
  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(MOCK_ADDRESSES[0]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // Menu Inventory State (Synchronized between Admin and Customer views)
  const [menuItems, setMenuItems] = useState<FoodItem[]>(MOCK_MENU_ITEMS);

  // Cart State
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(MOCK_RESTAURANTS[0]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Orders State (Shared between Customer and Admin)
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [pastOrders, setPastOrders] = useState<Order[]>(MOCK_PAST_ORDERS);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Global Home Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisineFilter, setSelectedCuisineFilter] = useState("All");
  const [selectedDistanceFilter, setSelectedDistanceFilter] = useState<"all" | "near" | "far">("all");
  const [onlyVegFilter, setOnlyVegFilter] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Dynamic Location Delivery Fee: Calculates distance between Restaurant & User Address
  const dynamicDelivery = useMemo(() => {
    const rest = selectedRestaurant || MOCK_RESTAURANTS[0];
    const addr = selectedAddress || MOCK_ADDRESSES[0];
    if (rest && addr) {
      return calculateDynamicDeliveryFee(rest.lat, rest.lng, addr.lat, addr.lng);
    }
    return { fee: 35, distanceKm: 1.5 };
  }, [selectedRestaurant, selectedAddress]);

  // Dynamic Billing Breakdown computation (Food + 2.5% CGST + 2.5% SGST + ₹0 Platform Fee + Dynamic Delivery)
  const billing: BillingBreakdown | null = useMemo(() => {
    if (cart.length === 0) return null;
    const subtotal = cart.reduce((acc, c) => acc + c.item.price * c.quantity, 0);
    return computeBilling(subtotal, dynamicDelivery.fee, dynamicDelivery.distanceKm);
  }, [cart, dynamicDelivery]);

  // Cart Actions
  const handleAddToCart = (item: FoodItem, restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);

    setCart((prev) => {
      const match = prev.find(i => i.item.id === item.id);
      if (match) {
        return prev.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, restaurantId: restaurant.id, restaurantName: restaurant.name, quantity: 1 }];
    });

    showToast(`Added "${item.title}" at menu price ₹${item.price}`);
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

  // Address Actions
  const handleSaveAddress = (newAddr: { label: string; text: string; flatBuilding?: string; landmark?: string; lat: number; lng: number }) => {
    const created: Address = {
      id: "addr-" + Date.now(),
      label: newAddr.label,
      text: newAddr.text,
      flatBuilding: newAddr.flatBuilding,
      landmark: newAddr.landmark,
      lat: newAddr.lat,
      lng: newAddr.lng,
      isDefault: false
    };
    setAddresses(prev => [...prev, created]);
    setSelectedAddress(created);
    saveAddressToSupabase(created);
    showToast(`Address "${newAddr.label}" saved • Delivery updated`);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    if (selectedAddress?.id === id) {
      setSelectedAddress(addresses.find(a => a.id !== id) || null);
    }
    showToast("Address deleted");
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
    const match = addresses.find(a => a.id === id);
    if (match) setSelectedAddress(match);
    showToast("Default address updated");
  };

  // Notifications Actions
  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast("All notifications marked as read");
  };

  const handleSelectNotification = (notif: AppNotification) => {
    if (notif.orderId) {
      setIsNotificationsOpen(false);
      setCurrentView("orders");
    }
  };

  // Navigation Helper
  const navigateTo = (view: AppView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Place Order: Creates order in-app, triggers backend delivery dispatch, navigates to tracking
  const handlePlaceOrder = (paymentMethod: string) => {
    if (!billing || !selectedAddress || cart.length === 0) return;

    setIsProcessingCheckout(true);

    setTimeout(() => {
      const rest = selectedRestaurant || MOCK_RESTAURANTS[0];
      const randomId = "RX-" + Math.floor(1000 + Math.random() * 9000);

      const newOrder: Order = {
        id: randomId,
        restaurantId: rest.id,
        restaurantName: rest.name,
        restaurantImage: rest.image,
        items: [...cart],
        billing: billing,
        status: "PLACED",
        address: selectedAddress,
        deliveryPartner: MOCK_DELIVERY_PARTNER,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        estimatedDeliveryMin: "25–30 min",
        paymentMethod,
        paymentStatus: "PAID",
        orderTimelineStep: 0
      };

      setActiveOrder(newOrder);
      setPastOrders(prev => [newOrder, ...prev]);
      saveOrderToSupabase(newOrder);
      setIsProcessingCheckout(false);
      setCart([]);

      // Navigate customer to in-app tracking — NO Uber redirect
      navigateTo("tracking");
      showToast(`✅ Order ${randomId} confirmed! Assigning delivery partner...`);

      // Trigger backend delivery simulation in background (Uber Direct / delivery network)
      fetch("/api/uber/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: randomId,
          restaurantName: rest.name,
          pickupLat: rest.lat,
          pickupLng: rest.lng,
          dropoffLat: selectedAddress.lat,
          dropoffLng: selectedAddress.lng,
          dropoffAddress: selectedAddress.text || selectedAddress.label
        })
      })
        .then(r => r.json())
        .then(data => {
          if (data.success) {
            console.log("[RestoX Dispatch] Delivery partner assigned:", data.deliveryJobId);
          }
        })
        .catch(err => console.warn("[RestoX Dispatch] Backend dispatch call failed (simulation continues):", err));
    }, 600);
  };

  // Reorder action
  const handleReorder = (order: Order) => {
    const rest = MOCK_RESTAURANTS.find(r => r.id === order.restaurantId) || MOCK_RESTAURANTS[0];
    setSelectedRestaurant(rest);
    setCart(order.items);
    setIsCartOpen(true);
    showToast(`Loaded ${order.items.length} items from ${order.restaurantName} to cart`);
  };

  // Admin Order Status Update
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setPastOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
    showToast(`Order ${orderId} updated to: ${newStatus}`);
  };

  // Admin Toggle Menu Stock
  const handleToggleItemStock = (itemId: string, inStock: boolean) => {
    setMenuItems(prev => prev.map(i => i.id === itemId ? { ...i, isAvailable: inStock } : i));
    showToast(`Item stock status updated`);
  };

  // Filtered Restaurant Discovery List for Home with Dynamic Distance Calculation
  const filteredRestaurants = useMemo(() => {
    return MOCK_RESTAURANTS
      .map((r) => {
        const distCalc = selectedAddress 
          ? calculateDynamicDeliveryFee(r.lat, r.lng, selectedAddress.lat, selectedAddress.lng)
          : { fee: r.deliveryFee, distanceKm: 2.0 };
        return {
          ...r,
          currentDistanceKm: distCalc.distanceKm,
          currentDeliveryFee: distCalc.fee
        };
      })
      .filter((r) => {
        const matchesSearch = 
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.cuisine.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

        let matchesCuisine = true;
        if (selectedCuisineFilter !== "All") {
          matchesCuisine = r.cuisine.some(c => c.toLowerCase() === selectedCuisineFilter.toLowerCase());
        }

        let matchesVeg = true;
        if (onlyVegFilter) {
          matchesVeg = r.isPureVeg === true;
        }

        let matchesDistance = true;
        if (selectedDistanceFilter === "near") {
          matchesDistance = r.currentDistanceKm <= 3.0;
        } else if (selectedDistanceFilter === "far") {
          matchesDistance = r.currentDistanceKm > 3.0;
        }

        return matchesSearch && matchesCuisine && matchesVeg && matchesDistance;
      })
      .sort((a, b) => a.currentDistanceKm - b.currentDistanceKm);
  }, [searchQuery, selectedCuisineFilter, onlyVegFilter, selectedDistanceFilter, selectedAddress]);

  const totalCartCount = cart.reduce((acc, c) => acc + c.quantity, 0);
  const totalCartAmount = billing ? billing.grandTotal : 0;
  const unreadNotifCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2] text-[#1c271b] font-sans antialiased">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#22351c] text-white border border-[#3f5d30] px-5 py-2.5 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-[#bfe0b0]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={navigateTo}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenAddAddress={() => setIsAddressModalOpen(true)}
        cartCount={totalCartCount}
        cartTotal={totalCartAmount}
        addresses={addresses}
        selectedAddress={selectedAddress}
        onSelectAddress={(addr) => {
          setSelectedAddress(addr);
          showToast(`Delivering to ${addr.label} • Delivery fee recalculated`);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        user={user}
        unreadNotificationsCount={unreadNotifCount}
      />

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* VIEW 1: HOME PAGE */}
        {currentView === "home" && (
          <div className="space-y-12">
            
            {/* Hero Section */}
            <HeroSection
              onExploreClick={() => {
                const el = document.getElementById("restaurants-discovery-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              onHowItWorksClick={() => navigateTo("help")}
            />

            {/* RESTAURANT DISCOVERY SECTION */}
            <section id="restaurants-discovery-section" className="space-y-6 pt-2">
              
              {/* Section Header with Filters (Pinterest reference) */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#e8e2d5] pb-5">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8efe4] border border-[#d2e2ca] text-[#2b3e21] text-xs font-black">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#365229] stroke-[2.5]" />
                    <span>VERIFIED RESTAURANT PRICES</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-[#1c271b] tracking-tight font-sans">
                    Explore Partner Restaurants
                  </h2>
                  <p className="text-xs sm:text-sm text-[#616e5c] font-medium">
                    Direct menu pricing • Transparent location delivery • No hidden costs
                  </p>
                </div>

                {/* Distance & Cuisine Filters */}
                <div className="flex flex-col gap-2.5">
                  
                  {/* Distance Pills: Near Me vs Far */}
                  <div className="flex items-center gap-1.5 bg-[#ede6db]/60 p-1 rounded-full border border-[#ded5c5] self-start md:self-end">
                    <button
                      onClick={() => setSelectedDistanceFilter("all")}
                      className={`cursor-pointer px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                        selectedDistanceFilter === "all"
                          ? "bg-[#2d4023] text-white shadow-xs"
                          : "text-[#4a5745] hover:text-[#1c271b]"
                      }`}
                    >
                      All ({MOCK_RESTAURANTS.length})
                    </button>
                    <button
                      onClick={() => setSelectedDistanceFilter("near")}
                      className={`cursor-pointer px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-1 ${
                        selectedDistanceFilter === "near"
                          ? "bg-[#2d4023] text-white shadow-xs"
                          : "text-[#4a5745] hover:text-[#1c271b]"
                      }`}
                    >
                      <span>⚡ Near Me (≤ 3 km)</span>
                    </button>
                    <button
                      onClick={() => setSelectedDistanceFilter("far")}
                      className={`cursor-pointer px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-1 ${
                        selectedDistanceFilter === "far"
                          ? "bg-[#2d4023] text-white shadow-xs"
                          : "text-[#4a5745] hover:text-[#1c271b]"
                      }`}
                    >
                      <span>🚗 Farther Away (&gt; 3 km)</span>
                    </button>
                  </div>

                  {/* Cuisine & Veg Filters */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setOnlyVegFilter(!onlyVegFilter)}
                      className={`cursor-pointer px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all ${
                        onlyVegFilter
                          ? "bg-[#2d4023] text-white border-[#2d4023] shadow-xs"
                          : "bg-white text-[#2c3e22] border-[#d8d0c2] hover:bg-[#f6f2e8]"
                      }`}
                    >
                      <Leaf className="w-3.5 h-3.5 text-[#3f5e30]" />
                      <span>Pure Veg Only</span>
                    </button>

                    {["All", "North Indian", "South Indian", "Biryani", "Burgers", "Healthy"].map((cuisine) => (
                      <button
                        key={cuisine}
                        onClick={() => setSelectedCuisineFilter(cuisine)}
                        className={`cursor-pointer px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
                          selectedCuisineFilter === cuisine
                            ? "bg-[#2d4023] text-white shadow-md shadow-[#2d4023]/20"
                            : "bg-white border border-[#ded5c5] text-[#334230] hover:bg-[#f6f2e8]"
                        }`}
                      >
                        {cuisine}
                      </button>
                    ))}
                  </div>

                </div>
              </div>

              {/* Restaurant Cards Grid */}
              {filteredRestaurants.length === 0 ? (
                <div className="bg-white border border-[#ede6db] rounded-[2rem] p-12 text-center space-y-3">
                  <span className="text-4xl">🔍</span>
                  <h3 className="font-extrabold text-base text-[#1c271b]">No restaurants match your location filter</h3>
                  <p className="text-xs text-[#63705f]">
                    Try switching to "All Distances" or clearing cuisine filters.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCuisineFilter("All");
                      setSelectedDistanceFilter("all");
                      setOnlyVegFilter(false);
                    }}
                    className="cursor-pointer text-xs font-bold text-[#2d4023] bg-[#edf4e8] px-4 py-2 rounded-xl border border-[#d2e2ca] mt-2"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredRestaurants.map((restaurant) => {
                    return (
                      <RestaurantCard
                        key={restaurant.id}
                        restaurant={restaurant}
                        onClick={() => handleOpenRestaurant(restaurant)}
                        dynamicDeliveryFee={restaurant.currentDeliveryFee}
                        dynamicDistanceKm={restaurant.currentDistanceKm}
                      />
                    );
                  })}
                </div>
              )}

            </section>

            {/* The RestoX Promise Section at the End of the Website */}
            <RestoXPromiseSection />

          </div>
        )}

        {/* VIEW 2: SEARCH PAGE */}
        {currentView === "search" && (
          <SearchView
            restaurants={MOCK_RESTAURANTS}
            menuItems={menuItems}
            cart={cart}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onOpenRestaurant={handleOpenRestaurant}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        {/* VIEW 3: RESTAURANT DETAIL & MENU PAGE */}
        {currentView === "restaurant" && selectedRestaurant && (
          <RestaurantDetailView
            restaurant={selectedRestaurant}
            menuItems={menuItems}
            cart={cart}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onBack={() => navigateTo("home")}
            onOpenCart={() => setIsCartOpen(true)}
            dynamicDeliveryFee={dynamicDelivery.fee}
            dynamicDistanceKm={dynamicDelivery.distanceKm}
          />
        )}

        {/* VIEW 4: CART PAGE */}
        {currentView === "cart" && (
          <CartView
            items={cart}
            billing={billing}
            onIncrement={(item) => {
              const rest = selectedRestaurant || MOCK_RESTAURANTS[0];
              handleAddToCart(item, rest);
            }}
            onDecrement={handleRemoveFromCart}
            onClear={handleClearCart}
            onProceed={() => navigateTo("checkout")}
            onBackToShopping={() => navigateTo("home")}
          />
        )}

        {/* VIEW 5: CHECKOUT PAGE */}
        {currentView === "checkout" && (
          <CheckoutView
            cartItems={cart}
            addresses={addresses}
            selectedAddress={selectedAddress}
            setSelectedAddress={(addr) => {
              setSelectedAddress(addr);
              showToast(`Selected ${addr.label} • Delivery fee recalculated`);
            }}
            billing={billing}
            onOpenAddAddress={() => setIsAddressModalOpen(true)}
            onPlaceOrder={handlePlaceOrder}
            onBackToMenu={() => {
              if (selectedRestaurant) navigateTo("restaurant");
              else navigateTo("home");
            }}
            isProcessing={isProcessingCheckout}
          />
        )}

        {/* VIEW 6: ORDER CONFIRMATION PAGE */}
        {currentView === "confirmation" && activeOrder && (
          <OrderConfirmationView
            order={activeOrder}
            onTrackOrder={() => navigateTo("tracking")}
            onBackToHome={() => navigateTo("home")}
            onViewOrdersList={() => navigateTo("orders")}
          />
        )}

        {/* VIEW 7: DELIVERY TRACKING PAGE */}
        {currentView === "tracking" && (
          activeOrder ? (
            <DeliveryTrackingView
              order={activeOrder}
              onBackToHome={() => navigateTo("home")}
              onBackToOrders={() => navigateTo("orders")}
            />
          ) : (
            <div className="max-w-md mx-auto py-16 text-center space-y-4">
              <h3 className="font-extrabold text-base text-zinc-900">No active delivery in transit</h3>
              <p className="text-xs text-zinc-500">View your past completed orders or start a new order.</p>
              <button
                onClick={() => navigateTo("orders")}
                className="cursor-pointer bg-emerald-600 text-zinc-950 font-bold px-5 py-2.5 rounded-2xl text-xs"
              >
                View Orders History
              </button>
            </div>
          )
        )}

        {/* VIEW 8: ORDERS HISTORY PAGE */}
        {currentView === "orders" && (
          <OrdersView
            activeOrder={activeOrder}
            pastOrders={pastOrders}
            onTrackActiveOrder={() => navigateTo("tracking")}
            onReorder={handleReorder}
            onBrowseRestaurants={() => navigateTo("home")}
          />
        )}

        {/* VIEW 9: ADMIN & KITCHEN DASHBOARD */}
        {currentView === "admin" && (
          <AdminDashboardView
            orders={pastOrders}
            menuItems={menuItems}
            restaurants={MOCK_RESTAURANTS}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onToggleItemStock={handleToggleItemStock}
            onNavigateToTracking={(id) => {
              const match = pastOrders.find(o => o.id === id);
              if (match) {
                setActiveOrder(match);
                navigateTo("tracking");
              }
            }}
          />
        )}

        {/* VIEW 10: PROFILE / ACCOUNT HUB */}
        {(currentView === "profile" || currentView === "addresses") && (
          <ProfileView
            user={user}
            onUpdateUser={setUser}
            onLogout={() => {
              setUser({ ...user, isLoggedIn: false, name: "Guest" });
              showToast("Logged out successfully");
            }}
            addresses={addresses}
            onOpenAddAddress={() => setIsAddressModalOpen(true)}
            onDeleteAddress={handleDeleteAddress}
            onSetDefaultAddress={handleSetDefaultAddress}
            restaurants={MOCK_RESTAURANTS}
            menuItems={menuItems}
            onOpenRestaurant={handleOpenRestaurant}
            onNavigate={navigateTo}
          />
        )}

        {/* VIEW 11: HELP & SUPPORT */}
        {currentView === "help" && (
          <HelpSupportView />
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
            onProceed={() => {
              setIsCartOpen(false);
              navigateTo("checkout");
            }}
          />
        )}
      </AnimatePresence>

      {/* Floating Bottom Cart Bar on Mobile when items exist */}
      {cart.length > 0 && currentView !== "checkout" && currentView !== "cart" && (
        <div className="sm:hidden fixed bottom-18 left-4 right-4 z-30">
          <button
            onClick={() => setIsCartOpen(true)}
            className="cursor-pointer w-full bg-zinc-950 text-white p-3.5 rounded-2xl flex items-center justify-between shadow-2xl border border-emerald-500/40 active:scale-98"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-emerald-500 text-zinc-950 font-black text-xs flex items-center justify-center">
                {totalCartCount}
              </span>
              <div className="text-left">
                <span className="font-extrabold text-xs block leading-none">View RestoX Order</span>
                <span className="text-[10px] text-emerald-400">Zero surprise platform fees</span>
              </div>
            </div>
            <div className="flex items-center gap-1 font-bold text-sm text-emerald-400 font-sans">
              <span>₹{totalCartAmount}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentView={currentView}
        onNavigate={navigateTo}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
        hasActiveOrder={activeOrder !== null}
      />

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(loggedUser) => {
          setUser(loggedUser);
          showToast(`Welcome, ${loggedUser.name}!`);
        }}
      />

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSaveAddress={handleSaveAddress}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onSelectNotification={handleSelectNotification}
      />

      {/* Footer */}
      <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-900 mt-20 mb-14 sm:mb-0">
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
                A transparent food-ordering platform MVP built for honest pricing without hidden platform markups.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Restaurant Menu Price + Fair Delivery = Clear Final Price</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-white uppercase tracking-wider block">Discover</span>
              <ul className="space-y-1.5">
                <li>
                  <button onClick={() => navigateTo("home")} className="cursor-pointer hover:text-emerald-400 transition-colors">
                    Explore Restaurants
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo("search")} className="cursor-pointer hover:text-emerald-400 transition-colors">
                    Search Food & Dishes
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo("admin")} className="cursor-pointer hover:text-emerald-400 transition-colors">
                    Admin & Kitchen Dashboard
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo("help")} className="cursor-pointer hover:text-emerald-400 transition-colors">
                    Help & Support FAQs
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-white uppercase tracking-wider block">Hackathon MVP</span>
              <p className="text-zinc-500 leading-relaxed text-[11px]">
                Built as a high-fidelity logistics prototype. Demonstrates complete order-to-tracking flow with distance-based courier dispatch and real-time store synchronization.
              </p>
              <div className="pt-2 text-[10px] text-zinc-500 font-mono">
                RestoX v2.0.0 • Bengaluru, India
              </div>
            </div>

          </div>

          <div className="border-t border-zinc-900 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <p>© {new Date().getFullYear()} RestoX Technologies. All demo rights reserved.</p>
            <p className="font-mono text-[11px] text-emerald-500">
              Zero Platform Fees • Transparent Bills
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
