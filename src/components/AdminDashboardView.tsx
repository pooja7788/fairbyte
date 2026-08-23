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
    <div className="min-h-screen bg-[#faf7f2] text-[#1c271b] flex flex-col font-sans">
      
      {/* ─────────────────────────────────────────────────────────────
          1. TOP APP BAR (RestoX Green & White Theme Header)
      ───────────────────────────────────────────────────────────── */}
      <header className="bg-white/95 border-b border-[#e4dcce] sticky top-0 z-40 px-4 sm:px-6 py-3.5 backdrop-blur-md shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Left: Brand + Hamburger for mobile */}
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white hover:bg-[#f6f2e8] text-[#2c3d28] border border-[#e4dcce] transition-colors cursor-pointer shadow-2xs"
              title="Open Navigation Menu"
            >
              <HamburgerIcon className="w-5 h-5" />
            </button>

            {/* Brand Logo & Admin Badge */}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#2d4023] flex items-center justify-center text-white shadow-md shadow-[#2d4023]/25">
                <ChefHat className="w-5 h-5 text-[#f3f7ee]" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-[#1c271b] font-sans">
                  Resto<span className="text-[#365029]">X</span>
                </span>
                <span className="w-px h-5 bg-[#dcd4c6] hidden sm:inline-block" />
                <span className="text-xs font-extrabold text-[#63705f] hidden sm:inline-block tracking-wide uppercase">
                  Admin Panel
                </span>
                <span className="bg-[#edf4e8] text-[#24371d] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#d2e2ca] hidden md:flex items-center gap-1.5 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#365029] animate-ping" />
                  LIVE LOGISTICS
                </span>
              </div>
            </div>
          </div>

          {/* Right: Restaurant Selector & Quick Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 bg-white border border-[#e4dcce] rounded-2xl px-3 py-1.5 shadow-2xs">
              <Store className="w-3.5 h-3.5 text-[#365029] shrink-0" />
              <div className="flex flex-col">
                <span className="text-[9px] text-[#798573] uppercase font-mono font-bold leading-none">Restaurant</span>
                <select
                  value={selectedRestaurantId}
                  onChange={(e) => setSelectedRestaurantId(e.target.value)}
                  className="bg-transparent text-xs font-bold text-[#1c271b] focus:outline-none cursor-pointer pr-1"
                >
                  <option value="all" className="bg-white text-[#1c271b]">All Outlets (Global)</option>
                  {restaurants.map((r) => (
                    <option key={r.id} value={r.id} className="bg-white text-[#1c271b]">
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Add Food Button */}
            <button
              onClick={openAddModal}
              className="cursor-pointer bg-[#2d4023] hover:bg-[#203018] text-white text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-[#2d4023]/25 transition-all active:scale-95"
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
        <aside className="w-64 border-r border-[#e4dcce] bg-white p-4 space-y-6 hidden lg:block shrink-0 shadow-2xs">
          
          {/* Restaurant Status Card */}
          <div className="bg-[#f6f2e8] border border-[#e4dcce] rounded-2xl p-3.5 space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#798573] font-bold uppercase">Store Status</span>
              <span className="w-2 h-2 rounded-full bg-[#365029] animate-pulse" />
            </div>
            <p className="text-xs font-bold text-[#1c271b] truncate">
              {currentRestaurant?.name || "Kitchen Command"}
            </p>
            <p className="text-[10px] text-[#63705f]">
              Kitchen receiving orders at 0% markup
            </p>
          </div>

          {/* Navigation Links - Vertical list, 1 per line */}
          <nav className="space-y-1">
            <span className="text-[10px] font-mono text-[#798573] font-bold uppercase px-3 pb-1 block">
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
                      ? "bg-[#2d4023] text-white shadow-md shadow-[#2d4023]/25"
                      : "text-[#4a5946] hover:text-[#1c271b] hover:bg-[#edf4e8]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-[#edf4e8] text-[#24371d]"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Metrics Footer */}
          <div className="pt-4 border-t border-[#e4dcce] space-y-2">
            <div className="flex justify-between text-[11px] text-[#63705f]">
              <span>Today's Food Sales:</span>
              <span className="font-mono font-bold text-[#1c271b]">₹{totalRevenue.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-[11px] text-[#63705f]">
              <span>Platform Fee:</span>
              <span className="font-mono font-bold text-[#2d4023]">₹0.00</span>
            </div>
          </div>

        </aside>

        {/* Mobile Slide-Out Drawer / Overlay */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
              onClick={() => setIsMobileSidebarOpen(false)}
            />

            {/* Slide Drawer */}
            <div className="relative w-72 max-w-[85vw] bg-white border-r border-[#e4dcce] p-5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
              
              <div className="space-y-6">
                {/* Header with Close button */}
                <div className="flex items-center justify-between border-b border-[#e4dcce] pb-3">
                  <div className="flex items-center gap-2">
                    <ChefHat className="w-5 h-5 text-[#2d4023]" />
                    <span className="font-black text-[#1c271b] text-base">RestoX Admin</span>
                  </div>
                  <button
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="p-1.5 rounded-xl bg-[#f6f2e8] text-[#4a5946] hover:text-[#1c271b] cursor-pointer"
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
                            ? "bg-[#2d4023] text-white shadow-md"
                            : "text-[#4a5946] hover:text-[#1c271b] hover:bg-[#edf4e8]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {item.icon}
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                            isActive ? "bg-white/20 text-white" : "bg-[#edf4e8] text-[#24371d]"
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
              <div className="pt-4 border-t border-[#e4dcce] text-xs text-[#798573] space-y-1 font-mono">
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
                  <h2 className="text-xl sm:text-2xl font-black text-[#1c271b] font-sans tracking-tight">
                    Dashboard Overview
                  </h2>
                  <p className="text-xs text-[#63705f]">
                    Live analytics &amp; kitchen performance for {selectedRestaurantId === "all" ? "All Outlets" : currentRestaurant?.name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveSection("menu")}
                    className="cursor-pointer bg-white hover:bg-[#f6f2e8] border border-[#e4dcce] text-[#2c3d28] text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#365029]" />
                    <span>Manage Menu</span>
                  </button>
                  <button
                    onClick={() => setActiveSection("orders")}
                    className="cursor-pointer bg-[#2d4023] hover:bg-[#203018] text-white text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-md shadow-[#2d4023]/25"
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>View Orders ({pendingOrders.length + preparingOrders.length})</span>
                  </button>
                </div>
              </div>

              {/* 5 Summary KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                
                {/* 1. Total Orders */}
                <div className="bg-white border border-[#eae4d8] rounded-2xl p-4 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between text-[#798573] text-xs">
                    <span>Total Orders</span>
                    <Package className="w-4 h-4 text-[#365029]" />
                  </div>
                  <div className="text-2xl font-black text-[#1c271b] font-mono">{totalOrdersCount}</div>
                  <p className="text-[10px] text-[#63705f]">{completedOrders.length} delivered</p>
                </div>

                {/* 2. Pending Orders */}
                <div className="bg-white border border-[#eae4d8] rounded-2xl p-4 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between text-[#798573] text-xs">
                    <span>Pending / Prep</span>
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-black text-amber-700 font-mono">
                    {pendingOrders.length + preparingOrders.length}
                  </div>
                  <p className="text-[10px] text-[#63705f]">In kitchen queue</p>
                </div>

                {/* 3. Active Deliveries */}
                <div className="bg-white border border-[#eae4d8] rounded-2xl p-4 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between text-[#798573] text-xs">
                    <span>In Transit</span>
                    <Truck className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-black text-blue-700 font-mono">
                    {activeDeliveriesCount}
                  </div>
                  <p className="text-[10px] text-[#63705f]">Uber courier partners</p>
                </div>

                {/* 4. Menu Items */}
                <div className="bg-white border border-[#eae4d8] rounded-2xl p-4 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between text-[#798573] text-xs">
                    <span>Menu Catalog</span>
                    <ShoppingBag className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-2xl font-black text-[#1c271b] font-mono">{scopedMenuItems.length}</div>
                  <p className="text-[10px] text-[#2d4023] font-bold">{availableItemsCount} in stock</p>
                </div>

                {/* 5. Total Revenue */}
                <div className="bg-white border border-[#eae4d8] rounded-2xl p-4 space-y-1.5 shadow-2xs col-span-2 sm:col-span-1">
                  <div className="flex items-center justify-between text-[#798573] text-xs">
                    <span>Food Revenue</span>
                    <DollarSign className="w-4 h-4 text-[#2d4023]" />
                  </div>
                  <div className="text-2xl font-black text-[#2d4023] font-mono">₹{totalRevenue.toFixed(0)}</div>
                  <p className="text-[10px] text-[#63705f]">100% to restaurant</p>
                </div>

              </div>

              {/* Two Column Grid: Recent Orders + Menu Highlights */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Recent Orders Table */}
                <div className="lg:col-span-7 bg-white border border-[#eae4d8] rounded-3xl p-5 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-[#f0eae0] pb-3">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-[#365029]" />
                      <h3 className="font-black text-sm text-[#1c271b]">Recent Orders Queue</h3>
                    </div>
                    <button
                      onClick={() => setActiveSection("orders")}
                      className="text-xs font-bold text-[#2d4023] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>View All</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {scopedOrders.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#798573]">No recent orders found.</div>
                  ) : (
                    <div className="space-y-2">
                      {scopedOrders.slice(0, 5).map((order) => (
                        <div
                          key={order.id}
                          onClick={() => setInspectingOrder(order)}
                          className="bg-[#faf7f2] border border-[#eae4d8] hover:border-[#365029]/40 rounded-2xl p-3 flex items-center justify-between gap-3 cursor-pointer transition-all hover:bg-white"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-black text-[#1c271b]">#{order.id}</span>
                              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                                order.status === "DELIVERED" || order.status === "COMPLETED"
                                  ? "bg-[#edf4e8] text-[#24371d] border border-[#d2e2ca]"
                                  : order.status === "OUT_FOR_DELIVERY" || order.status === "DELIVERING"
                                  ? "bg-blue-50 text-blue-800 border border-blue-200"
                                  : "bg-amber-50 text-amber-900 border border-amber-200"
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#63705f] truncate mt-0.5">
                              {order.items.map(i => `${i.quantity}x ${i.item.title}`).join(", ")}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-mono font-bold text-xs text-[#2d4023]">
                              ₹{order.billing.subtotal.toFixed(0)}
                            </div>
                            <div className="text-[10px] text-[#798573]">{order.createdAt}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Menu Highlights / Top Items */}
                <div className="lg:col-span-5 bg-white border border-[#eae4d8] rounded-3xl p-5 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-[#f0eae0] pb-3">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-[#365029]" />
                      <h3 className="font-black text-sm text-[#1c271b]">Menu Quick Controls</h3>
                    </div>
                    <button
                      onClick={() => setActiveSection("menu")}
                      className="text-xs font-bold text-[#2d4023] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>Manage All</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {scopedMenuItems.slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        className="bg-[#faf7f2] border border-[#eae4d8] rounded-2xl p-2.5 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-10 h-10 rounded-xl object-cover border border-[#e4dcce] shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-xs text-[#1c271b] truncate">{item.title}</p>
                            <p className="text-[10px] font-mono text-[#2d4023] font-bold">₹{item.price}</p>
                          </div>
                        </div>

                        {/* Quick Stock Switch */}
                        <button
                          onClick={() => onToggleItemStock(item.id, !item.isAvailable)}
                          className={`cursor-pointer px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            item.isAvailable !== false
                              ? "bg-[#edf4e8] text-[#24371d] border border-[#d2e2ca]"
                              : "bg-red-50 text-red-800 border border-red-200"
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
                    className="cursor-pointer w-full bg-[#f6f2e8] hover:bg-[#eef4ea] border border-dashed border-[#cfddc7] text-[#2d4023] text-xs font-bold p-3 rounded-2xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-[#365029]" />
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
                  <h2 className="text-xl sm:text-2xl font-black text-[#1c271b] font-sans tracking-tight">
                    Restaurant Menu Management
                  </h2>
                  <p className="text-xs text-[#63705f]">
                    Live catalog for {selectedRestaurantId === "all" ? "All Restaurants" : currentRestaurant?.name}. Changes immediately reflect in customer view.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={openAddModal}
                    className="cursor-pointer bg-[#2d4023] hover:bg-[#203018] text-white text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md shadow-[#2d4023]/25 transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Add Food Item</span>
                  </button>
                </div>
              </div>

              {/* Menu Stats Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white border border-[#eae4d8] rounded-2xl p-3.5 shadow-2xs">
                  <span className="text-[10px] font-mono text-[#798573] uppercase">Total Items</span>
                  <p className="text-xl font-black text-[#1c271b] font-mono mt-0.5">{scopedMenuItems.length}</p>
                </div>
                <div className="bg-white border border-[#eae4d8] rounded-2xl p-3.5 shadow-2xs">
                  <span className="text-[10px] font-mono text-[#798573] uppercase">Available / In Stock</span>
                  <p className="text-xl font-black text-[#2d4023] font-mono mt-0.5">{availableItemsCount}</p>
                </div>
                <div className="bg-white border border-[#eae4d8] rounded-2xl p-3.5 shadow-2xs">
                  <span className="text-[10px] font-mono text-[#798573] uppercase">Unavailable / Sold Out</span>
                  <p className="text-xl font-black text-red-600 font-mono mt-0.5">{unavailableItemsCount}</p>
                </div>
                <div className="bg-white border border-[#eae4d8] rounded-2xl p-3.5 shadow-2xs">
                  <span className="text-[10px] font-mono text-[#798573] uppercase">Active Categories</span>
                  <p className="text-xl font-black text-purple-700 font-mono mt-0.5">{availableCategories.length - 1}</p>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white border border-[#eae4d8] p-3 rounded-2xl shadow-2xs">
                
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#8a9585] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search dishes, descriptions, categories..."
                    className="w-full bg-[#faf7f2] border border-[#e4dcce] rounded-xl pl-10 pr-4 py-2 text-xs text-[#1c271b] placeholder-[#8e998a] focus:outline-none focus:border-[#365029] focus:bg-white transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#798573] hover:text-[#1c271b] text-xs cursor-pointer"
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
                          ? "bg-[#2d4023] text-white shadow-xs"
                          : "bg-[#f6f2e8] text-[#4a5946] hover:bg-[#edf4e8] hover:text-[#1c271b]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

              </div>

              {/* Menu Items Grid */}
              {scopedMenuItems.length === 0 ? (
                <div className="bg-white border border-dashed border-[#dcd4c6] rounded-3xl p-12 text-center space-y-3 shadow-2xs">
                  <ShoppingBag className="w-8 h-8 text-[#8a9585] mx-auto" />
                  <h3 className="font-bold text-[#1c271b] text-sm">No food items found</h3>
                  <p className="text-xs text-[#63705f] max-w-sm mx-auto">
                    Try clearing search filters or add a new food item to this restaurant catalog.
                  </p>
                  <button
                    onClick={openAddModal}
                    className="cursor-pointer bg-[#2d4023] text-white text-xs font-black px-4 py-2.5 rounded-xl inline-flex items-center gap-1.5 mt-2 shadow-md shadow-[#2d4023]/25"
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
                        className={`bg-white border rounded-3xl p-4 flex flex-col justify-between gap-4 transition-all duration-200 shadow-2xs ${
                          isAvail ? "border-[#eae4d8] hover:border-[#365029]/40" : "border-red-200 opacity-75 bg-[#fbf9f4]"
                        }`}
                      >
                        {/* Top: Image + Info */}
                        <div className="flex gap-3.5">
                          <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-[#f4f0e8] border border-[#e4dcce] shrink-0">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            {/* Veg / Non-veg indicator */}
                            <div className="absolute top-1.5 left-1.5 w-4 h-4 rounded-sm bg-white/95 border flex items-center justify-center p-0.5 shadow-2xs">
                              <div className={`w-2 h-2 rounded-full ${item.isVeg ? "bg-[#2d4023]" : "bg-red-600"}`} />
                            </div>
                          </div>

                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-black text-sm text-[#1c271b] truncate">{item.title}</h4>
                              <span className="font-mono font-black text-[#2d4023] text-sm">
                                ₹{item.price}
                              </span>
                            </div>

                            <p className="text-[11px] text-[#63705f] line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>

                            <div className="flex items-center gap-2 pt-1">
                              <span className="bg-[#edf4e8] text-[#24371d] text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-[#d2e2ca]">
                                {item.category}
                              </span>
                              {item.prepTime && (
                                <span className="text-[10px] text-[#798573] flex items-center gap-0.5">
                                  <Clock className="w-3 h-3 text-[#365029]" />
                                  <span>{item.prepTime}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Bottom: Action Controls */}
                        <div className="flex items-center justify-between pt-2 border-t border-[#f0eae0] gap-2">
                          
                          {/* Availability Toggle */}
                          <button
                            onClick={() => onToggleItemStock(item.id, !isAvail)}
                            className={`cursor-pointer px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                              isAvail
                                ? "bg-[#edf4e8] text-[#24371d] border border-[#d2e2ca] hover:bg-[#dcecd5]"
                                : "bg-red-50 text-red-800 border border-red-200 hover:bg-red-100"
                            }`}
                            title="Toggle Availability"
                          >
                            <span className={`w-2 h-2 rounded-full ${isAvail ? "bg-[#2d4023]" : "bg-red-600"}`} />
                            <span>{isAvail ? "Available" : "Unavailable"}</span>
                          </button>

                          {/* Action Buttons: Edit & Delete */}
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => openEditModal(item)}
                              className="cursor-pointer p-2 rounded-xl bg-[#f6f2e8] hover:bg-[#edf4e8] text-[#2c3d28] border border-[#e4dcce] transition-colors shadow-2xs"
                              title="Edit Food Item"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setDeletingItem(item)}
                              className="cursor-pointer p-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 transition-colors shadow-2xs"
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
                  <h2 className="text-xl sm:text-2xl font-black text-[#1c271b] font-sans tracking-tight">
                    Live Orders Dispatch
                  </h2>
                  <p className="text-xs text-[#63705f]">
                    Track kitchen prep status, courier dispatch, and customer receipts
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#63705f] font-mono bg-white px-3 py-1.5 rounded-xl border border-[#e4dcce]">
                    Total: <strong>{scopedOrders.length}</strong> orders
                  </span>
                </div>
              </div>

              {/* Order Status Swimlanes / Table */}
              <div className="space-y-3">
                {scopedOrders.length === 0 ? (
                  <div className="bg-white border border-[#eae4d8] rounded-3xl p-12 text-center text-xs text-[#798573] shadow-2xs">
                    No orders placed yet. Place an order in customer view to see live dispatch here!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {scopedOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white border border-[#eae4d8] hover:border-[#365029]/40 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all shadow-2xs"
                      >
                        {/* Order Header & Items */}
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-sm font-black text-[#1c271b]">#{order.id}</span>
                            <span className={`text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full border ${
                              order.status === "DELIVERED" || order.status === "COMPLETED"
                                ? "bg-[#edf4e8] text-[#24371d] border border-[#d2e2ca]"
                                : order.status === "OUT_FOR_DELIVERY" || order.status === "DELIVERING"
                                ? "bg-blue-50 text-blue-800 border border-blue-200"
                                : "bg-amber-50 text-amber-900 border border-amber-200"
                            }`}>
                              {order.status}
                            </span>
                            <span className="text-xs text-[#798573]">{order.createdAt}</span>
                          </div>

                          <div className="text-xs text-[#2c3d28]">
                            {order.items.map(i => `${i.quantity}x ${i.item.title} (₹${i.item.price})`).join(" • ")}
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-[#63705f]">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#365029]" />
                              <span>{order.address.label} ({order.address.text.substring(0, 30)}...)</span>
                            </span>
                            <span>•</span>
                            <span>Paid via: <strong className="text-[#1c271b]">{order.paymentMethod}</strong></span>
                          </div>
                        </div>

                        {/* Status Transition Actions */}
                        <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 border-[#f0eae0] pt-3 md:pt-0">
                          
                          {/* Order Action Buttons */}
                          {order.status === "PLACED" && (
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, "ACCEPTED")}
                              className="cursor-pointer bg-[#2d4023] hover:bg-[#203018] text-white text-xs font-black px-3.5 py-2 rounded-xl transition-all shadow-sm"
                            >
                              Accept Order
                            </button>
                          )}

                          {order.status === "ACCEPTED" && (
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, "PREPARING")}
                              className="cursor-pointer bg-amber-500 hover:bg-amber-600 text-white text-xs font-black px-3.5 py-2 rounded-xl transition-all shadow-sm"
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
                              className="cursor-pointer bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black px-3.5 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5 active:scale-95"
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
                                className="cursor-pointer bg-[#2d4023] hover:bg-[#203018] text-white text-xs font-black px-3.5 py-2 rounded-xl transition-all shadow-sm"
                              >
                                Handover to Rider
                              </button>
                            </div>
                          )}

                          {order.status === "OUT_FOR_DELIVERY" && (
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, "DELIVERED")}
                              className="cursor-pointer bg-[#2d4023] hover:bg-[#203018] text-white text-xs font-black px-3.5 py-2 rounded-xl transition-all shadow-sm"
                            >
                              Mark Delivered
                            </button>
                          )}

                          {/* Inspect Details */}
                          <button
                            onClick={() => setInspectingOrder(order)}
                            className="cursor-pointer p-2 rounded-xl bg-white hover:bg-[#f6f2e8] text-[#2c3d28] border border-[#e4dcce] transition-colors shadow-2xs"
                            title="Inspect Order"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {onNavigateToTracking && (
                            <button
                              onClick={() => onNavigateToTracking(order.id)}
                              className="cursor-pointer p-2 rounded-xl bg-white hover:bg-[#edf4e8] text-[#2d4023] border border-[#e4dcce] transition-colors shadow-2xs"
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
                <h2 className="text-xl sm:text-2xl font-black text-[#1c271b] font-sans tracking-tight">
                  Courier &amp; Delivery Management
                </h2>
                <p className="text-xs text-[#63705f]">
                  Real-time driver dispatch status, vehicle tracking &amp; Uber Direct backend sync
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-[#eae4d8] rounded-3xl p-5 space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between text-[#798573] text-xs">
                    <span>Active Couriers</span>
                    <Truck className="w-4 h-4 text-[#2d4023]" />
                  </div>
                  <div className="text-2xl font-black text-[#1c271b] font-mono">4 Online</div>
                  <p className="text-[11px] text-[#63705f]">Autonomous dispatch active</p>
                </div>

                <div className="bg-white border border-[#eae4d8] rounded-3xl p-5 space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between text-[#798573] text-xs">
                    <span>Average Delivery Time</span>
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-black text-blue-700 font-mono">22 mins</div>
                  <p className="text-[11px] text-[#63705f]">Across Bengaluru central</p>
                </div>

                <div className="bg-white border border-[#eae4d8] rounded-3xl p-5 space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between text-[#798573] text-xs">
                    <span>Courier Payout Pass-through</span>
                    <DollarSign className="w-4 h-4 text-[#2d4023]" />
                  </div>
                  <div className="text-2xl font-black text-[#2d4023] font-mono">100%</div>
                  <p className="text-[10px] text-[#63705f]">Zero platform cut taken</p>
                </div>
              </div>

              {/* Deliveries Table */}
              <div className="bg-white border border-[#eae4d8] rounded-3xl p-6 space-y-4 shadow-2xs">
                <h3 className="font-bold text-sm text-[#1c271b]">Active Delivery Jobs</h3>
                
                <div className="space-y-3">
                  {scopedOrders.map((o) => (
                    <div key={o.id} className="bg-[#faf7f2] border border-[#eae4d8] rounded-2xl p-4 flex flex-col md:flex-row justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-[#1c271b]">Job #{o.id}</span>
                          <span className="text-[10px] bg-[#edf4e8] text-[#24371d] border border-[#d2e2ca] px-2 py-0.5 rounded font-mono font-bold">
                            Rider: {o.deliveryPartner.name} ({o.deliveryPartner.vehicleNumber})
                          </span>
                        </div>
                        <p className="text-xs text-[#63705f]">
                          Pickup: {o.restaurantName} → Dropoff: {o.address.text}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-mono font-bold text-[#2d4023]">
                        <span>ETA: {o.estimatedDeliveryMin}</span>
                        <span className="text-[#dcd4c6]">|</span>
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
                <h2 className="text-xl sm:text-2xl font-black text-[#1c271b] font-sans tracking-tight">
                  Customers Directory
                </h2>
                <p className="text-xs text-[#63705f]">
                  Customer profiles, saved delivery addresses, and lifetime order histories
                </p>
              </div>

              <div className="bg-white border border-[#eae4d8] rounded-3xl p-6 space-y-4 shadow-2xs">
                <div className="flex items-center gap-4 border-b border-[#f0eae0] pb-4">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
                    alt="Customer"
                    className="w-12 h-12 rounded-2xl object-cover border border-[#e4dcce]"
                  />
                  <div>
                    <h4 className="font-bold text-[#1c271b] text-sm">Pooja Reddy</h4>
                    <p className="text-xs text-[#63705f] font-mono">pooja@resto-x.local • +91 98450 12345</p>
                    <p className="text-[10px] text-[#2d4023] font-mono font-bold mt-0.5">Top Customer • {orders.length} orders placed</p>
                  </div>
                </div>
                <div className="text-xs text-[#63705f] space-y-1">
                  <p><strong className="text-[#1c271b]">Default Address:</strong> Flat 402, Royal Palms, Lavelle Road, Bengaluru</p>
                  <p><strong className="text-[#1c271b]">Favorite Cuisine:</strong> North Indian &amp; Charcoal Tandoor</p>
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
                <h2 className="text-xl sm:text-2xl font-black text-[#1c271b] font-sans tracking-tight">
                  Payments &amp; Transparent Ledger
                </h2>
                <p className="text-xs text-[#63705f]">
                  Statutory 2.5% CGST + 2.5% SGST compliance and 100% food revenue disbursements
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-[#eae4d8] rounded-3xl p-5 space-y-2 shadow-2xs">
                  <span className="text-xs text-[#798573]">Gross Restaurant Earnings</span>
                  <div className="text-2xl font-black text-[#2d4023] font-mono">₹{totalRevenue.toFixed(2)}</div>
                  <p className="text-[10px] text-[#63705f]">Transferred via UPI/NEFT daily</p>
                </div>

                <div className="bg-white border border-[#eae4d8] rounded-3xl p-5 space-y-2 shadow-2xs">
                  <span className="text-xs text-[#798573]">Courier Payouts Dispatched</span>
                  <div className="text-2xl font-black text-[#1c271b] font-mono">
                    ₹{scopedOrders.reduce((sum, o) => sum + o.billing.deliveryFee, 0).toFixed(2)}
                  </div>
                  <p className="text-[10px] text-[#63705f]">100% to delivery partners</p>
                </div>

                <div className="bg-white border border-[#eae4d8] rounded-3xl p-5 space-y-2 shadow-2xs">
                  <span className="text-xs text-[#798573]">RestoX Platform Fee</span>
                  <div className="text-2xl font-black text-[#2d4023] font-mono">₹0.00</div>
                  <p className="text-[10px] text-[#2d4023] font-bold">Zero commission promise</p>
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
                <h2 className="text-xl sm:text-2xl font-black text-[#1c271b] font-sans tracking-tight">
                  Kitchen Analytics &amp; Sales
                </h2>
                <p className="text-xs text-[#63705f]">
                  Best performing items and order volume distribution
                </p>
              </div>

              <div className="bg-white border border-[#eae4d8] rounded-3xl p-6 space-y-4 shadow-2xs">
                <h3 className="font-bold text-sm text-[#1c271b]">Top Ordered Dishes</h3>
                <div className="space-y-2">
                  {scopedMenuItems.slice(0, 5).map((item, idx) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-[#faf7f2] rounded-2xl text-xs border border-[#eae4d8]">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[#2d4023] font-bold">#{idx + 1}</span>
                        <span className="font-bold text-[#1c271b]">{item.title}</span>
                        <span className="text-[10px] text-[#798573] font-mono">{item.category}</span>
                      </div>
                      <span className="font-mono text-[#2d4023] font-bold">₹{item.price}</span>
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
                <h2 className="text-xl sm:text-2xl font-black text-[#1c271b] font-sans tracking-tight">
                  Kitchen Alert Center
                </h2>
                <p className="text-xs text-[#63705f]">
                  Live order notifications, courier assignments, and stock alerts
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-white border border-[#eae4d8] rounded-2xl p-4 flex items-start gap-3 shadow-2xs">
                  <CheckCircle2 className="w-5 h-5 text-[#2d4023] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-[#1c271b]">Autonomous Logistics Online</h4>
                    <p className="text-xs text-[#63705f] mt-0.5">Uber Direct dispatch sync verified active in Bengaluru central area.</p>
                  </div>
                </div>

                <div className="bg-white border border-[#eae4d8] rounded-2xl p-4 flex items-start gap-3 shadow-2xs">
                  <Bell className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-[#1c271b]">Menu Stock Synchronized</h4>
                    <p className="text-xs text-[#63705f] mt-0.5">All customer-facing menu prices are reflecting verified store rates.</p>
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
                <h2 className="text-xl sm:text-2xl font-black text-[#1c271b] font-sans tracking-tight">
                  Store &amp; Dispatch Settings
                </h2>
                <p className="text-xs text-[#63705f]">
                  Configure kitchen operating hours, delivery radius &amp; store details
                </p>
              </div>

              <div className="bg-white border border-[#eae4d8] rounded-3xl p-6 space-y-4 text-xs shadow-2xs">
                <div className="space-y-1">
                  <label className="text-[#798573] font-bold">Restaurant Name</label>
                  <input
                    type="text"
                    readOnly
                    value={currentRestaurant?.name || "RestoX Kitchen"}
                    className="w-full bg-[#faf7f2] border border-[#e4dcce] rounded-xl p-2.5 text-[#1c271b] font-medium focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#798573] font-bold">Store Address</label>
                  <input
                    type="text"
                    readOnly
                    value={currentRestaurant?.address || "Bengaluru"}
                    className="w-full bg-[#faf7f2] border border-[#e4dcce] rounded-xl p-2.5 text-[#1c271b] font-medium focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#798573] font-bold">Statutory GST Rate</label>
                  <input
                    type="text"
                    readOnly
                    value="2.5% CGST + 2.5% SGST (5% Total Compliant)"
                    className="w-full bg-[#faf7f2] border border-[#e4dcce] rounded-xl p-2.5 text-[#1c271b] font-mono focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. ADD / EDIT FOOD ITEM MODAL (Crisp White + Green Accents)
      ───────────────────────────────────────────────────────────── */}
      {(isAddModalOpen || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => {
              setIsAddModalOpen(false);
              setEditingItem(null);
            }}
          />

          <div className="relative w-full max-w-lg bg-white border border-[#e4dcce] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#f0eae0] pb-3">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-[#2d4023]" />
                <h3 className="font-black text-lg text-[#1c271b]">
                  {editingItem ? "Edit Food Item" : "Add New Food Item"}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingItem(null);
                }}
                className="p-1.5 rounded-lg bg-[#f6f2e8] text-[#798573] hover:text-[#1c271b] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveItem} className="space-y-4">
              
              {/* Food Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1c271b]">Food Item Name *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Signature Paneer Tikka Butter Masala"
                  className="w-full bg-[#faf7f2] border border-[#e4dcce] rounded-xl px-3.5 py-2.5 text-xs text-[#1c271b] placeholder-[#8e998a] focus:outline-none focus:border-[#365029] focus:bg-white transition-all"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1c271b]">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ingredients, preparation details, flavor profile..."
                  className="w-full bg-[#faf7f2] border border-[#e4dcce] rounded-xl px-3.5 py-2 text-xs text-[#1c271b] placeholder-[#8e998a] focus:outline-none focus:border-[#365029] focus:bg-white transition-all"
                />
              </div>

              {/* Price & Category Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1c271b]">Price in ₹ (Menu Price) *</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 290"
                    className="w-full bg-[#faf7f2] border border-[#e4dcce] rounded-xl px-3.5 py-2.5 text-xs text-[#1c271b] font-mono placeholder-[#8e998a] focus:outline-none focus:border-[#365029] focus:bg-white transition-all font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1c271b]">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#faf7f2] border border-[#e4dcce] rounded-xl px-3 py-2.5 text-xs text-[#1c271b] font-bold focus:outline-none focus:border-[#365029] cursor-pointer"
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
                  <label className="text-xs font-bold text-[#1c271b]">Prep Time</label>
                  <input
                    type="text"
                    value={formData.prepTime}
                    onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                    placeholder="e.g. 15-20 min"
                    className="w-full bg-[#faf7f2] border border-[#e4dcce] rounded-xl px-3.5 py-2.5 text-xs text-[#1c271b] placeholder-[#8e998a] focus:outline-none focus:border-[#365029] focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1c271b]">Dietary Type</label>
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isVeg: true })}
                      className={`cursor-pointer py-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                        formData.isVeg
                          ? "bg-[#edf4e8] border-[#365029] text-[#24371d] font-black"
                          : "bg-white border-[#e4dcce] text-[#798573]"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#2d4023]" />
                      <span>Veg</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isVeg: false })}
                      className={`cursor-pointer py-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                        !formData.isVeg
                          ? "bg-red-50 border-red-500 text-red-700 font-black"
                          : "bg-white border-[#e4dcce] text-[#798573]"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-red-600" />
                      <span>Non-Veg</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Photo Selector with Preset Chips */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1c271b]">Food Image Preset / URL</label>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_FOOD_IMAGES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: preset.url })}
                      className={`cursor-pointer rounded-xl overflow-hidden border p-1 text-[10px] text-center space-y-1 transition-all ${
                        formData.image === preset.url
                          ? "border-[#365029] bg-[#edf4e8] text-[#24371d] font-bold shadow-xs"
                          : "border-[#e4dcce] bg-[#faf7f2] text-[#63705f] hover:border-[#365029]/40"
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
                  className="w-full bg-[#faf7f2] border border-[#e4dcce] rounded-xl px-3.5 py-2 text-xs text-[#1c271b] placeholder-[#8e998a] focus:outline-none focus:border-[#365029] focus:bg-white transition-all"
                />
              </div>

              {/* Stock Status & Bestseller Toggles */}
              <div className="flex items-center justify-between pt-2 border-t border-[#f0eae0]">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#1c271b]">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="rounded text-[#2d4023] focus:ring-[#2d4023]"
                  />
                  <span>Available for Online Orders (In Stock)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#1c271b]">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                    className="rounded text-[#2d4023] focus:ring-[#2d4023]"
                  />
                  <span>Bestseller Badge</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#f0eae0]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingItem(null);
                  }}
                  className="cursor-pointer bg-white hover:bg-[#f6f2e8] text-[#4a5946] border border-[#e4dcce] text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cursor-pointer bg-[#2d4023] hover:bg-[#203018] text-white text-xs font-black px-5 py-2.5 rounded-xl shadow-md shadow-[#2d4023]/25 transition-all active:scale-95"
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
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setDeletingItem(null)}
          />

          <div className="relative w-full max-w-md bg-white border border-[#e4dcce] rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="font-black text-lg text-[#1c271b]">Delete Food Item?</h3>
              <p className="text-xs text-[#63705f]">
                Are you sure you want to remove <strong className="text-[#1c271b]">"{deletingItem.title}"</strong> from the restaurant's active menu?
              </p>
              <p className="text-[11px] text-[#798573]">
                Existing order receipts will retain their historical pricing.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setDeletingItem(null)}
                className="cursor-pointer bg-white hover:bg-[#f6f2e8] text-[#4a5946] border border-[#e4dcce] text-xs font-bold py-2.5 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="cursor-pointer bg-red-600 hover:bg-red-700 text-white text-xs font-black py-2.5 rounded-xl transition-all shadow-md shadow-red-600/20"
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
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setInspectingOrder(null)}
          />

          <div className="relative w-full max-w-lg bg-white border border-[#e4dcce] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between border-b border-[#f0eae0] pb-3">
              <div>
                <h3 className="font-black text-lg text-[#1c271b]">Order Details</h3>
                <p className="text-xs font-mono text-[#2d4023] font-bold">#{inspectingOrder.id}</p>
              </div>
              <button
                onClick={() => setInspectingOrder(null)}
                className="p-1.5 rounded-lg bg-[#f6f2e8] text-[#798573] hover:text-[#1c271b] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#faf7f2] p-3.5 rounded-2xl space-y-2 border border-[#eae4d8]">
                <span className="font-bold text-[#798573] uppercase text-[10px]">Ordered Items</span>
                {inspectingOrder.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between text-[#1c271b]">
                    <span>{i.quantity}x {i.item.title}</span>
                    <span className="font-mono font-bold">₹{i.item.price * i.quantity}</span>
                  </div>
                ))}
                <div className="border-t border-[#e4dcce] pt-2 flex justify-between font-bold text-[#1c271b] text-sm">
                  <span>Grand Total:</span>
                  <span className="font-mono text-[#2d4023] font-black">₹{inspectingOrder.billing.grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-[#faf7f2] p-3.5 rounded-2xl space-y-1.5 border border-[#eae4d8]">
                <span className="font-bold text-[#798573] uppercase text-[10px]">Delivery Info</span>
                <p className="text-[#1c271b]">📍 {inspectingOrder.address.label} — {inspectingOrder.address.text}</p>
                <p className="text-[#63705f]">🚴 Courier: {inspectingOrder.deliveryPartner.name} ({inspectingOrder.deliveryPartner.vehicleNumber})</p>
                <p className="text-[#63705f]">💳 Payment: {inspectingOrder.paymentMethod} ({inspectingOrder.paymentStatus})</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#f0eae0]">
              <a
                href={getUberRideBookingUrl(
                  restaurants.find(r => r.id === inspectingOrder.restaurantId || r.name === inspectingOrder.restaurantName) || { name: inspectingOrder.restaurantName, lat: 12.9716, lng: 77.5946 },
                  inspectingOrder.address
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer bg-black hover:bg-zinc-800 text-emerald-400 border border-zinc-700 text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md transition-all active:scale-95"
              >
                <span>🚕 Book Uber Delivery Ride</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setInspectingOrder(null)}
                className="cursor-pointer bg-white hover:bg-[#f6f2e8] text-[#4a5946] border border-[#e4dcce] text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
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
