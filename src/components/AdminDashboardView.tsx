import React, { useState } from "react";
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
  ExternalLink
} from "lucide-react";
import { Order, OrderStatus, FoodItem, Restaurant } from "../types";

interface AdminDashboardViewProps {
  orders: Order[];
  menuItems: FoodItem[];
  restaurants: Restaurant[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onToggleItemStock: (itemId: string, inStock: boolean) => void;
  onNavigateToTracking?: (orderId: string) => void;
}

export default function AdminDashboardView({
  orders,
  menuItems,
  restaurants,
  onUpdateOrderStatus,
  onToggleItemStock,
  onNavigateToTracking
}: AdminDashboardViewProps) {
  const [activeTab, setActiveTab] = useState<"orders" | "menu" | "analytics">("orders");
  const [selectedRestaurantFilter, setSelectedRestaurantFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter orders
  const filteredOrders = orders.filter(order => {
    if (selectedRestaurantFilter !== "all" && order.restaurantId !== selectedRestaurantFilter) {
      return false;
    }
    if (searchQuery.trim() && !order.id.toLowerCase().includes(searchQuery.toLowerCase()) && !order.restaurantName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Categorize orders for Kanban
  const incomingOrders = filteredOrders.filter(o => o.status === "PLACED");
  const preparingOrders = filteredOrders.filter(o => o.status === "ACCEPTED" || o.status === "PREPARING");
  const readyOrders = filteredOrders.filter(o => o.status === "READY_FOR_PICKUP" || o.status === "RIDER_ASSIGNED");
  const outForDeliveryOrders = filteredOrders.filter(o => o.status === "OUT_FOR_DELIVERY" || o.status === "DELIVERING");
  const completedOrders = filteredOrders.filter(o => o.status === "DELIVERED" || o.status === "COMPLETED");

  // Metrics
  const totalGrossFoodRevenue = orders.reduce((sum, o) => sum + o.billing.subtotal, 0);
  const totalCourierPayouts = orders.reduce((sum, o) => sum + o.billing.deliveryFee, 0);
  const totalCustomerSavings = orders.reduce((sum, o) => sum + (o.billing.traditionalComparison?.savings || 60), 0);
  const activeOrdersCount = incomingOrders.length + preparingOrders.length + readyOrders.length + outForDeliveryOrders.length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-emerald-950 border-b border-zinc-800 sticky top-0 z-30 px-4 sm:px-8 py-4 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Cup Icon Badge */}
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                {/* Brand: RestoX */}
                <h1 className="font-black text-lg sm:text-xl text-white tracking-tight font-sans">
                  Resto<span className="text-emerald-400">X</span>
                </h1>
                {/* Vertical Divider */}
                <span className="w-px h-6 bg-zinc-600" />
                {/* Admin Panel label */}
                <span className="text-sm sm:text-base font-medium text-zinc-400 tracking-wide">
                  Admin Panel
                </span>
                {/* Live badge */}
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  LIVE
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Kitchen dispatch, real-time rider sync &amp; stock control
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab("orders")}
              className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                activeTab === "orders" 
                  ? "bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20" 
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Live Orders</span>
              {activeOrdersCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  activeTab === "orders" ? "bg-zinc-950 text-emerald-400" : "bg-emerald-500/20 text-emerald-400"
                }`}>
                  {activeOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("menu")}
              className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                activeTab === "menu" 
                  ? "bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20" 
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Stock & Menu</span>
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                activeTab === "analytics" 
                  ? "bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20" 
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Financials</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        
        {/* KPI Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-3xl p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span>Active Dispatch</span>
              <Package className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">
              {activeOrdersCount}
            </div>
            <p className="text-[11px] text-zinc-500">
              {completedOrders.length} completed today
            </p>
          </div>

          <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-3xl p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span>Food Gross (Menu Price)</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
              ₹{totalGrossFoodRevenue.toFixed(2)}
            </div>
            <p className="text-[11px] text-emerald-600 font-medium">
              100% direct to kitchen
            </p>
          </div>

          <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-3xl p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span>Courier Payouts</span>
              <Bike className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">
              ₹{totalCourierPayouts.toFixed(2)}
            </div>
            <p className="text-[11px] text-zinc-500">
              Distance-based compensation
            </p>
          </div>

          <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-3xl p-5 space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span>Customer Commission Saved</span>
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
              ₹{totalCustomerSavings.toFixed(2)}
            </div>
            <p className="text-[11px] text-amber-500/80 font-medium">
              ₹0 Platform markups delivered
            </p>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: LIVE ORDERS KANBAN                                 */}
        {/* ======================================================== */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            
            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-zinc-500" />
                <select
                  value={selectedRestaurantFilter}
                  onChange={(e) => setSelectedRestaurantFilter(e.target.value)}
                  className="bg-zinc-800 text-zinc-200 text-xs font-bold rounded-xl px-3 py-2 border border-zinc-700 focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">All Kitchens ({restaurants.length})</option>
                  {restaurants.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search order ID or restaurant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-800 text-zinc-200 text-xs rounded-xl pl-9 pr-4 py-2 border border-zinc-700 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Kanban Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
              
              {/* Column 1: Incoming Orders (PLACED) */}
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-4 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="font-extrabold text-xs text-zinc-200 uppercase tracking-wider">
                      Incoming Orders
                    </span>
                  </div>
                  <span className="bg-amber-400/20 text-amber-300 text-xs font-mono font-bold px-2 py-0.5 rounded-full">
                    {incomingOrders.length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[220px]">
                  {incomingOrders.length === 0 ? (
                    <div className="text-center py-10 text-zinc-600 text-xs">
                      No new orders waiting
                    </div>
                  ) : (
                    incomingOrders.map(order => (
                      <OrderAdminCard
                        key={order.id}
                        order={order}
                        onAdvance={() => onUpdateOrderStatus(order.id, "PREPARING")}
                        advanceLabel="Accept & Cook 🍳"
                        advanceColor="bg-amber-500 hover:bg-amber-400 text-zinc-950"
                        onReject={() => onUpdateOrderStatus(order.id, "CANCELLED")}
                        onViewTracking={onNavigateToTracking}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Column 2: Kitchen Preparing */}
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-4 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                    <span className="font-extrabold text-xs text-zinc-200 uppercase tracking-wider">
                      Cooking in Kitchen
                    </span>
                  </div>
                  <span className="bg-blue-400/20 text-blue-300 text-xs font-mono font-bold px-2 py-0.5 rounded-full">
                    {preparingOrders.length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[220px]">
                  {preparingOrders.length === 0 ? (
                    <div className="text-center py-10 text-zinc-600 text-xs">
                      Kitchen is ready for orders
                    </div>
                  ) : (
                    preparingOrders.map(order => (
                      <OrderAdminCard
                        key={order.id}
                        order={order}
                        onAdvance={() => onUpdateOrderStatus(order.id, "READY_FOR_PICKUP")}
                        advanceLabel="Mark Prepared 📦"
                        advanceColor="bg-blue-500 hover:bg-blue-400 text-white"
                        onViewTracking={onNavigateToTracking}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Column 3: Ready for Courier Dispatch */}
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-4 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                    <span className="font-extrabold text-xs text-zinc-200 uppercase tracking-wider">
                      Ready / Assign Rider
                    </span>
                  </div>
                  <span className="bg-purple-400/20 text-purple-300 text-xs font-mono font-bold px-2 py-0.5 rounded-full">
                    {readyOrders.length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[220px]">
                  {readyOrders.length === 0 ? (
                    <div className="text-center py-10 text-zinc-600 text-xs">
                      No ready orders
                    </div>
                  ) : (
                    readyOrders.map(order => (
                      <OrderAdminCard
                        key={order.id}
                        order={order}
                        onAdvance={() => onUpdateOrderStatus(order.id, "OUT_FOR_DELIVERY")}
                        advanceLabel="Dispatch Courier 🛵"
                        advanceColor="bg-purple-500 hover:bg-purple-400 text-white"
                        onViewTracking={onNavigateToTracking}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Column 4: Out for Delivery */}
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-4 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-extrabold text-xs text-zinc-200 uppercase tracking-wider">
                      On the Way
                    </span>
                  </div>
                  <span className="bg-emerald-400/20 text-emerald-300 text-xs font-mono font-bold px-2 py-0.5 rounded-full">
                    {outForDeliveryOrders.length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[220px]">
                  {outForDeliveryOrders.length === 0 ? (
                    <div className="text-center py-10 text-zinc-600 text-xs">
                      No orders currently in transit
                    </div>
                  ) : (
                    outForDeliveryOrders.map(order => (
                      <OrderAdminCard
                        key={order.id}
                        order={order}
                        onAdvance={() => onUpdateOrderStatus(order.id, "DELIVERED")}
                        advanceLabel="Confirm Delivered ✅"
                        advanceColor="bg-emerald-500 hover:bg-emerald-400 text-zinc-950"
                        onViewTracking={onNavigateToTracking}
                      />
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Completed Orders Summary */}
            {completedOrders.length > 0 && (
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-zinc-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Completed Deliveries Today ({completedOrders.length})</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {completedOrders.map(order => (
                    <div key={order.id} className="bg-zinc-900 border border-zinc-800/80 p-3.5 rounded-2xl flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{order.id}</span>
                          <span className="text-zinc-400 font-normal">• {order.restaurantName}</span>
                        </div>
                        <div className="text-zinc-500 text-[11px] mt-0.5">
                          {order.items.length} items • Final: ₹{order.billing.grandTotal.toFixed(2)}
                        </div>
                      </div>
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-lg text-[10px] font-bold">
                        Delivered
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: MENU & INVENTORY STOCK CONTROL                     */}
        {/* ======================================================== */}
        {activeTab === "menu" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-zinc-500" />
                <select
                  value={selectedRestaurantFilter}
                  onChange={(e) => setSelectedRestaurantFilter(e.target.value)}
                  className="bg-zinc-800 text-zinc-200 text-xs font-bold rounded-xl px-3 py-2 border border-zinc-700 focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">All Restaurants ({restaurants.length})</option>
                  {restaurants.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div className="text-xs text-zinc-400">
                Toggling availability updates customer menus instantly in real time.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems
                .filter(item => selectedRestaurantFilter === "all" || item.restaurantId === selectedRestaurantFilter)
                .map(item => {
                  const rest = restaurants.find(r => r.id === item.restaurantId);
                  return (
                    <div 
                      key={item.id} 
                      className={`bg-zinc-900 border rounded-2xl p-4 flex gap-3 transition-all ${
                        item.isAvailable ? "border-zinc-800" : "border-red-900/40 opacity-70 bg-zinc-900/50"
                      }`}
                    >
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-20 h-20 rounded-xl object-cover shrink-0 border border-zinc-800"
                      />
                      <div className="flex flex-col justify-between flex-1 min-w-0">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="font-extrabold text-xs text-white truncate">{item.title}</h4>
                            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.isVeg ? "bg-emerald-400" : "bg-red-500"}`} />
                          </div>
                          <p className="text-[11px] text-zinc-400 truncate mt-0.5">{rest?.name}</p>
                          <p className="text-xs font-bold text-emerald-400 font-mono mt-1">₹{item.price.toFixed(2)}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 mt-2">
                          <span className={`text-[10px] font-bold ${item.isAvailable ? "text-emerald-400" : "text-red-400"}`}>
                            {item.isAvailable ? "In Stock" : "Sold Out"}
                          </span>
                          <button
                            onClick={() => onToggleItemStock(item.id, !item.isAvailable)}
                            className={`cursor-pointer px-3 py-1 rounded-lg text-[10px] font-black transition-all ${
                              item.isAvailable 
                                ? "bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30" 
                                : "bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
                            }`}
                          >
                            {item.isAvailable ? "Mark Sold Out" : "Mark In Stock"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: FINANCIALS & TRANSPARENT LEDGER                   */}
        {/* ======================================================== */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-black text-base text-white">
                  Zero-Markup Financial Audit Ledger
                </h3>
              </div>
              <p className="text-xs text-zinc-400">
                RestoX passes 100% of the food menu price to the restaurant and 100% of the courier delivery fee to the rider. There are zero hidden aggregator platform fees.
              </p>

              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-500 text-[11px] uppercase tracking-wider">
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Restaurant</th>
                      <th className="pb-3">Food Subtotal</th>
                      <th className="pb-3">CGST (2.5%)</th>
                      <th className="pb-3">SGST (2.5%)</th>
                      <th className="pb-3">Platform Fee</th>
                      <th className="pb-3">Courier Fee</th>
                      <th className="pb-3">Total Paid</th>
                      <th className="pb-3 text-right">Customer Saved</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {orders.map(o => (
                      <tr key={o.id} className="text-zinc-300">
                        <td className="py-3 font-mono font-bold text-white">{o.id}</td>
                        <td className="py-3">{o.restaurantName}</td>
                        <td className="py-3 font-mono text-zinc-200">₹{o.billing.subtotal.toFixed(2)}</td>
                        <td className="py-3 font-mono text-zinc-400">₹{o.billing.cgst.toFixed(2)}</td>
                        <td className="py-3 font-mono text-zinc-400">₹{o.billing.sgst.toFixed(2)}</td>
                        <td className="py-3 font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">₹0.00</td>
                        <td className="py-3 font-mono text-blue-400">₹{o.billing.deliveryFee.toFixed(2)}</td>
                        <td className="py-3 font-mono font-black text-white">₹{o.billing.grandTotal.toFixed(2)}</td>
                        <td className="py-3 font-mono text-amber-400 font-bold text-right">
                          +₹{(o.billing.traditionalComparison?.savings || 55).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

interface OrderAdminCardProps {
  order: Order;
  onAdvance: () => void;
  advanceLabel: string;
  advanceColor: string;
  onReject?: () => void;
  onViewTracking?: (orderId: string) => void;
}

// Sub-component for individual Kanban card
const OrderAdminCard: React.FC<OrderAdminCardProps> = ({
  order,
  onAdvance,
  advanceLabel,
  advanceColor,
  onReject,
  onViewTracking
}) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-3 hover:border-zinc-700 transition-all shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="font-mono font-black text-xs text-white block">{order.id}</span>
          <span className="text-[11px] text-zinc-400">{order.restaurantName}</span>
        </div>
        <span className="font-mono font-bold text-emerald-400 text-xs">
          ₹{order.billing.grandTotal.toFixed(2)}
        </span>
      </div>

      {/* Items List */}
      <div className="bg-zinc-950 p-2.5 rounded-xl space-y-1 text-[11px] text-zinc-300 border border-zinc-800/60">
        {order.items.map((cartItem, idx) => (
          <div key={idx} className="flex justify-between">
            <span className="truncate max-w-[140px]">{cartItem.quantity}x {cartItem.item.title}</span>
            <span className="font-mono text-zinc-400">₹{(cartItem.item.price * cartItem.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Customer Location & Distance */}
      <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 truncate">
        <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
        <span className="truncate">{order.address.label} • {order.address.text}</span>
      </div>

      {/* Action Controls */}
      <div className="space-y-1.5 pt-1">
        <button
          onClick={onAdvance}
          className={`cursor-pointer w-full py-2.5 px-3 rounded-xl font-black text-xs transition-all active:scale-98 flex items-center justify-center gap-1.5 shadow-md ${advanceColor}`}
        >
          <span>{advanceLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-2">
          {onViewTracking && (
            <button
              onClick={() => onViewTracking(order.id)}
              className="cursor-pointer flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-bold py-1.5 rounded-lg text-center flex items-center justify-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Track View</span>
            </button>
          )}

          {onReject && (
            <button
              onClick={onReject}
              className="cursor-pointer bg-red-950/40 hover:bg-red-900/60 text-red-400 text-[10px] font-bold py-1.5 px-2.5 rounded-lg"
            >
              Reject
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
