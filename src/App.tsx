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
  Heart,
  ChevronRight,
  ArrowRight,
  Clock,
  Compass,
  UtensilsCrossed,
  Tag
} from "lucide-react";

import { 
  Restaurant, 
  FoodItem, 
  CartItem, 
  BillingBreakdown, 
  Address, 
  Order,
  UserProfile,
  AppNotification,
  AppView,
  Coupon
} from "./types";

import { 
  MOCK_RESTAURANTS, 
  MOCK_MENU_ITEMS, 
  MOCK_ADDRESSES, 
  MOCK_DELIVERY_PARTNER,
  MOCK_USER,
  MOCK_PAST_ORDERS,
  MOCK_NOTIFICATIONS,
  computeBilling 
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
import OffersView from "./components/OffersView";
import AuthModal from "./components/AuthModal";
import AddressModal from "./components/AddressModal";
import NotificationsModal from "./components/NotificationsModal";

export default function App() {
  // Navigation View State
  const [currentView, setCurrentView] = useState<AppView>("home");
  
  // User & Auth State (Default logged in user Pooja Bhusani, supports guest mode)
  const [user, setUser] = useState<UserProfile>(MOCK_USER);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Address System (Bangalore locales)
  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(MOCK_ADDRESSES[0]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // Cart & Coupon State
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);

  // Orders State
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [pastOrders, setPastOrders] = useState<Order[]>(MOCK_PAST_ORDERS);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  // Favorites System (IDs of restaurants and items)
  const [favorites, setFavorites] = useState<string[]>(["rest-spice-route", "sr-1", "rest-dosa-district"]);

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Global Home Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisineFilter, setSelectedCuisineFilter] = useState("All");
  const [onlyVegFilter, setOnlyVegFilter] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Toast Helper
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
    return computeBilling(subtotal, deliveryFee, activeCoupon);
  }, [cart, selectedRestaurant, activeCoupon]);

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
    setActiveCoupon(null);
    showToast("Cart cleared");
  };

  // Favorites Toggles
  const handleToggleFavoriteRestaurant = (restaurantId: string) => {
    setFavorites(prev => {
      if (prev.includes(restaurantId)) {
        showToast("Removed from favorites");
        return prev.filter(id => id !== restaurantId);
      } else {
        showToast("Added to favorites ❤️");
        return [...prev, restaurantId];
      }
    });
  };

  const handleToggleFavoriteItem = (itemId: string) => {
    setFavorites(prev => {
      if (prev.includes(itemId)) {
        showToast("Removed dish from favorites");
        return prev.filter(id => id !== itemId);
      } else {
        showToast("Added dish to favorites ❤️");
        return [...prev, itemId];
      }
    });
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
    showToast(`Address "${newAddr.label}" saved`);
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
        paymentStatus: "PAID",
        orderTimelineStep: 1
      };

      setActiveOrder(newOrder);
      setPastOrders(prev => [newOrder, ...prev]);
      setIsProcessingCheckout(false);
      setCart([]);
      setActiveCoupon(null);
      navigateTo("confirmation");
      showToast("Order placed successfully at true menu price!");
    }, 1000);
  };

  // Reorder action
  const handleReorder = (order: Order) => {
    const rest = MOCK_RESTAURANTS.find(r => r.id === order.restaurantId) || MOCK_RESTAURANTS[0];
    setSelectedRestaurant(rest);
    setCart(order.items);
    setIsCartOpen(true);
    showToast(`Loaded ${order.items.length} items from ${order.restaurantName} to cart`);
  };

  // Filtered Restaurant Discovery List for Home
  const filteredRestaurants = useMemo(() => {
    return MOCK_RESTAURANTS.filter((r) => {
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

      return matchesSearch && matchesCuisine && matchesVeg;
    });
  }, [searchQuery, selectedCuisineFilter, onlyVegFilter]);

  const totalCartCount = cart.reduce((acc, c) => acc + c.quantity, 0);
  const totalCartAmount = billing ? billing.grandTotal : 0;
  const unreadNotifCount = notifications.filter(n => !n.read).length;

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
        onSelectAddress={setSelectedAddress}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        user={user}
        unreadNotificationsCount={unreadNotifCount}
        favoritesCount={favorites.length}
      />

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* VIEW 1: HOME PAGE */}
        {currentView === "home" && (
          <div className="space-y-10">
            
            {/* Hero Section */}
            <HeroSection
              onExploreClick={() => {
                const el = document.getElementById("restaurants-discovery-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              onOffersClick={() => navigateTo("offers")}
              onHowItWorksClick={() => navigateTo("help")}
            />

            {/* RESTAURANT DISCOVERY SECTION */}
            <section id="restaurants-discovery-section" className="space-y-6 pt-2">
              
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
                      isFavorite={favorites.includes(restaurant.id)}
                      onToggleFavorite={handleToggleFavoriteRestaurant}
                    />
                  ))}
                </div>
              )}

            </section>

          </div>
        )}

        {/* VIEW 2: SEARCH PAGE */}
        {currentView === "search" && (
          <SearchView
            restaurants={MOCK_RESTAURANTS}
            menuItems={MOCK_MENU_ITEMS}
            cart={cart}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onOpenRestaurant={handleOpenRestaurant}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            favorites={favorites}
            onToggleFavoriteRestaurant={handleToggleFavoriteRestaurant}
            onToggleFavoriteItem={handleToggleFavoriteItem}
          />
        )}

        {/* VIEW 3: RESTAURANT DETAIL & MENU PAGE */}
        {currentView === "restaurant" && selectedRestaurant && (
          <RestaurantDetailView
            restaurant={selectedRestaurant}
            menuItems={MOCK_MENU_ITEMS}
            cart={cart}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onBack={() => navigateTo("home")}
            onOpenCart={() => setIsCartOpen(true)}
            favorites={favorites}
            onToggleFavoriteRestaurant={handleToggleFavoriteRestaurant}
            onToggleFavoriteItem={handleToggleFavoriteItem}
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
            onApplyCoupon={setActiveCoupon}
          />
        )}

        {/* VIEW 5: CHECKOUT PAGE */}
        {currentView === "checkout" && (
          <CheckoutView
            cartItems={cart}
            addresses={addresses}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
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
        {currentView === "tracking" && activeOrder && (
          <DeliveryTrackingView
            order={activeOrder}
            onBackToHome={() => navigateTo("home")}
            onBackToOrders={() => navigateTo("orders")}
          />
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

        {/* VIEW 9: PROFILE / ACCOUNT HUB */}
        {(currentView === "profile" || currentView === "addresses" || currentView === "favorites") && (
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
            favorites={favorites}
            restaurants={MOCK_RESTAURANTS}
            menuItems={MOCK_MENU_ITEMS}
            onOpenRestaurant={handleOpenRestaurant}
            onNavigate={navigateTo}
          />
        )}

        {/* VIEW 10: HELP & SUPPORT */}
        {currentView === "help" && (
          <HelpSupportView />
        )}

        {/* VIEW 11: OFFERS & PROMOTIONS */}
        {currentView === "offers" && (
          <OffersView
            onApplyCouponAndOrder={(coupon) => {
              setActiveCoupon(coupon);
              showToast(`Applied ${coupon.code}! Now choose your dishes.`);
              navigateTo("home");
            }}
            onBrowseRestaurants={() => navigateTo("home")}
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
            onProceed={() => {
              setIsCartOpen(false);
              navigateTo("checkout");
            }}
            onApplyCoupon={setActiveCoupon}
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
                <span className="font-extrabold text-xs block leading-none">View FairByte Order</span>
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
                  <button onClick={() => navigateTo("offers")} className="cursor-pointer hover:text-emerald-400 transition-colors">
                    Promo Offers & Deals
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
                Built as a high-fidelity frontend prototype. Demonstrates complete order-to-tracking flow with realistic mock data and real-time delivery telemetry.
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
