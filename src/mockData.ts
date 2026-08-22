import { 
  Restaurant, 
  FoodItem, 
  Address, 
  DeliveryPartner, 
  TraditionalComparison, 
  BillingBreakdown,
  Coupon,
  Order,
  UserProfile,
  AppNotification,
  FAQItem,
  SupportChatMessage
} from "./types";

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: "rest-spice-route",
    name: "Spice Route",
    tagline: "Authentic North Indian & Charcoal Tandoor Specialties",
    cuisine: ["North Indian", "Mughlai", "Tandoor", "Curries"],
    rating: 4.8,
    reviewCount: 1420,
    deliveryTimeMin: 30,
    deliveryFee: 48,
    priceRange: "₹₹",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=800",
    bannerImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200",
    address: "12th Main, Indiranagar, Bengaluru",
    categories: ["Recommended", "Starters", "Main Course", "Biryani", "Breads", "Desserts", "Beverages"],
    featured: true,
    isPureVeg: false
  },
  {
    id: "rest-dosa-district",
    name: "Dosa District",
    tagline: "Crispy Golden Dosas, Filter Coffee & South Indian Classics",
    cuisine: ["South Indian", "Dosas", "Breakfast", "Filter Coffee"],
    rating: 4.7,
    reviewCount: 2310,
    deliveryTimeMin: 25,
    deliveryFee: 35,
    priceRange: "₹",
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&q=80&w=800",
    bannerImage: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&q=80&w=1200",
    address: "5th Block, Koramangala, Bengaluru",
    categories: ["Recommended", "Dosas & Uttapams", "Idli & Vada", "Meals", "Beverages"],
    featured: true,
    isPureVeg: true
  },
  {
    id: "rest-biryani-junction",
    name: "Biryani Junction",
    tagline: "Slow-Cooked Dum Biryanis with Royal Aroma & Spices",
    cuisine: ["Biryani", "Hyderabadi", "Mughlai", "Kebabs"],
    rating: 4.9,
    reviewCount: 3840,
    deliveryTimeMin: 35,
    deliveryFee: 45,
    priceRange: "₹₹",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=800",
    bannerImage: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=1200",
    address: "Church Street, MG Road, Bengaluru",
    categories: ["Recommended", "Dum Biryanis", "Starters & Kebabs", "Accompaniments", "Desserts"],
    featured: true,
    isPureVeg: false
  },
  {
    id: "rest-burger-lab",
    name: "Burger Lab",
    tagline: "Handcrafted Gourmet Smashed Burgers & Thick Shakes",
    cuisine: ["Burgers", "American", "Fast Food", "Shakes"],
    rating: 4.7,
    reviewCount: 980,
    deliveryTimeMin: 20,
    deliveryFee: 40,
    priceRange: "₹₹",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800",
    bannerImage: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=1200",
    address: "100 Feet Road, Indiranagar, Bengaluru",
    categories: ["Recommended", "Burgers", "Fries & Sides", "Beverages & Shakes", "Desserts"],
    featured: false,
    isPureVeg: false
  },
  {
    id: "rest-green-bowl",
    name: "Green Bowl",
    tagline: "Farm-Fresh Salad Bowls, Protein Plates & Cold-Pressed Juices",
    cuisine: ["Healthy", "Salads", "Grain Bowls", "Smoothies"],
    rating: 4.8,
    reviewCount: 760,
    deliveryTimeMin: 25,
    deliveryFee: 42,
    priceRange: "₹₹₹",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800",
    bannerImage: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=1200",
    address: "Lavelle Road, Shanthala Nagar, Bengaluru",
    categories: ["Recommended", "Grain Bowls", "Salads", "Wraps", "Cold Pressed Juices"],
    featured: false,
    isPureVeg: true
  },
  {
    id: "rest-curry-house",
    name: "Curry House",
    tagline: "Homestyle Rich Indian Curries, Dal Tadka & Fresh Tawa Roti",
    cuisine: ["North Indian", "Homestyle", "Thalis", "Curries"],
    rating: 4.6,
    reviewCount: 1650,
    deliveryTimeMin: 30,
    deliveryFee: 38,
    priceRange: "₹",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800",
    bannerImage: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=1200",
    address: "HSR Layout Sector 2, Bengaluru",
    categories: ["Recommended", "Starters", "Main Course", "Thalis", "Breads", "Beverages"],
    featured: false,
    isPureVeg: false
  }
];

