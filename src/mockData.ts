import { Restaurant, FoodItem, Address, DeliveryPartner, TraditionalComparison, BillingBreakdown } from "./types";

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
    id: "sr-7",
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
    id: "sr-8",
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
    id: "sr-9",
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
    price: 170,
    rating: 4.8,
    category: "Dosas & Uttapams",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=800",
    isPopular: true,
    prepTime: "12 min"
  },
  {
    id: "dd-3",
    restaurantId: "rest-dosa-district",
    title: "Button Idli Platter with Sambar Dip",
    description: "14 mini steamed rice cakes dipped in piping hot drumstick sambar with fresh coconut chutney.",
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
    title: "Medu Vada Combo (2 pcs)",
    description: "Crispy golden lentil fritters with crushed black pepper, ginger, and curry leaves. Served with 3 chutneys.",
    price: 90,
    rating: 4.6,
    category: "Idli & Vada",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=800",
    prepTime: "10 min"
  },
  {
    id: "dd-5",
    restaurantId: "rest-dosa-district",
    title: "Traditional South Indian Filter Kaapi",
    description: "Strong decoction filter coffee brewed with chicory and frothed in brass davarah.",
    price: 50,
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
    description: "Kachi yakhni style long basmati rice layered with succulent chicken pieces, caramelized onions, and kewra.",
    price: 360,
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
    title: "Mutton Nizami Dum Biryani",
    description: "Tender goat meat slow-cooked on dum for 4 hours with fragrant spices, saffron rice, and boiled egg.",
    price: 440,
    rating: 4.9,
    category: "Dum Biryanis",
    isVeg: false,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=800",
    isPopular: true,
    prepTime: "30 min"
  },
  {
    id: "bj-3",
    restaurantId: "rest-biryani-junction",
    title: "Subz Paneer Dum Biryani",
    description: "Garden fresh carrots, beans, peas, and paneer cubes cooked in dum rice with mint and fried onions.",
    price: 280,
    rating: 4.6,
    category: "Dum Biryanis",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1642821373181-696a54913e93?auto=format&fit=crop&q=80&w=800",
    prepTime: "20 min"
  },
  {
    id: "bj-4",
    restaurantId: "rest-biryani-junction",
    title: "Chicken Seekh Kebab (4 pcs)",
    description: "Minced chicken skewers seasoned with herbs, mint, and spices, roasted over red-hot charcoal.",
    price: 290,
    rating: 4.8,
    category: "Starters & Kebabs",
    isVeg: false,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&q=80&w=800",
    prepTime: "18 min"
  },
  {
    id: "bj-5",
    restaurantId: "rest-biryani-junction",
    title: "Shahi Tukda",
    description: "Crispy fried bread slices dipped in saffron sugar syrup and generously covered with thick rabri.",
    price: 130,
    rating: 4.7,
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
    title: "Double Smash Truffle Burger",
    description: "Two smashed beef/chicken patties, melted sharp cheddar, truffle aioli, and caramelized onions on brioche.",
    price: 340,
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
    title: "Crispy Peri Peri Chicken Burger",
    description: "Fried crunchy chicken breast coated in fiery peri peri spice, crisp iceberg lettuce, and chipotle mayo.",
    price: 290,
    rating: 4.7,
    category: "Burgers",
    isVeg: false,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&q=80&w=800",
    prepTime: "15 min"
  },
  {
    id: "bl-3",
    restaurantId: "rest-burger-lab",
    title: "Smoky BBQ Paneer Burger",
    description: "Grilled marinated paneer steak with smokey barbecue glaze, pickled onions, and garlic ranch.",
    price: 240,
    rating: 4.6,
    category: "Burgers",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800",
    prepTime: "12 min"
  },
  {
    id: "bl-4",
    restaurantId: "rest-burger-lab",
    title: "Truffle Parmesan Fries",
    description: "Crispy skin-on potato fries tossed in truffle oil, fresh rosemary, and grated aged parmesan.",
    price: 160,
    rating: 4.8,
    category: "Fries & Sides",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&q=80&w=800",
    prepTime: "10 min"
  },
  {
    id: "bl-5",
    restaurantId: "rest-burger-lab",
    title: "Belgian Dark Chocolate Thickshake",
    description: "Creamy artisanal shake made with 70% Belgian dark chocolate, rich milk, and whipped cream topping.",
    price: 180,
    rating: 4.9,
    category: "Beverages & Shakes",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=800",
    prepTime: "8 min"
  },

  // 5. Green Bowl
  {
    id: "gb-1",
    restaurantId: "rest-green-bowl",
    title: "Avocado & Edamame Quinoa Bowl",
    description: "Organic tricolor quinoa, fresh Hass avocado, edamame beans, roasted chickpeas, and tahini lime dressing.",
    price: 360,
    rating: 4.9,
    category: "Recommended",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800",
    isPopular: true,
    prepTime: "12 min"
  },
  {
    id: "gb-2",
    restaurantId: "rest-green-bowl",
    title: "Mediterranean Falafel Mezze Salad",
    description: "Herbed chickpea falafels, kalamata olives, cucumber ribbons, feta cheese, and hummus vinaigrette.",
    price: 310,
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
    title: "Cold Pressed Valencia Orange Juice",
    description: "100% pure raw cold-pressed orange juice without added sugar, water, or preservatives.",
    price: 140,
    rating: 4.8,
    category: "Cold Pressed Juices",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=800",
    prepTime: "5 min"
  },

  // 6. Curry House
  {
    id: "ch-1",
    restaurantId: "rest-curry-house",
    title: "Homestyle Kadai Chicken Feast",
    description: "Tender chicken cooked with bell peppers, freshly pounded coriander seeds, and whole dried red chilies.",
    price: 280,
    rating: 4.7,
    category: "Recommended",
    isVeg: false,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=800",
    isPopular: true,
    prepTime: "20 min"
  },
  {
    id: "ch-2",
    restaurantId: "rest-curry-house",
    title: "Punjabi Dhaba Dal Tadka",
    description: "Yellow toor dal tempered with desi ghee, cumin, fresh garlic, green chilies, and coriander.",
    price: 190,
    rating: 4.8,
    category: "Main Course",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800",
    prepTime: "15 min"
  },
  {
    id: "ch-3",
    restaurantId: "rest-curry-house",
    title: "Royal Executive Thali (Veg)",
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
    lat: 12.9698,
    lng: 77.5972,
    isDefault: true
  },
  {
    id: "addr-2",
    label: "Work / Office",
    text: "Level 11, WeWork Galaxy, Residency Rd, Bengaluru - 560025",
    lat: 12.9708,
    lng: 77.6015
  },
  {
    id: "addr-3",
    label: "Koramangala Studio",
    text: "Building 12, 80 Feet Rd, Koramangala 4th Block, Bengaluru - 560034",
    lat: 12.9343,
    lng: 77.6253
  },
  {
    id: "addr-4",
    label: "Indiranagar Flat",
    text: "Flat B, Metro Heights, 100 Feet Rd, Indiranagar, Bengaluru - 560038",
    lat: 12.9784,
    lng: 77.6408
  }
];

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

// Helper to compute FairByte transparent billing + illustrative traditional comparison
export function computeBilling(subtotal: number, deliveryFee: number = 48): BillingBreakdown {
  const cgst = 0; // FairByte displays menu price as inclusive or zero hidden taxes
  const sgst = 0;
  const platformFee = 0; // FairByte zero platform fee
  const serviceFee = 0;  // FairByte zero service fee
  const grandTotal = subtotal + deliveryFee;

  // Traditional delivery markup simulation for illustrative comparison:
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
    deliveryFee,
    platformFee,
    serviceFee,
    cgst,
    sgst,
    grandTotal,
    traditionalComparison
  };
}
