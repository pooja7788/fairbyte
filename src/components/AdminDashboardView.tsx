import React, { useState, useMemo } from "react";
import { 
  ChefHat, 
  Bike, 
  CheckCircle2, 
  Package, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  MapPin, 
  Search, 
  Filter, 
  ArrowRight,
  ShoppingBag,
  ExternalLink,
  Menu as HamburgerIcon,
  X,
  Plus,
  Edit2,
  Trash2,
  Eye,
  AlertTriangle,
  Clock,
  Star,
  Users,
  CreditCard,
  BarChart3,
  Bell,
  Settings,
  Truck,
  Sparkles,
  Check,
  ToggleLeft,
  ToggleRight,
  Phone,
  Store,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  ArrowUpRight,
  Info
} from "lucide-react";
import { Order, OrderStatus, FoodItem, Restaurant } from "../types";
import { getUberRideBookingUrl } from "../lib/uberMcp";

interface AdminDashboardViewProps {
  orders: Order[];
  menuItems: FoodItem[];
  restaurants: Restaurant[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onToggleItemStock: (itemId: string, inStock: boolean) => void;
  onAddMenuItem?: (item: Omit<FoodItem, "id">) => void;
  onEditMenuItem?: (item: FoodItem) => void;
  onDeleteMenuItem?: (itemId: string) => void;
  onNavigateToTracking?: (orderId: string) => void;
}

type AdminSection = 
  | "dashboard" 
  | "orders" 
  | "menu" 
  | "deliveries" 
  | "customers" 
  | "payments" 
  | "analytics" 
  | "notifications" 
  | "settings";

const PRESET_FOOD_IMAGES = [
  { label: "Curry / Bowl", url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=800" },
  { label: "Paneer / Gravy", url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=800" },
  { label: "Biryani / Rice", url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=800" },
  { label: "Dosa / South Indian", url: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&q=80&w=800" },
  { label: "Burger & Fries", url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800" },
  { label: "Tandoori / Kebab", url: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&q=80&w=800" },
  { label: "Dessert / Sweet", url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800" },
  { label: "Lassi / Beverage", url: "https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&q=80&w=800" },
];

export default function AdminDashboardView({
  orders,
  menuItems,
  restaurants,
  onUpdateOrderStatus,
  onToggleItemStock,
  onAddMenuItem,
  onEditMenuItem,
  onDeleteMenuItem,
  onNavigateToTracking
}: AdminDashboardViewProps) {
  // Navigation & UI State
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>(restaurants[0]?.id || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<FoodItem | null>(null);
  const [inspectingOrder, setInspectingOrder] = useState<Order | null>(null);

  // Form State for Add / Edit Item
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "Main Course",
    image: PRESET_FOOD_IMAGES[0].url,
    prepTime: "15-20 min",
    isVeg: true,
    isAvailable: true,
    isPopular: false
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Selected Restaurant
  const currentRestaurant = useMemo(() => {
    return restaurants.find(r => r.id === selectedRestaurantId) || restaurants[0];
  }, [restaurants, selectedRestaurantId]);

  // Filtered Menu Items for current restaurant
  const scopedMenuItems = useMemo(() => {
    return menuItems.filter(item => {
      if (selectedRestaurantId !== "all" && item.restaurantId !== selectedRestaurantId) {
        return false;
      }
      if (selectedCategoryFilter !== "All" && item.category !== selectedCategoryFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
      }
      return true;
    });
  }, [menuItems, selectedRestaurantId, selectedCategoryFilter, searchQuery]);

  // Unique categories for the current restaurant
  const availableCategories = useMemo(() => {
    const set = new Set<string>(["All"]);
    menuItems
      .filter(i => selectedRestaurantId === "all" || i.restaurantId === selectedRestaurantId)
      .forEach(i => set.add(i.category));
    return Array.from(set);
  }, [menuItems, selectedRestaurantId]);

  // Filtered Orders
  const scopedOrders = useMemo(() => {
    return orders.filter(o => {
      if (selectedRestaurantId !== "all" && o.restaurantId !== selectedRestaurantId) {
        return false;
      }
      return true;
    });
  }, [orders, selectedRestaurantId]);

  // Categorize Orders
  const pendingOrders = scopedOrders.filter(o => o.status === "PLACED" || o.status === "AUTHORIZED");
  const preparingOrders = scopedOrders.filter(o => o.status === "ACCEPTED" || o.status === "CONFIRMED" || o.status === "PREPARING");
  const readyOrders = scopedOrders.filter(o => o.status === "READY_FOR_PICKUP" || o.status === "RIDER_ASSIGNED");
  const deliveringOrders = scopedOrders.filter(o => o.status === "OUT_FOR_DELIVERY" || o.status === "DELIVERING" || o.status === "ARRIVED");
  const completedOrders = scopedOrders.filter(o => o.status === "DELIVERED" || o.status === "COMPLETED");

  // Summary Metrics
  const totalRevenue = scopedOrders.reduce((sum, o) => sum + o.billing.subtotal, 0);
  const totalOrdersCount = scopedOrders.length;
  const activeDeliveriesCount = deliveringOrders.length + readyOrders.length;
  const availableItemsCount = scopedMenuItems.filter(i => i.isAvailable !== false).length;
  const unavailableItemsCount = scopedMenuItems.filter(i => i.isAvailable === false).length;

  // Form Handlers
  const openAddModal = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      category: availableCategories[1] || "Main Course",
      image: PRESET_FOOD_IMAGES[0].url,
      prepTime: "15-20 min",
      isVeg: true,
      isAvailable: true,
      isPopular: false
    });
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (item: FoodItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image,
      prepTime: item.prepTime || "15-20 min",
      isVeg: item.isVeg,
      isAvailable: item.isAvailable !== false,
      isPopular: !!item.isPopular
    });
    setFormError(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError("Food item title is required.");
      return;
    }
    const numPrice = parseFloat(formData.price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setFormError("Please enter a valid price greater than 0.");
      return;
    }

    if (editingItem) {
      // Edit mode
      const updated: FoodItem = {
        ...editingItem,
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Math.round(numPrice),
        category: formData.category,
        image: formData.image || PRESET_FOOD_IMAGES[0].url,
        prepTime: formData.prepTime,
        isVeg: formData.isVeg,
        isAvailable: formData.isAvailable,
        isPopular: formData.isPopular
      };

      if (onEditMenuItem) {
        onEditMenuItem(updated);
      }
      setEditingItem(null);
    } else {
      // Add mode
      const newItem: Omit<FoodItem, "id"> = {
        restaurantId: selectedRestaurantId === "all" ? (restaurants[0]?.id || "rest-1") : selectedRestaurantId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Math.round(numPrice),
        rating: 4.8,
        category: formData.category,
        image: formData.image || PRESET_FOOD_IMAGES[0].url,
        prepTime: formData.prepTime,
        isVeg: formData.isVeg,
        isAvailable: formData.isAvailable,
        isPopular: formData.isPopular
      };

      if (onAddMenuItem) {
        onAddMenuItem(newItem);
      }
      setIsAddModalOpen(false);
    }
  };

  const confirmDelete = () => {
    if (deletingItem && onDeleteMenuItem) {
      onDeleteMenuItem(deletingItem.id);
      setDeletingItem(null);
    }
  };

  // Nav Items Config (Vertical Navigation)
  const navItems: { id: AdminSection; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    { id: "dashboard", label: "Dashboard", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "orders", label: "Orders", icon: <Package className="w-4 h-4" />, badge: pendingOrders.length + preparingOrders.length },
    { id: "menu", label: "Menu Management", icon: <ShoppingBag className="w-4 h-4" />, badge: scopedMenuItems.length },
    { id: "deliveries", label: "Deliveries", icon: <Truck className="w-4 h-4" />, badge: activeDeliveriesCount },
    { id: "customers", label: "Customers", icon: <Users className="w-4 h-4" /> },
    { id: "payments", label: "Payments", icon: <CreditCard className="w-4 h-4" /> },
    { id: "analytics", label: "Analytics", icon: <TrendingUp className="w-4 h-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" />, badge: 2 },
    { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      
      {/* ─────────────────────────────────────────────────────────────
          1. TOP APP BAR (Dark Theme Header)
      ───────────────────────────────────────────────────────────── */}
      <header className="bg-zinc-900/95 border-b border-zinc-800 sticky top-0 z-40 px-4 sm:px-6 py-3.5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Left: Brand + Hamburger for mobile */}
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
              title="Open Navigation Menu"
            >
              <HamburgerIcon className="w-5 h-5" />
            </button>

            {/* Brand Logo & Admin Badge */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <ChefHat className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-white font-sans">
                  Resto<span className="text-emerald-400">X</span>
                </span>
                <span className="w-px h-5 bg-zinc-700 hidden sm:inline-block" />
                <span className="text-xs font-bold text-zinc-300 hidden sm:inline-block tracking-wide">
                  Admin Panel
                </span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/30 hidden md:flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  LIVE LOGISTICS
                </span>
              </div>
            </div>
          </div>

          {/* Right: Restaurant Selector & Quick Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 bg-zinc-800/90 border border-zinc-700/80 rounded-2xl px-3 py-1.5">
              <Store className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[9px] text-zinc-400 uppercase font-mono font-bold leading-none">Restaurant</span>
                <select
                  value={selectedRestaurantId}
                  onChange={(e) => setSelectedRestaurantId(e.target.value)}
                  className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer pr-1"
                >
                  <option value="all" className="bg-zinc-900 text-white">All Outlets (Global)</option>
                  {restaurants.map((r) => (
                    <option key={r.id} value={r.id} className="bg-zinc-900 text-white">
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Add Food Button */}
            <button
              onClick={openAddModal}
              className="cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">Add Food Item</span>
            </button>
          </div>

        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN LAYOUT: VERTICAL SIDEBAR + CONTENT
      ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">

        {/* Desktop Vertical Sidebar */}
        <aside className="w-64 border-r border-zinc-800/80 p-4 space-y-6 hidden lg:block shrink-0">
          
          {/* Restaurant Status Card */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase">Store Status</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-xs font-bold text-white truncate">
              {currentRestaurant?.name || "Kitchen Command"}
            </p>
            <p className="text-[10px] text-zinc-400">
              Kitchen receiving orders at 0% markup
            </p>
          </div>

          {/* Navigation Links - Vertical list, 1 per line */}
          <nav className="space-y-1">
            <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase px-3 pb-1 block">
              Navigation
            </span>
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      isActive ? "bg-zinc-950 text-emerald-400" : "bg-zinc-800 text-zinc-300"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Metrics Footer */}
          <div className="pt-4 border-t border-zinc-800/80 space-y-2">
            <div className="flex justify-between text-[11px] text-zinc-400">
              <span>Today's Food Sales:</span>
              <span className="font-mono font-bold text-white">₹{totalRevenue.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-[11px] text-zinc-400">
              <span>Platform Fee:</span>
              <span className="font-mono font-bold text-emerald-400">₹0.00</span>
            </div>
          </div>

        </aside>

        {/* Mobile Slide-Out Drawer / Overlay */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileSidebarOpen(false)}
            />

            {/* Slide Drawer */}
            <div className="relative w-72 max-w-[85vw] bg-zinc-900 border-r border-zinc-800 p-5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
              
              <div className="space-y-6">
                {/* Header with Close button */}
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <ChefHat className="w-5 h-5 text-emerald-400" />
                    <span className="font-black text-white text-base">RestoX Admin</span>
                  </div>
                  <button
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="p-1.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Vertical Navigation Links */}
                <nav className="space-y-1.5">
                  {navItems.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveSection(item.id);
                          setIsMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isActive
                            ? "bg-emerald-500 text-zinc-950 shadow-md"
                            : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {item.icon}
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                            isActive ? "bg-zinc-950 text-emerald-400" : "bg-zinc-800 text-zinc-300"
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Drawer Bottom */}
              <div className="pt-4 border-t border-zinc-800 text-xs text-zinc-500 space-y-1 font-mono">
                <p>RestoX v2.0 • Bangalore Hub</p>
                <p>Zero Hidden Commission Network</p>
              </div>

            </div>
          </div>
        )}

        {/* Main Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-full overflow-x-hidden">

          {/* ─────────────────────────────────────────────────────────
              SECTION 1: DASHBOARD OVERVIEW
          ───────────────────────────────────────────────────────── */}
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              
              {/* Header Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight">
                    Dashboard Overview
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Live analytics &amp; kitchen performance for {selectedRestaurantId === "all" ? "All Outlets" : currentRestaurant?.name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveSection("menu")}
                    className="cursor-pointer bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Manage Menu</span>
                  </button>
                  <button
                    onClick={() => setActiveSection("orders")}
                    className="cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>View Orders ({pendingOrders.length + preparingOrders.length})</span>
                  </button>
                </div>
              </div>

              {/* 5 Summary KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                
                {/* 1. Total Orders */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-1.5">
                  <div className="flex items-center justify-between text-zinc-400 text-xs">
                    <span>Total Orders</span>
                    <Package className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">{totalOrdersCount}</div>
                  <p className="text-[10px] text-zinc-500">{completedOrders.length} delivered</p>
                </div>

                {/* 2. Pending Orders */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-1.5">
                  <div className="flex items-center justify-between text-zinc-400 text-xs">
                    <span>Pending / Prep</span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-amber-400 font-mono">
                    {pendingOrders.length + preparingOrders.length}
                  </div>
                  <p className="text-[10px] text-zinc-500">In kitchen queue</p>
                </div>

                {/* 3. Active Deliveries */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-1.5">
                  <div className="flex items-center justify-between text-zinc-400 text-xs">
                    <span>In Transit</span>
                    <Truck className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-black text-blue-400 font-mono">
                    {activeDeliveriesCount}
                  </div>
                  <p className="text-[10px] text-zinc-500">Uber courier partners</p>
                </div>

                {/* 4. Menu Items */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-1.5">
                  <div className="flex items-center justify-between text-zinc-400 text-xs">
                    <span>Menu Catalog</span>
                    <ShoppingBag className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">{scopedMenuItems.length}</div>
                  <p className="text-[10px] text-emerald-400">{availableItemsCount} in stock</p>
                </div>

                {/* 5. Total Revenue */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-1.5 col-span-2 sm:col-span-1">
                  <div className="flex items-center justify-between text-zinc-400 text-xs">
                    <span>Food Revenue</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">₹{totalRevenue.toFixed(0)}</div>
                  <p className="text-[10px] text-zinc-500">100% to restaurant</p>
                </div>

              </div>

              {/* Two Column Grid: Recent Orders + Menu Highlights */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Recent Orders Table */}
                <div className="lg:col-span-7 bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-emerald-400" />
                      <h3 className="font-black text-sm text-white">Recent Orders Queue</h3>
                    </div>
                    <button
                      onClick={() => setActiveSection("orders")}
                      className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>View All</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {scopedOrders.length === 0 ? (
                    <div className="py-8 text-center text-xs text-zinc-500">No recent orders found.</div>
                  ) : (
                    <div className="space-y-2">
                      {scopedOrders.slice(0, 5).map((order) => (
                        <div
                          key={order.id}
                          onClick={() => setInspectingOrder(order)}
                          className="bg-zinc-950/60 border border-zinc-800 hover:border-emerald-500/40 rounded-2xl p-3 flex items-center justify-between gap-3 cursor-pointer transition-all hover:bg-zinc-950"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-black text-white">#{order.id}</span>
                              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                                order.status === "DELIVERED" || order.status === "COMPLETED"
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                  : order.status === "OUT_FOR_DELIVERY" || order.status === "DELIVERING"
                                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                  : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                              {order.items.map(i => `${i.quantity}x ${i.item.title}`).join(", ")}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-mono font-bold text-xs text-emerald-400">
                              ₹{order.billing.subtotal.toFixed(0)}
                            </div>
                            <div className="text-[10px] text-zinc-500">{order.createdAt}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Menu Highlights / Top Items */}
                <div className="lg:col-span-5 bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-emerald-400" />
                      <h3 className="font-black text-sm text-white">Menu Quick Controls</h3>
                    </div>
                    <button
                      onClick={() => setActiveSection("menu")}
                      className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>Manage All</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {scopedMenuItems.slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-2.5 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-10 h-10 rounded-xl object-cover border border-zinc-800 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-xs text-white truncate">{item.title}</p>
                            <p className="text-[10px] font-mono text-emerald-400">₹{item.price}</p>
                          </div>
                        </div>

                        {/* Quick Stock Switch */}
                        <button
                          onClick={() => onToggleItemStock(item.id, !item.isAvailable)}
                          className={`cursor-pointer px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            item.isAvailable !== false
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {item.isAvailable !== false ? "In Stock" : "Sold Out"}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add New Item Banner */}
                  <button
                    onClick={openAddModal}
                    className="cursor-pointer w-full bg-zinc-800/80 hover:bg-zinc-800 border border-dashed border-zinc-700 text-zinc-300 hover:text-white text-xs font-bold p-3 rounded-2xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span>Add New Food Item</span>
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* ─────────────────────────────────────────────────────────
              SECTION 2: MENU MANAGEMENT (COMPLETE RESTAURANT OWNER SUITE)
          ───────────────────────────────────────────────────────── */}
          {activeSection === "menu" && (
            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight">
                    Restaurant Menu Management
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Live catalog for {selectedRestaurantId === "all" ? "All Restaurants" : currentRestaurant?.name}. Changes immediately reflect in customer view.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={openAddModal}
                    className="cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md shadow-emerald-500/20 transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Add Food Item</span>
                  </button>
                </div>
              </div>

              {/* Menu Stats Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3.5">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">Total Items</span>
                  <p className="text-xl font-black text-white font-mono mt-0.5">{scopedMenuItems.length}</p>
                </div>
                <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3.5">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">Available / In Stock</span>
                  <p className="text-xl font-black text-emerald-400 font-mono mt-0.5">{availableItemsCount}</p>
                </div>
                <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3.5">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">Unavailable / Sold Out</span>
                  <p className="text-xl font-black text-red-400 font-mono mt-0.5">{unavailableItemsCount}</p>
                </div>
                <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3.5">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">Active Categories</span>
                  <p className="text-xl font-black text-purple-400 font-mono mt-0.5">{availableCategories.length - 1}</p>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-zinc-900/80 border border-zinc-800 p-3 rounded-2xl">
                
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search dishes, descriptions, categories..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                  {availableCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategoryFilter(cat)}
                      className={`cursor-pointer px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                        selectedCategoryFilter === cat
                          ? "bg-emerald-500 text-zinc-950 shadow-xs"
                          : "bg-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

              </div>

              {/* Menu Items Grid */}
              {scopedMenuItems.length === 0 ? (
                <div className="bg-zinc-900/50 border border-dashed border-zinc-800 rounded-3xl p-12 text-center space-y-3">
                  <ShoppingBag className="w-8 h-8 text-zinc-600 mx-auto" />
                  <h3 className="font-bold text-white text-sm">No food items found</h3>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    Try clearing search filters or add a new food item to this restaurant catalog.
                  </p>
                  <button
                    onClick={openAddModal}
                    className="cursor-pointer bg-emerald-500 text-zinc-950 text-xs font-black px-4 py-2 rounded-xl inline-flex items-center gap-1.5 mt-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Food Item</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {scopedMenuItems.map((item) => {
                    const isAvail = item.isAvailable !== false;
                    return (
                      <div
                        key={item.id}
                        className={`bg-zinc-900 border rounded-3xl p-4 flex flex-col justify-between gap-4 transition-all duration-200 ${
                          isAvail ? "border-zinc-800 hover:border-zinc-700" : "border-red-900/30 opacity-75 bg-zinc-950/80"
                        }`}
                      >
                        {/* Top: Image + Info */}
                        <div className="flex gap-3.5">
                          <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 shrink-0">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            {/* Veg / Non-veg indicator */}
                            <div className="absolute top-1.5 left-1.5 w-4 h-4 rounded-sm bg-zinc-950/90 border flex items-center justify-center p-0.5">
                              <div className={`w-2 h-2 rounded-full ${item.isVeg ? "bg-emerald-400" : "bg-red-500"}`} />
                            </div>
                          </div>

                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-black text-sm text-white truncate">{item.title}</h4>
                              <span className="font-mono font-black text-emerald-400 text-sm">
                                ₹{item.price}
                              </span>
                            </div>

                            <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>

                            <div className="flex items-center gap-2 pt-1">
                              <span className="bg-zinc-800 text-zinc-300 text-[9px] font-mono font-bold px-2 py-0.5 rounded">
                                {item.category}
                              </span>
                              {item.prepTime && (
                                <span className="text-[10px] text-zinc-500 flex items-center gap-0.5">
                                  <Clock className="w-3 h-3" />
                                  <span>{item.prepTime}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Bottom: Action Controls */}
                        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 gap-2">
                          
                          {/* Availability Toggle */}
                          <button
                            onClick={() => onToggleItemStock(item.id, !isAvail)}
                            className={`cursor-pointer px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                              isAvail
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
                            }`}
                            title="Toggle Availability"
                          >
                            <span className={`w-2 h-2 rounded-full ${isAvail ? "bg-emerald-400" : "bg-red-400"}`} />
                            <span>{isAvail ? "Available" : "Unavailable"}</span>
                          </button>

                          {/* Action Buttons: Edit & Delete */}
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => openEditModal(item)}
                              className="cursor-pointer p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                              title="Edit Food Item"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setDeletingItem(item)}
                              className="cursor-pointer p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 transition-colors"
                              title="Delete Food Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* ─────────────────────────────────────────────────────────
              SECTION 3: ORDERS MANAGEMENT
          ───────────────────────────────────────────────────────── */}
          {activeSection === "orders" && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight">
                    Live Orders Dispatch
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Track kitchen prep status, courier dispatch, and customer receipts
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400 font-mono">
                    Total: {scopedOrders.length} orders
                  </span>
                </div>
              </div>

              {/* Order Status Swimlanes / Table */}
              <div className="space-y-3">
                {scopedOrders.length === 0 ? (
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-12 text-center text-xs text-zinc-500">
                    No orders placed yet. Place an order in customer view to see live dispatch here!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {scopedOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                      >
                        {/* Order Header & Items */}
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-sm font-black text-white">#{order.id}</span>
                            <span className={`text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full border ${
                              order.status === "DELIVERED" || order.status === "COMPLETED"
                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                : order.status === "OUT_FOR_DELIVERY" || order.status === "DELIVERING"
                                ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                            }`}>
                              {order.status}
                            </span>
                            <span className="text-xs text-zinc-500">{order.createdAt}</span>
                          </div>

                          <div className="text-xs text-zinc-300">
                            {order.items.map(i => `${i.quantity}x ${i.item.title} (₹${i.item.price})`).join(" • ")}
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-emerald-400" />
                              <span>{order.address.label} ({order.address.text.substring(0, 30)}...)</span>
                            </span>
                            <span>•</span>
                            <span>Paid via: <strong className="text-zinc-200">{order.paymentMethod}</strong></span>
                          </div>
                        </div>

                        {/* Status Transition Actions */}
                        <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 border-zinc-800 pt-3 md:pt-0">
                          
                          {/* Order Action Buttons */}
                          {order.status === "PLACED" && (
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, "ACCEPTED")}
                              className="cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black px-3.5 py-2 rounded-xl transition-all"
                            >
                              Accept Order
                            </button>
                          )}

                          {order.status === "ACCEPTED" && (
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, "PREPARING")}
                              className="cursor-pointer bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black px-3.5 py-2 rounded-xl transition-all"
                            >
                              Mark Preparing
                            </button>
                          )}

                          {order.status === "PREPARING" && (
                            <button
                              onClick={() => {
                                onUpdateOrderStatus(order.id, "READY_FOR_PICKUP");
                                const rest = restaurants.find(r => r.id === order.restaurantId || r.name === order.restaurantName) || {
                                  name: order.restaurantName,
                                  lat: 12.9716,
                                  lng: 77.5946
                                };
                                const uberUrl = getUberRideBookingUrl(rest, order.address);
                                try {
                                  window.open(uberUrl, "_blank");
                                } catch (e) {
                                  console.warn("Popup blocked:", e);
                                }
                              }}
                              className="cursor-pointer bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 text-xs font-black px-3.5 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5 active:scale-95"
                              title="Mark order as Prepared and open Uber Ride booking with pickup & dropoff coordinates"
                            >
                              <span>🚕 Mark Prepared & Book Uber</span>
                            </button>
                          )}

                          {order.status === "READY_FOR_PICKUP" && (
                            <div className="flex items-center gap-1.5">
                              <a
                                href={getUberRideBookingUrl(
                                  restaurants.find(r => r.id === order.restaurantId || r.name === order.restaurantName) || { name: order.restaurantName, lat: 12.9716, lng: 77.5946 },
                                  order.address
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cursor-pointer bg-black hover:bg-zinc-800 text-emerald-400 border border-zinc-700 text-xs font-black px-3 py-2 rounded-xl flex items-center gap-1 shadow-sm transition-all"
                                title="Open Live in Uber to book driver"
                              >
                                <span>🚕 Uber Ride</span>
                              </a>
                              <button
                                onClick={() => onUpdateOrderStatus(order.id, "OUT_FOR_DELIVERY")}
                                className="cursor-pointer bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-black px-3.5 py-2 rounded-xl transition-all"
                              >
                                Handover to Rider
                              </button>
                            </div>
                          )}

                          {order.status === "OUT_FOR_DELIVERY" && (
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, "DELIVERED")}
                              className="cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black px-3.5 py-2 rounded-xl transition-all"
                            >
                              Mark Delivered
                            </button>
                          )}

                          {/* Inspect Details */}
                          <button
                            onClick={() => setInspectingOrder(order)}
                            className="cursor-pointer p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                            title="Inspect Order"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {onNavigateToTracking && (
                            <button
                              onClick={() => onNavigateToTracking(order.id)}
                              className="cursor-pointer p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-emerald-400 transition-colors"
                              title="Open In-App Customer Tracking View"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          )}

                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ─────────────────────────────────────────────────────────
              SECTION 4: DELIVERIES (UBER DIRECT INTEGRATION OVERVIEW)
          ───────────────────────────────────────────────────────── */}
          {activeSection === "deliveries" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight">
                  Courier &amp; Delivery Management
                </h2>
                <p className="text-xs text-zinc-400">
                  Real-time driver dispatch status, vehicle tracking &amp; Uber Direct backend sync
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-2">
                  <div className="flex items-center justify-between text-zinc-400 text-xs">
                    <span>Active Couriers</span>
                    <Truck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">4 Online</div>
                  <p className="text-[11px] text-zinc-500">Autonomous dispatch active</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-2">
                  <div className="flex items-center justify-between text-zinc-400 text-xs">
                    <span>Average Delivery Time</span>
                    <Clock className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-black text-blue-400 font-mono">22 mins</div>
                  <p className="text-[11px] text-zinc-500">Across Bengaluru central</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-2">
                  <div className="flex items-center justify-between text-zinc-400 text-xs">
                    <span>Courier Payout Pass-through</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">100%</div>
                  <p className="text-[10px] text-zinc-500">Zero platform cut taken</p>
                </div>
              </div>

              {/* Deliveries Table */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
                <h3 className="font-bold text-sm text-white">Active Delivery Jobs</h3>
                
                <div className="space-y-3">
                  {scopedOrders.map((o) => (
                    <div key={o.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-white">Job #{o.id}</span>
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">
                            Rider: {o.deliveryPartner.name} ({o.deliveryPartner.vehicleNumber})
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400">
                          Pickup: {o.restaurantName} → Dropoff: {o.address.text}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-mono font-bold text-emerald-400">
                        <span>ETA: {o.estimatedDeliveryMin}</span>
                        <span className="text-zinc-500">|</span>
                        <span>Fee: ₹{o.billing.deliveryFee}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ─────────────────────────────────────────────────────────
              SECTION 5: CUSTOMERS
          ───────────────────────────────────────────────────────── */}
          {activeSection === "customers" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight">
                  Customers Directory
                </h2>
                <p className="text-xs text-zinc-400">
                  Customer profiles, saved delivery addresses, and lifetime order histories
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-4 border-b border-zinc-800 pb-4">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
                    alt="Customer"
                    className="w-12 h-12 rounded-2xl object-cover border border-zinc-700"
                  />
                  <div>
                    <h4 className="font-bold text-white text-sm">Pooja Reddy</h4>
                    <p className="text-xs text-zinc-400 font-mono">pooja@resto-x.local • +91 98450 12345</p>
                    <p className="text-[10px] text-emerald-400 font-mono mt-0.5">Top Customer • {orders.length} orders placed</p>
                  </div>
                </div>
                <div className="text-xs text-zinc-400 space-y-1">
                  <p><strong>Default Address:</strong> Flat 402, Royal Palms, Lavelle Road, Bengaluru</p>
                  <p><strong>Favorite Cuisine:</strong> North Indian &amp; Charcoal Tandoor</p>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────
              SECTION 6: PAYMENTS & FINANCIALS
          ───────────────────────────────────────────────────────── */}
          {activeSection === "payments" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight">
                  Payments &amp; Transparent Ledger
                </h2>
                <p className="text-xs text-zinc-400">
                  Statutory 2.5% CGST + 2.5% SGST compliance and 100% food revenue disbursements
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-2">
                  <span className="text-xs text-zinc-400">Gross Restaurant Earnings</span>
                  <div className="text-2xl font-black text-emerald-400 font-mono">₹{totalRevenue.toFixed(2)}</div>
                  <p className="text-[10px] text-zinc-500">Transferred via UPI/NEFT daily</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-2">
                  <span className="text-xs text-zinc-400">Courier Payouts Dispatched</span>
                  <div className="text-2xl font-black text-white font-mono">
                    ₹{scopedOrders.reduce((sum, o) => sum + o.billing.deliveryFee, 0).toFixed(2)}
                  </div>
                  <p className="text-[10px] text-zinc-500">100% to delivery partners</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-2">
                  <span className="text-xs text-zinc-400">RestoX Platform Fee</span>
                  <div className="text-2xl font-black text-emerald-400 font-mono">₹0.00</div>
                  <p className="text-[10px] text-emerald-400">Zero commission promise</p>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────
              SECTION 7: ANALYTICS
          ───────────────────────────────────────────────────────── */}
          {activeSection === "analytics" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight">
                  Kitchen Analytics &amp; Sales
                </h2>
                <p className="text-xs text-zinc-400">
                  Best performing items and order volume distribution
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
                <h3 className="font-bold text-sm text-white">Top Ordered Dishes</h3>
                <div className="space-y-2">
                  {scopedMenuItems.slice(0, 5).map((item, idx) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-zinc-950 rounded-2xl text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-emerald-400 font-bold">#{idx + 1}</span>
                        <span className="font-bold text-white">{item.title}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">{item.category}</span>
                      </div>
                      <span className="font-mono text-emerald-400 font-bold">₹{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────
              SECTION 8: NOTIFICATIONS
          ───────────────────────────────────────────────────────── */}
          {activeSection === "notifications" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight">
                  Kitchen Alert Center
                </h2>
                <p className="text-xs text-zinc-400">
                  Live order notifications, courier assignments, and stock alerts
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-white">Autonomous Logistics Online</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">Uber Direct dispatch sync verified active in Bengaluru central area.</p>
                  </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-start gap-3">
                  <Bell className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-white">Menu Stock Synchronized</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">All customer-facing menu prices are reflecting verified store rates.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────
              SECTION 9: SETTINGS
          ───────────────────────────────────────────────────────── */}
          {activeSection === "settings" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight">
                  Store &amp; Dispatch Settings
                </h2>
                <p className="text-xs text-zinc-400">
                  Configure kitchen operating hours, delivery radius &amp; store details
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-zinc-400 font-bold">Restaurant Name</label>
                  <input
                    type="text"
                    readOnly
                    value={currentRestaurant?.name || "RestoX Kitchen"}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400 font-bold">Store Address</label>
                  <input
                    type="text"
                    readOnly
                    value={currentRestaurant?.address || "Bengaluru"}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400 font-bold">Statutory GST Rate</label>
                  <input
                    type="text"
                    readOnly
                    value="2.5% CGST + 2.5% SGST (5% Total Compliant)"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white font-mono focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. ADD / EDIT FOOD ITEM MODAL
      ───────────────────────────────────────────────────────────── */}
      {(isAddModalOpen || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => {
              setIsAddModalOpen(false);
              setEditingItem(null);
            }}
          />

          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-emerald-400" />
                <h3 className="font-black text-lg text-white">
                  {editingItem ? "Edit Food Item" : "Add New Food Item"}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingItem(null);
                }}
                className="p-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveItem} className="space-y-4">
              
              {/* Food Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300">Food Item Name *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Signature Paneer Tikka Butter Masala"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ingredients, preparation details, flavor profile..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Price & Category Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300">Price in ₹ (Menu Price) *</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 290"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Starters">Starters</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Biryani">Biryani</option>
                    <option value="Burgers">Burgers</option>
                    <option value="Dosas & Uttapams">Dosas &amp; Uttapams</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>
              </div>

              {/* Prep Time & Veg Flag */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300">Prep Time</label>
                  <input
                    type="text"
                    value={formData.prepTime}
                    onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                    placeholder="e.g. 15-20 min"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300">Dietary Type</label>
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isVeg: true })}
                      className={`cursor-pointer py-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1 ${
                        formData.isVeg
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                          : "bg-zinc-950 border-zinc-800 text-zinc-400"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Veg</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isVeg: false })}
                      className={`cursor-pointer py-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1 ${
                        !formData.isVeg
                          ? "bg-red-500/20 border-red-500 text-red-400"
                          : "bg-zinc-950 border-zinc-800 text-zinc-400"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-red-400" />
                      <span>Non-Veg</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Photo Selector with Preset Chips */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300">Food Image Preset / URL</label>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_FOOD_IMAGES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: preset.url })}
                      className={`cursor-pointer rounded-xl overflow-hidden border p-1 text-[10px] text-center space-y-1 transition-all ${
                        formData.image === preset.url
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                          : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-10 object-cover rounded-lg" />
                      <p className="truncate px-0.5">{preset.label}</p>
                    </button>
                  ))}
                </div>

                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Or paste custom image URL..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Stock Status & Bestseller Toggles */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-zinc-300">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="rounded text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Available for Online Orders (In Stock)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-zinc-300">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                    className="rounded text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Bestseller Badge</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingItem(null);
                  }}
                  className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black px-5 py-2.5 rounded-xl shadow-md shadow-emerald-500/20 transition-all active:scale-95"
                >
                  {editingItem ? "Save Changes" : "Create Item"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. DELETE CONFIRMATION MODAL
      ───────────────────────────────────────────────────────────── */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setDeletingItem(null)}
          />

          <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="font-black text-lg text-white">Delete Food Item?</h3>
              <p className="text-xs text-zinc-400">
                Are you sure you want to remove <strong className="text-white">"{deletingItem.title}"</strong> from the restaurant's active menu?
              </p>
              <p className="text-[11px] text-zinc-500">
                Existing order receipts will retain their historical pricing.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setDeletingItem(null)}
                className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold py-2.5 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="cursor-pointer bg-red-600 hover:bg-red-500 text-white text-xs font-black py-2.5 rounded-xl transition-all shadow-md shadow-red-600/20"
              >
                Delete Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. INSPECT ORDER MODAL
      ───────────────────────────────────────────────────────────── */}
      {inspectingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setInspectingOrder(null)}
          />

          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="font-black text-lg text-white">Order Details</h3>
                <p className="text-xs font-mono text-emerald-400">#{inspectingOrder.id}</p>
              </div>
              <button
                onClick={() => setInspectingOrder(null)}
                className="p-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-zinc-950 p-3.5 rounded-2xl space-y-2 border border-zinc-800">
                <span className="font-bold text-zinc-400 uppercase text-[10px]">Ordered Items</span>
                {inspectingOrder.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between text-zinc-200">
                    <span>{i.quantity}x {i.item.title}</span>
                    <span className="font-mono">₹{i.item.price * i.quantity}</span>
                  </div>
                ))}
                <div className="border-t border-zinc-800 pt-2 flex justify-between font-bold text-white text-sm">
                  <span>Grand Total:</span>
                  <span className="font-mono text-emerald-400">₹{inspectingOrder.billing.grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-zinc-950 p-3.5 rounded-2xl space-y-1.5 border border-zinc-800">
                <span className="font-bold text-zinc-400 uppercase text-[10px]">Delivery Info</span>
                <p className="text-zinc-200">📍 {inspectingOrder.address.label} — {inspectingOrder.address.text}</p>
                <p className="text-zinc-400">🚴 Courier: {inspectingOrder.deliveryPartner.name} ({inspectingOrder.deliveryPartner.vehicleNumber})</p>
                <p className="text-zinc-400">💳 Payment: {inspectingOrder.paymentMethod} ({inspectingOrder.paymentStatus})</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2">
              <a
                href={getUberRideBookingUrl(
                  restaurants.find(r => r.id === inspectingOrder.restaurantId || r.name === inspectingOrder.restaurantName) || { name: inspectingOrder.restaurantName, lat: 12.9716, lng: 77.5946 },
                  inspectingOrder.address
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer bg-black hover:bg-zinc-800 text-emerald-400 border border-zinc-700 text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md transition-all active:scale-95"
              >
                <span>🚕 Book Uber Delivery Ride</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setInspectingOrder(null)}
                className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