export const MOCK_MENU_ITEMS: FoodItem[] = [
  // 1. Spice Route
  {
    id: "sr-1",
    restaurantId: "rest-spice-route",
    title: "Signature Butter Chicken Bowl",
    description: "Tender tandoori chicken cooked in rich silky tomato butter makhani gravy. Served with basmati jeera rice.",
    price: 320,
    rating: 4.9,
    category: "Recommended",
    isVeg: false,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=800",
    isPopular: true,
    prepTime: "20 min"
  },
  {
    id: "sr-2",
    restaurantId: "rest-spice-route",
    title: "Paneer Lababdar Bowl",
    description: "Fresh malai paneer cubes simmered in creamy onion-tomato cashew gravy with aromatic kasuri methi.",
    price: 290,
    rating: 4.8,
    category: "Recommended",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1658145781116-24ba0cc3fa91?auto=format&fit=crop&q=80&w=800",
    isPopular: true,
    prepTime: "15 min"
  },
  {
    id: "sr-3",
    restaurantId: "rest-spice-route",
    title: "Old Delhi Tandoori Wings (8pcs)",
    description: "Overnight spiced chicken wings charred to perfection in clay oven with mint coriander chutney.",
    price: 260,
    rating: 4.7,
    category: "Starters",
    isVeg: false,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&q=80&w=800",
    prepTime: "20 min"
  },
  {
    id: "sr-4",
    restaurantId: "rest-spice-route",
    title: "Crispy Samosa Chaat Duo",
    description: "Crushed golden potato samosas topped with sweetened churned curd, mint chutney, and tamarind glaze.",
    price: 120,
    rating: 4.6,
    category: "Starters",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=800",
    prepTime: "10 min"
  },
  {
    id: "sr-5",
    restaurantId: "rest-spice-route",
    title: "Dal Makhani Feast Bowl",
    description: "Slow 24-hr simmered urad lentils finished with pure butter and cream. Paired with crispy garlic naan.",
    price: 270,
    rating: 4.9,
    category: "Main Course",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800",
    isPopular: true,
    prepTime: "15 min"
  },
  {
    id: "sr-6",
    restaurantId: "rest-spice-route",
    title: "Chicken Tikka Masala",
    description: "Smoky boneless chicken chunks cooked in a spicy, fiery onion-tomato gravy with bell peppers.",
    price: 330,
    rating: 4.8,
    category: "Main Course",
    isVeg: false,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800",
    prepTime: "20 min"
  },
  {
    id: "sr-7",
    restaurantId: "rest-spice-route",
    title: "Murgh Dum Biryani Single",
    description: "Fragrant long-grain basmati rice layered with juicy chicken drumstick and saffron milk. Served with raita.",
    price: 340,
    rating: 4.8,
    category: "Biryani",
    isVeg: false,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=800",
    prepTime: "25 min"
  },
  {
    id: "sr-8",
    restaurantId: "rest-spice-route",
    title: "Garlic Butter Naan (2 pcs)",
    description: "Clay oven baked leavened flatbread brushed with crushed garlic and melted butter.",
    price: 95,
    rating: 4.7,
    category: "Breads",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=800",
    prepTime: "10 min"
  },
  {
    id: "sr-9",
    restaurantId: "rest-spice-route",
    title: "Classic Alphonso Mango Lassi",
    description: "Rich chilled yogurt shake blended with authentic Ratnagiri mango pulp and crushed pistachios.",
    price: 90,
    rating: 4.8,
    category: "Beverages",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&q=80&w=800",
    prepTime: "5 min"
  },
  {
    id: "sr-10",
    restaurantId: "rest-spice-route",
    title: "Gulab Jamun (2 pcs)",
    description: "Soft golden khoya dumplings soaked in warm rose water and cardamom sugar syrup.",
    price: 85,
    rating: 4.8,
    category: "Desserts",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=800",
    prepTime: "5 min"
  },

  // 2. Dosa District
  {
    id: "dd-1",
    restaurantId: "rest-dosa-district",
    title: "Mysore Masala Dosa",
    description: "Crispy fermented crepe smeared with spicy red chutney and stuffed with seasoned spiced potato mash.",
    price: 150,
    rating: 4.9,
    category: "Recommended",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&q=80&w=800",
    isPopular: true,
    prepTime: "15 min"
  },
  {
    id: "dd-2",
    restaurantId: "rest-dosa-district",
    title: "Ghee Roast Podi Dosa",
    description: "Paper thin golden dosa crisped in pure desi ghee and sprinkled liberally with spicy gunpowder podi.",
    price: 160,
    rating: 4.8,
    category: "Dosas & Uttapams",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=800",
    isPopular: true,
    prepTime: "15 min"
  },
  {
    id: "dd-3",
    restaurantId: "rest-dosa-district",
    title: "Steamed Button Idlis & Medu Vada Duo",
    description: "4 miniature fluffy rice cakes paired with 1 crispy lentil fritter, piping hot sambar and fresh coconut dip.",
    price: 110,
    rating: 4.7,
    category: "Idli & Vada",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=800",
    prepTime: "10 min"
  },
  {
    id: "dd-4",
    restaurantId: "rest-dosa-district",
    title: "South Indian Executive Thali",
    description: "Steamed Sona Masoori rice, sambar, rasam, kootu, curd, appalam, pickle and payasam dessert.",
    price: 210,
    rating: 4.8,
    category: "Meals",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&q=80&w=800",
    prepTime: "15 min"
  },
  {
    id: "dd-5",
    restaurantId: "rest-dosa-district",
    title: "Authentic Degree Filter Coffee",
    description: "Freshly brewed chicory coffee decoction frothed with boiled whole buffalo milk in traditional brass dabarah.",
    price: 60,
    rating: 4.9,
    category: "Beverages",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800",
    prepTime: "5 min"
  },

  // 3. Biryani Junction
  {
    id: "bj-1",
    restaurantId: "rest-biryani-junction",
    title: "Hyderabadi Chicken Dum Biryani",
    description: "Kachi yakhni style long grain basmati rice, marinated tender chicken, saffron, fried onions, and mirchi ka salan.",
    price: 320,
    rating: 4.9,
    category: "Recommended",
    isVeg: false,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=800",
    isPopular: true,
    prepTime: "25 min"
  },
  {
    id: "bj-2",
    restaurantId: "rest-biryani-junction",
    title: "Paneer Tikka Dum Biryani",
    description: "Charcoal grilled spiced cottage cheese layered with fragrant saffron rice, mint, and toasted cashews.",
    price: 280,
    rating: 4.7,
    category: "Dum Biryanis",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&q=80&w=800",
    prepTime: "20 min"
  },
  {
    id: "bj-3",
    restaurantId: "rest-biryani-junction",
    title: "Chicken 65 Spicy Bites",
    description: "Crispy fried curry-leaf infused spicy boneless chicken cubes with green chili slices and lemon wedges.",
    price: 240,
    rating: 4.8,
    category: "Starters & Kebabs",
    isVeg: false,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&q=80&w=800",
    prepTime: "15 min"
  },
  {
    id: "bj-4",
    restaurantId: "rest-biryani-junction",
    title: "Shahi Tukda Royal Delight",
    description: "Crispy ghee-fried bread slices steeped in thickened rabri, garnished with silver vark and almonds.",
    price: 130,
    rating: 4.8,
    category: "Desserts",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=800",
    prepTime: "5 min"
  },

  // 4. Burger Lab
  {
    id: "bl-1",
    restaurantId: "rest-burger-lab",
    title: "The Ultimate Smash Cheeseburger",
    description: "Double smashed tender patties, aged cheddar melt, caramelized onions, house truffle mayo in brioche bun.",
    price: 290,
    rating: 4.8,
    category: "Recommended",
    isVeg: false,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800",
    isPopular: true,
    prepTime: "15 min"
  },
  {
    id: "bl-2",
    restaurantId: "rest-burger-lab",
    title: "Crispy Truffle Veg Burger",
    description: "Crunchy crumb-fried herbed vegetable & cheese patty, iceberg lettuce, pickled jalapeños and spicy secret sauce.",
    price: 220,
    rating: 4.6,
    category: "Burgers",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800",
    prepTime: "15 min"
  },
  {
    id: "bl-3",
    restaurantId: "rest-burger-lab",
    title: "Peri-Peri Seasoned Crinkle Fries",
    description: "Thick cut crinkle potato fries tossed generously in African bird's eye chili seasoning with garlic dip.",
    price: 130,
    rating: 4.7,
    category: "Fries & Sides",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&q=80&w=800",
    prepTime: "10 min"
  },
  {
    id: "bl-4",
    restaurantId: "rest-burger-lab",
    title: "Nutella Belgian Chocolate Thickshake",
    description: "Rich dark chocolate ice cream whipped with pure roasted hazelnut Nutella and crushed wafer crunch.",
    price: 180,
    rating: 4.9,
    category: "Beverages & Shakes",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=800",
    prepTime: "5 min"
  },

  // 5. Green Bowl
  {
    id: "gb-1",
    restaurantId: "rest-green-bowl",
    title: "Mediterranean Falafel Protein Bowl",
    description: "Herbed baked falafels, roasted bell pepper quinoa, pickled cucumber ribbons, kalamata olives & creamy garlic tahini.",
    price: 310,
    rating: 4.8,
    category: "Recommended",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800",
    isPopular: true,
    prepTime: "15 min"
  },
  {
    id: "gb-2",
    restaurantId: "rest-green-bowl",
    title: "Avocado Superfood Caesar Salad",
    description: "Crisp romaine, Hass avocado slices, parmesan shavings, herb sourdough croutons, light Greek yogurt dressing.",
    price: 290,
    rating: 4.7,
    category: "Salads",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800",
    prepTime: "12 min"
  },
  {
    id: "gb-3",
    restaurantId: "rest-green-bowl",
    title: "Cold Pressed Detox Green Juice (300ml)",
    description: "Pure extracted celery, English cucumber, green apple, fresh mint and key lime. Zero added sugar.",
    price: 150,
    rating: 4.8,
    category: "Cold Pressed Juices",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=800",
    prepTime: "5 min"
  },

  // 6. Curry House
  {
    id: "ch-1",
    restaurantId: "rest-curry-house",
    title: "Homestyle Dal Tadka Bowl",
    description: "Yellow arhar lentils tempered with cumin, crushed garlic, whole red chilies, fresh coriander and jeera rice.",
    price: 210,
    rating: 4.7,
    category: "Recommended",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800",
    prepTime: "15 min"
  },
  {
    id: "ch-2",
    restaurantId: "rest-curry-house",
    title: "Royal Executive Veg Thali",
    description: "Paneer butter masala, dal tadka, mix veg, 3 butter rotis, jeera rice, salad, pickle, and gulab jamun.",
    price: 310,
    rating: 4.9,
    category: "Thalis",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&q=80&w=800",
    isPopular: true,
    prepTime: "20 min"
  }
];

