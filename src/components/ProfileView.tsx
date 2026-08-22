import React, { useState } from "react";
import { 
  User, 
  MapPin, 
  Clock, 
  Heart, 
  CreditCard, 
  Bell, 
  HelpCircle, 
  Info, 
  LogOut, 
  ShieldCheck, 
  Edit3, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Check,
  Smartphone,
  Star,
  UtensilsCrossed
} from "lucide-react";
import { UserProfile, Address, Order, Restaurant, FoodItem, AppView } from "../types";

interface ProfileViewProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onLogout: () => void;
  addresses: Address[];
  onOpenAddAddress: () => void;
  onDeleteAddress: (id: string) => void;
  onSetDefaultAddress: (id: string) => void;
  favorites: string[];
  restaurants: Restaurant[];
  menuItems: FoodItem[];
  onOpenRestaurant: (r: Restaurant) => void;
  onNavigate: (view: AppView) => void;
}

export default function ProfileView({
  user,
  onUpdateUser,
  onLogout,
  addresses,
  onOpenAddAddress,
  onDeleteAddress,
  onSetDefaultAddress,
  favorites,
  restaurants,
  menuItems,
  onOpenRestaurant,
  onNavigate
}: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState<"account" | "addresses" | "favorites" | "payments" | "about">("account");
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);
  const [emailInput, setEmailInput] = useState(user.email);
  const [phoneInput, setPhoneInput] = useState(user.phone);

  const favoriteRestaurants = restaurants.filter(r => favorites.includes(r.id));
  const favoriteDishes = menuItems.filter(i => favorites.includes(i.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name: nameInput,
      email: emailInput,
      phone: phoneInput
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24">
      
      {/* 1. USER PROFILE HEADER CARD */}
      <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-3xl object-cover border-2 border-emerald-500 shadow-md"
          />
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white font-sans">
                {user.name}
              </h1>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/40">
                Verified
              </span>
            </div>
            <p className="text-xs text-zinc-300">{user.email}</p>
            <p className="text-xs text-zinc-400 font-mono">{user.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (user.isLoggedIn) {
                setIsEditing(!isEditing);
                setActiveTab("account");
              }
            }}
            className="cursor-pointer bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-white/10 flex items-center gap-1.5 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={onLogout}
            className="cursor-pointer bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* 2. TAB NAVIGATION BAR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-zinc-200/80">
        {[
          { id: "account", label: "My Account", icon: User },
          { id: "addresses", label: `Addresses (${addresses.length})`, icon: MapPin },
          { id: "favorites", label: `Favorites (${favorites.length})`, icon: Heart },
          { id: "payments", label: "Payments", icon: CreditCard },
          { id: "about", label: "About FairByte", icon: ShieldCheck }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`cursor-pointer px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? "bg-zinc-950 text-white shadow-xs"
                  : "bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200/80"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. TAB CONTENT PANELS */}
      
      {/* TAB: MY ACCOUNT */}
      {activeTab === "account" && (
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 className="font-black text-base text-zinc-950 font-sans">
              Personal Information
            </h3>
            <span className="text-xs text-zinc-400 font-medium">Customer Account</span>
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Full Name</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Email Address</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Mobile Phone</label>
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="cursor-pointer bg-emerald-600 text-zinc-950 font-black px-5 py-2 rounded-xl text-xs shadow-xs"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="cursor-pointer bg-zinc-100 text-zinc-700 font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 space-y-1">
                <span className="text-zinc-400 font-bold">Name</span>
                <p className="font-extrabold text-zinc-900 text-sm">{user.name}</p>
              </div>
              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 space-y-1">
                <span className="text-zinc-400 font-bold">Email</span>
                <p className="font-extrabold text-zinc-900 text-sm">{user.email}</p>
              </div>
              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 space-y-1">
                <span className="text-zinc-400 font-bold">Mobile Phone</span>
                <p className="font-mono font-extrabold text-zinc-900 text-sm">{user.phone}</p>
              </div>
              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 space-y-1">
                <span className="text-zinc-400 font-bold">Location Jurisdiction</span>
                <p className="font-extrabold text-zinc-900 text-sm">Bengaluru, Karnataka</p>
              </div>
            </div>
          )}

          {/* Quick Hub Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-zinc-100">
            <button
              onClick={() => onNavigate("orders")}
              className="cursor-pointer p-4 bg-zinc-50 hover:bg-emerald-50 rounded-2xl border border-zinc-200/80 text-left transition-colors flex items-center justify-between"
            >
              <div>
                <Clock className="w-5 h-5 text-emerald-600 mb-1" />
                <span className="font-extrabold text-xs text-zinc-900 block">My Orders</span>
                <span className="text-[10px] text-zinc-500">Live & past receipts</span>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-400" />
            </button>

            <button
              onClick={() => onNavigate("help")}
              className="cursor-pointer p-4 bg-zinc-50 hover:bg-emerald-50 rounded-2xl border border-zinc-200/80 text-left transition-colors flex items-center justify-between"
            >
              <div>
                <HelpCircle className="w-5 h-5 text-emerald-600 mb-1" />
                <span className="font-extrabold text-xs text-zinc-900 block">Help & Support</span>
                <span className="text-[10px] text-zinc-500">FAQs & live chat</span>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-400" />
            </button>

            <button
              onClick={() => onNavigate("offers")}
              className="cursor-pointer p-4 bg-zinc-50 hover:bg-emerald-50 rounded-2xl border border-zinc-200/80 text-left transition-colors flex items-center justify-between"
            >
              <div>
                <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1" />
                <span className="font-extrabold text-xs text-zinc-900 block">Active Offers</span>
                <span className="text-[10px] text-zinc-500">Promo codes & deals</span>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-400" />
            </button>
          </div>
        </div>
      )}

      {/* TAB: ADDRESSES */}
      {activeTab === "addresses" && (
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div>
              <h3 className="font-black text-base text-zinc-950 font-sans">
                Saved Delivery Addresses
              </h3>
              <p className="text-xs text-zinc-500">Bengaluru locales for quick checkout</p>
            </div>
            <button
              onClick={onOpenAddAddress}
              className="cursor-pointer bg-emerald-600 text-zinc-950 text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add New</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200/80 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-zinc-950 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      {addr.label}
                    </span>
                    {addr.isDefault && (
                      <span className="bg-emerald-100 text-emerald-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed pt-1">{addr.text}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-200/60 text-xs">
                  {!addr.isDefault ? (
                    <button
                      onClick={() => onSetDefaultAddress(addr.id)}
                      className="cursor-pointer text-emerald-700 hover:underline font-bold text-[11px]"
                    >
                      Set as Default
                    </button>
                  ) : (
                    <span className="text-[11px] text-zinc-400 font-medium">Default location</span>
                  )}

                  {addresses.length > 1 && (
                    <button
                      onClick={() => onDeleteAddress(addr.id)}
                      className="cursor-pointer text-red-600 hover:text-red-700 p-1 rounded-lg"
                      title="Delete address"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: FAVORITES */}
      {activeTab === "favorites" && (
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-zinc-100 pb-3">
            <h3 className="font-black text-base text-zinc-950 font-sans">
              Your Favorite Restaurants & Dishes
            </h3>
            <p className="text-xs text-zinc-500">Quickly reorder your curated choices</p>
          </div>

          {favorites.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Heart className="w-12 h-12 text-zinc-300 mx-auto" />
              <h4 className="font-extrabold text-sm text-zinc-800">No favorites saved yet</h4>
              <p className="text-xs text-zinc-500">
                Click the heart icon on any restaurant or dish to save it here.
              </p>
              <button
                onClick={() => onNavigate("home")}
                className="cursor-pointer text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 mt-2"
              >
                Browse Restaurants
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {favoriteRestaurants.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Favorite Kitchens ({favoriteRestaurants.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {favoriteRestaurants.map(r => (
                      <div
                        key={r.id}
                        onClick={() => onOpenRestaurant(r)}
                        className="cursor-pointer bg-zinc-50 hover:bg-emerald-50/50 p-3.5 rounded-2xl border border-zinc-200 flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img src={r.image} alt={r.name} className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                            <p className="font-extrabold text-xs text-zinc-900">{r.name}</p>
                            <p className="text-[11px] text-zinc-500">{r.cuisine.slice(0, 2).join(", ")}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-zinc-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {favoriteDishes.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Favorite Dishes ({favoriteDishes.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {favoriteDishes.map(i => (
                      <div
                        key={i.id}
                        className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <img src={i.image} alt={i.title} className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                            <p className="font-extrabold text-xs text-zinc-900">{i.title}</p>
                            <p className="text-[11px] font-mono text-zinc-600 font-bold">₹{i.price}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            const rest = restaurants.find(r => r.id === i.restaurantId);
                            if (rest) onOpenRestaurant(rest);
                          }}
                          className="cursor-pointer text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
                        >
                          View Menu
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB: PAYMENTS */}
      {activeTab === "payments" && (
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-zinc-100 pb-3">
            <h3 className="font-black text-base text-zinc-950 font-sans">
              Payment Methods & Preferences
            </h3>
            <p className="text-xs text-zinc-500">Saved payment handles for transparent checkout</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 flex items-center gap-3">
              <Smartphone className="w-6 h-6 text-emerald-600" />
              <div>
                <p className="font-extrabold text-zinc-900">Google Pay (UPI)</p>
                <p className="text-zinc-500 font-mono">poojabhusani@okhdfcbank</p>
              </div>
            </div>

            <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-emerald-600" />
              <div>
                <p className="font-extrabold text-zinc-900">HDFC Millennia Credit Card</p>
                <p className="text-zinc-500 font-mono">•••• •••• •••• 8821</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: ABOUT FAIRBYTE */}
      {activeTab === "about" && (
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl">
              F
            </div>
            <div>
              <h3 className="font-black text-lg text-zinc-950 font-sans">About FairByte</h3>
              <p className="text-xs text-emerald-700 font-bold">"Your food. The restaurant's price. Fair delivery."</p>
            </div>
          </div>

          <div className="space-y-4 text-xs text-zinc-600 leading-relaxed">
            <p>
              FairByte is built on the simple belief that ordering food should be honest and transparent. Traditional food aggregators inflate menu items by up to 30% and add unexpected platform and service fees right before checkout.
            </p>
            <p>
              With FairByte:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 font-medium text-zinc-800">
              <li><strong>Direct Menu Prices:</strong> You pay what the restaurant charges in their dine-in menu.</li>
              <li><strong>Transparent Courier Fee:</strong> Distance-based fair courier compensation with zero artificial markups.</li>
              <li><strong>Zero Platform Fees:</strong> No surprise fees or arbitrary checkout penalties in this demo.</li>
            </ul>
          </div>
        </div>
      )}

    </div>
  );
}