export const MOCK_ADDRESSES: Address[] = [
  {
    id: "addr-1",
    label: "Home",
    text: "Flat 402, Royal Palms, Lavelle Road, Bengaluru - 560001",
    flatBuilding: "Flat 402, Tower B",
    landmark: "Near UB City",
    lat: 12.9698,
    lng: 77.5972,
    isDefault: true
  },
  {
    id: "addr-2",
    label: "Work / Office",
    text: "Level 11, WeWork Galaxy, Residency Rd, Bengaluru - 560025",
    flatBuilding: "Level 11, Desk 42",
    landmark: "Opposite Ritz Carlton",
    lat: 12.9708,
    lng: 77.6015
  },
  {
    id: "addr-3",
    label: "Koramangala Studio",
    text: "Building 12, 80 Feet Rd, Koramangala 4th Block, Bengaluru - 560034",
    flatBuilding: "2nd Floor",
    landmark: "Above Blue Tokai",
    lat: 12.9343,
    lng: 77.6253
  },
  {
    id: "addr-4",
    label: "Indiranagar Flat",
    text: "Flat B, Metro Heights, 100 Feet Rd, Indiranagar, Bengaluru - 560038",
    flatBuilding: "Block A",
    landmark: "Next to 12th Main Signal",
    lat: 12.9784,
    lng: 77.6408
  }
];

export const MOCK_USER: UserProfile = {
  id: "usr-fairbyte-1",
  name: "Pooja Bhusani",
  email: "poojabhusani20@gmail.com",
  phone: "+91 98765 43210",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
  isLoggedIn: true
};

export const MOCK_DELIVERY_PARTNER: DeliveryPartner = {
  name: "Alex",
  phone: "+91 98765 24109",
  photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
  vehicle: "Ather 450X Electric Scooter",
  vehicleNumber: "KA 01 EK 4289",
  rating: 4.9,
  etaMinutes: 12,
  currentLat: 12.9716,
  currentLng: 77.5946
};

export const MOCK_COUPONS: Coupon[] = [
  {
    code: "FAIRFREE",
    title: "Free Delivery Above ₹299",
    description: "Enjoy zero delivery fee on orders ₹299 and above.",
    discountType: "free_delivery",
    discountValue: 48,
    minOrder: 299
  },
  {
    code: "WEEKEND15",
    title: "15% Off Your Meal",
    description: "Get 15% discount on food subtotal up to ₹75.",
    discountType: "percentage",
    discountValue: 15,
    minOrder: 350
  },
  {
    code: "WELCOMEFB",
    title: "Flat ₹50 Off Welcome Treat",
    description: "Flat ₹50 savings on your FairByte order above ₹250.",
    discountType: "fixed",
    discountValue: 50,
    minOrder: 250
  }
];

export const MOCK_PAST_ORDERS: Order[] = [
  {
    id: "FB-1982",
    restaurantId: "rest-spice-route",
    restaurantName: "Spice Route",
    restaurantImage: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=800",
    items: [
      {
        item: MOCK_MENU_ITEMS[0], // Butter chicken bowl
        restaurantId: "rest-spice-route",
        restaurantName: "Spice Route",
        quantity: 1
      },
      {
        item: MOCK_MENU_ITEMS[7], // Garlic naan
        restaurantId: "rest-spice-route",
        restaurantName: "Spice Route",
        quantity: 2
      }
    ],
    billing: {
      subtotal: 510,
      deliveryFee: 48,
      platformFee: 0,
      serviceFee: 0,
      cgst: 0,
      sgst: 0,
      discount: 0,
      grandTotal: 558,
      traditionalComparison: {
        foodPrice: 510,
        platformFee: 15,
        serviceFee: 45,
        deliveryFee: 48,
        surgeFee: 30,
        traditionalTotal: 648,
        fairByteTotal: 558,
        savings: 90
      }
    },
    status: "DELIVERED",
    address: MOCK_ADDRESSES[0],
    deliveryPartner: MOCK_DELIVERY_PARTNER,
    createdAt: "Yesterday, 8:15 PM",
    estimatedDeliveryMin: "Delivered in 28 min",
    paymentMethod: "UPI (Google Pay)",
    paymentStatus: "PAID"
  },
  {
    id: "FB-1840",
    restaurantId: "rest-dosa-district",
    restaurantName: "Dosa District",
    restaurantImage: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&q=80&w=800",
    items: [
      {
        item: MOCK_MENU_ITEMS[10], // Mysore masala dosa
        restaurantId: "rest-dosa-district",
        restaurantName: "Dosa District",
        quantity: 2
      },
      {
        item: MOCK_MENU_ITEMS[14], // Filter coffee
        restaurantId: "rest-dosa-district",
        restaurantName: "Dosa District",
        quantity: 2
      }
    ],
    billing: {
      subtotal: 420,
      deliveryFee: 35,
      platformFee: 0,
      serviceFee: 0,
      cgst: 0,
      sgst: 0,
      discount: 35,
      grandTotal: 420,
      traditionalComparison: {
        foodPrice: 420,
        platformFee: 15,
        serviceFee: 35,
        deliveryFee: 35,
        surgeFee: 20,
        traditionalTotal: 525,
        fairByteTotal: 420,
        savings: 105
      }
    },
    status: "DELIVERED",
    address: MOCK_ADDRESSES[1],
    deliveryPartner: MOCK_DELIVERY_PARTNER,
    createdAt: "19 Aug, 9:30 AM",
    estimatedDeliveryMin: "Delivered in 22 min",
    paymentMethod: "Credit Card (HDFC)",
    paymentStatus: "PAID"
  }
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    title: "Order Delivered 🎉",
    message: "Your order FB-1982 from Spice Route was delivered by Alex.",
    timeAgo: "Yesterday",
    read: true,
    type: "order",
    orderId: "FB-1982"
  },
  {
    id: "notif-2",
    title: "Transparent Pricing Verified ✨",
    message: "You saved ₹90 on your last order with FairByte zero platform fees!",
    timeAgo: "Yesterday",
    read: false,
    type: "system"
  },
  {
    id: "notif-3",
    title: "Weekend Special: Free Delivery 🛵",
    message: "Use code FAIRFREE on orders above ₹299 this weekend.",
    timeAgo: "2 days ago",
    read: false,
    type: "offer"
  }
];

export const MOCK_FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "How does FairByte charge true restaurant menu prices?",
    answer: "Unlike traditional food delivery apps that mark up food items by 15% to 30%, FairByte partners directly with kitchens and lists their in-store menu prices without hidden menu inflation.",
    category: "pricing"
  },
  {
    id: "faq-2",
    question: "Why does FairByte charge ₹0 platform fee and ₹0 service fee?",
    answer: "FairByte believes delivery logistics should be straightforward. You pay the restaurant for their food, and pay a fair, transparent delivery fee directly to the courier. No random platform convenience or surge fees.",
    category: "pricing"
  },
  {
    id: "faq-3",
    question: "How is the delivery fee calculated?",
    answer: "The delivery fee is calculated purely based on real-time distance from the restaurant to your address (typically base ₹35 + ₹12/km), with zero artificial surge markups.",
    category: "delivery"
  },
  {
    id: "faq-4",
    question: "Can I order from multiple restaurants at once?",
    answer: "To ensure your food arrives hot and fresh, each delivery order is fulfilled from a single restaurant kitchen per run.",
    category: "orders"
  },
  {
    id: "faq-5",
    question: "What is FairByte's cancellation and refund policy?",
    answer: "If the restaurant has not yet accepted your order, you can cancel instantly for a full 100% refund. In case of any missing or damaged item, our 24/7 in-app support resolves refunds within minutes.",
    category: "refunds"
  }
];

export const MOCK_SUPPORT_INITIAL_MESSAGES: SupportChatMessage[] = [
  {
    id: "msg-1",
    sender: "support",
    text: "Hello! Welcome to FairByte Support. How can we help you today with your orders, pricing or delivery?",
    timestamp: "Just now"
  }
];

// Helper to compute FairByte transparent billing + illustrative traditional comparison + coupon discount
export function computeBilling(
  subtotal: number, 
  deliveryFee: number = 48,
  coupon: Coupon | null = null
): BillingBreakdown {
  let discount = 0;
  if (coupon && subtotal >= coupon.minOrder) {
    if (coupon.discountType === "free_delivery") {
      discount = deliveryFee;
    } else if (coupon.discountType === "fixed") {
      discount = coupon.discountValue;
    } else if (coupon.discountType === "percentage") {
      discount = Math.min(75, Math.round((subtotal * coupon.discountValue) / 100));
    }
  }

  const effectiveDelivery = coupon?.discountType === "free_delivery" ? 0 : deliveryFee;
  const platformFee = 0; // FairByte zero platform fee
  const serviceFee = 0;  // FairByte zero service fee
  const cgst = 0;        // Included in direct restaurant menu price
  const sgst = 0;
  const grandTotal = Math.max(0, subtotal + effectiveDelivery - (coupon?.discountType !== "free_delivery" ? discount : 0));

  // Illustrative traditional delivery simulation:
  // e.g. for subtotal 320: Additional charges ~90 -> total 410, saving 42
  const traditionalPlatformFee = 15;
  const traditionalServiceFee = Math.max(25, Math.round(subtotal * 0.08));
  const traditionalSurgeFee = Math.max(20, Math.round(subtotal * 0.06));
  const traditionalDelivery = Math.max(35, deliveryFee);
  const traditionalTotal = subtotal + traditionalPlatformFee + traditionalServiceFee + traditionalSurgeFee + traditionalDelivery;
  const savings = Math.max(0, traditionalTotal - grandTotal);

  const traditionalComparison: TraditionalComparison = {
    foodPrice: subtotal,
    platformFee: traditionalPlatformFee,
    serviceFee: traditionalServiceFee,
    deliveryFee: traditionalDelivery,
    surgeFee: traditionalSurgeFee,
    traditionalTotal,
    fairByteTotal: grandTotal,
    savings
  };

  return {
    subtotal,
    deliveryFee: effectiveDelivery,
    platformFee,
    serviceFee,
    cgst,
    sgst,
    discount,
    grandTotal,
    appliedCoupon: coupon,
    traditionalComparison
  };
}
