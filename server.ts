import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initial list of items to browse
const FOOD_MENU = [
  {
    id: "m1",
    title: "Signature Butter Chicken Bowl",
    description: "Tender tandoori chicken cooked in creamy tomato makhani sauce. Served with premium basmati rice.",
    price: 320,
    rating: 4.8,
    category: "Main Course",
    isVeg: false,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "m2",
    title: "Paneer Lababdar Bowl",
    description: "Fresh cottage cheese cubes in rich onion, tomato and cashew gravy. Served with jeera pillaf.",
    price: 290,
    rating: 4.6,
    category: "Main Course",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1658145781116-24ba0cc3fa91?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "m3",
    title: "Crispy Samosa Chaat Duo",
    description: "Deconstructed spiced potato samosas topped with fresh curds, mint chutney, and tangly tamarind syrup.",
    price: 120,
    rating: 4.5,
    category: "Snacks",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "m4",
    title: "Old Delhi Tandoori Wings (8pcs)",
    description: "Spicy overnight-marinated chicken wings roasted to charred perfection in charcoal tandoor.",
    price: 260,
    rating: 4.7,
    category: "Snacks",
    isVeg: false,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "m5",
    title: "Dal Makhani Comfort Feast",
    description: "Slow, overnight cooked black lentils with churned white butter. Served with layered laccha paratha.",
    price: 270,
    rating: 4.9,
    category: "Main Course",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "m6",
    title: "Classic Mango Lassi",
    description: "Thick yogurt shake blended with fresh Alphonso mango pulp and cardamom.",
    price: 90,
    rating: 4.4,
    category: "Beverages",
    isVeg: true,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "m7",
    title: "Kesar Phirni",
    description: "Traditional Kashmiri slow-cooked ground rice pudding flavored with premium saffron, almonds, and pistachios.",
    price: 140,
    rating: 4.7,
    category: "Desserts",
    isVeg: true,
    isAvailable: false, // Out of stock example
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=800"
  }
];

// Restaurant Geo Location (Centrally located in Bengaluru)
const RESTAURANT_LAT = 12.9716;
const RESTAURANT_LNG = 77.5946;

// SQLite/PostgreSQL in-memory model stores
const db = {
  orders: new Map<string, any>(),
  deliveries: new Map<string, any>(),
  addresses: [
    { id: "addr_1", label: "Home", text: "Flat 402, Royal Palms, Lavelle Road, Bengaluru - 560001", lat: 12.9698, lng: 77.5972, isDefault: true },
    { id: "addr_2", label: "Work", text: "Level 11, WeWork Galaxy, Residency Rd, Bengaluru - 560025", lat: 12.9708, lng: 77.6015 }
  ]
};

// Map of active timer timeouts on the server to prevent memory leaks and clear them upon manual state changes
const activeOrderTimers = new Map<string, NodeJS.Timeout>();

// Helper logic for distance calculation (Haversine formula in Km)
function estimateDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 1. TAX & BILLING ENGINE UTILITY
function calculateBilling(subtotal: number, customerLat: number, customerLng: number) {
  // Use Uber Direct inspired pricing: base ₹35 + ₹12/km
  const distance = estimateDistanceKm(RESTAURANT_LAT, RESTAURANT_LNG, customerLat, customerLng);
  const deliveryFee = Math.round(35 + (distance * 12));

  const cgst = Math.round((subtotal * 0.025) * 100) / 100; // 2.5% CGST
  const sgst = Math.round((subtotal * 0.025) * 100) / 100; // 2.5% SGST
  const grandTotal = Math.round((subtotal + cgst + sgst + deliveryFee) * 100) / 100;

  return {
    subtotal,
    cgst,
    sgst,
    deliveryFee,
    grandTotal,
    distanceKm: Math.round(distance * 10) / 10
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  const httpServer = createServer(app);
  
  // Initialize Socket.io on same port 3000
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  app.use(express.json());

  // SSE / WS Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Get food menu
  app.get("/api/menu", (req, res) => {
    res.json(FOOD_MENU);
  });

  // Get user addresses
  app.get("/api/addresses", (req, res) => {
    res.json(db.addresses);
  });

  // Create customized address
  app.post("/api/addresses", (req, res) => {
    const { label, text, lat, lng } = req.body;
    if (!label || !text || !lat || !lng) {
      return res.status(400).json({ error: "Missing required geo-address fields" });
    }
    const newAddr = {
      id: "addr_" + Math.random().toString(36).substr(2, 9),
      label,
      text,
      lat,
      lng,
      isDefault: false
    };
    db.addresses.push(newAddr);
    res.status(201).json(newAddr);
  });

  // Billing Preview Endpoint (Dynamic billing computation)
  app.post("/api/billing/estimate", (req, res) => {
    const { items, address } = req.body;
    if (!items || !address) {
      return res.status(400).json({ error: "Missing items or destination address" });
    }

    // Map items to original price structure for security
    let subtotal = 0;
    for (const item of items) {
      const match = FOOD_MENU.find(f => f.id === item.item.id);
      if (match) {
        subtotal += match.price * item.quantity;
      }
    }

    const billing = calculateBilling(subtotal, address.lat, address.lng);
    res.json({ billing });
  });

  // 2. TWO-STEP PAYMENT LOCK (Razorpay pre-authorization holds)
  app.post("/api/orders/authorize", (req, res) => {
    const { items, address, customerPhone } = req.body;
    if (!items || items.length === 0 || !address) {
      return res.status(400).json({ error: "Cannot authorize billing without items and location pin" });
    }

    let subtotal = 0;
    for (const item of items) {
      const match = FOOD_MENU.find(f => f.id === item.item.id);
      if (match) {
        subtotal += match.price * item.quantity;
      }
    }

    const billing = calculateBilling(subtotal, address.lat, address.lng);
    const orderId = "order_" + Math.random().toString(36).substring(2, 10).toUpperCase();
    const paymentIntentId = "pay_auth_" + Math.random().toString(36).substring(2, 12).toUpperCase();

    const orderData = {
      id: orderId,
      items,
      billing,
      status: "AUTHORIZED",
      address,
      paymentIntentId,
      paymentStatus: "AUTHORIZED",
      createdAt: new Date().toISOString(),
      customerPhone: customerPhone || "+91 98765 43210",
      elapsedAcceptSeconds: 60
    };

    // Commit to in-memory state store
    db.orders.set(orderId, orderData);

    console.log(`[RAZORPAY HOLD] Pre-authorized payment hold of ₹${billing.grandTotal} under authorization: ${paymentIntentId} for Order ${orderId}`);

    // Emit live push to Kitchen node via WebSockets
    io.emit("kitchen_order_received", orderData);

    // 3. KITCHEN PUSH NODE: 60-second automatic VOID / cancellation loop
    const timer = setTimeout(() => {
      const liveOrder = db.orders.get(orderId);
      if (liveOrder && liveOrder.status === "AUTHORIZED") {
        console.log(`[TIMEOUT - 60s] Order ${orderId} expired without Kitchen accept. Triggering Razorpay Void API...`);
        
        // VOID transaction
        liveOrder.status = "CANCELLED_TIMED_OUT";
        liveOrder.paymentStatus = "VOIDED";
        db.orders.set(orderId, liveOrder);

        // Notify over socket
        io.emit("order_cancelled", {
          orderId,
          reason: "KITCHEN_TIMEOUT",
          paymentStatus: "VOIDED",
          message: "Payment refunded instantly to customer bank account."
        });
      }
      activeOrderTimers.delete(orderId);
    }, 60000);

    activeOrderTimers.set(orderId, timer);

    res.status(201).json({
      success: true,
      order: orderData,
      message: "Razorpay 2-step Payment Auth hold locked successfully. Order pushed to Kitchen node."
    });
  });

  // GET SPECIFIC ORDER STATE
  app.get("/api/orders/:id", (req, res) => {
    const order = db.orders.get(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    
    const delivery = db.deliveries.get(req.params.id);
    res.json({ order, delivery });
  });

  // GET ALL ORDERS FOR RECONCILIATION
  app.get("/api/orders", (req, res) => {
    res.json(Array.from(db.orders.values()));
  });

  // 3. KITCHEN PUSH NODE ACTION: Accept / Reject
  app.post("/api/kitchen/action", (req, res) => {
    const { orderId, action } = req.body;
    if (!orderId || !action) {
      return res.status(400).json({ error: "Missing required orderId or action parameters" });
    }

    const order = db.orders.get(orderId);
    if (!order) return res.status(404).json({ error: "Order not found or has been purged" });

    if (order.status !== "AUTHORIZED") {
      return res.status(400).json({ error: `Kitchen cannot execute action. Current status is ${order.status}` });
    }

    // Clear the 60s void expiration handler
    const activeTimer = activeOrderTimers.get(orderId);
    if (activeTimer) {
      clearTimeout(activeTimer);
      activeOrderTimers.delete(orderId);
    }

    if (action === "accept") {
      // CAPTURE Razorpay transaction
      order.status = "CONFIRMED";
      order.paymentStatus = "CAPTURED";
      db.orders.set(orderId, order);
      console.log(`[RAZORPAY CAPTURE] Finalized capture of ₹${order.billing.grandTotal} under Auth ID: ${order.paymentIntentId}`);

      // TRIGGER UBER DIRECT 'Create Delivery' API (OAuth eats.deliveries mock)
      const jobId = "uber_job_direct_" + Math.random().toString(36).substring(2, 10).toUpperCase();
      const trackingUrl = `https://uber-direct.tracker.live/${jobId}`;
      const driverName = ["Rahul Sharma", "Karan Malhotra", "Amit Patel", "Girish Kumar"][Math.floor(Math.random() * 4)];
      const driverPhone = "+91 9988" + Math.floor(100000 + Math.random() * 900000);

      const deliveryDetails = {
        orderId,
        uberJobId: jobId,
        driverName,
        driverPhone,
        driverLat: RESTAURANT_LAT,
        driverLng: RESTAURANT_LNG,
        status: "PENDING",
        trackingUrl,
        etaMinutes: 15
      };

      db.deliveries.set(orderId, deliveryDetails);
      console.log(`[UBER DIRECT API SUCCESS] OAuth Scope: eats.deliveries. Created delivery job for ${orderId}. Job ID: ${jobId}`);

      // Start asynchronous GPS courier tracking simulation (closes loop)
      simulateUberDirectTracking(orderId, order.address.lat, order.address.lng, io);

      // Emit client state update
      io.emit("order_accepted", { order, delivery: deliveryDetails });

      res.json({
        success: true,
        order,
        delivery: deliveryDetails,
        message: "Razorpay payment captured and Uber Direct job dispatched."
      });

    } else if (action === "reject") {
      // VOID Razorpay transactional balance hold
      order.status = "CANCELLED_REJECTED";
      order.paymentStatus = "VOIDED";
      db.orders.set(orderId, order);
      console.log(`[RAZORPAY VOID] Released holds instantly under Auth ID: ${order.paymentIntentId}`);

      io.emit("order_cancelled", {
        orderId,
        reason: "KITCHEN_REJECTED",
        paymentStatus: "VOIDED",
        message: "Vendor rejected. Held customer balances successfully released."
      });

      res.json({
        success: true,
        order,
        message: "Order was declined. Authorization hold has been voided safely."
      });
    } else {
      res.status(400).json({ error: "Invalid kitchen action. Allowed is accept or reject" });
    }
  });

  // Client WebSockets listening event channels
  io.on("connection", (socket) => {
    console.log(`[WS CONNECT] Socket client linked: ${socket.id}`);
    
    // Send existing data models on load
    socket.emit("sync_initial", {
      orders: Array.from(db.orders.values()),
      deliveries: Array.from(db.deliveries.values())
    });

    socket.on("disconnect", () => {
      console.log(`[WS DISCONNECT] Socket disconnected: ${socket.id}`);
    });
  });

  // COURIER RIDE TRACKER SIMULATION (Background worker simulation)
  function simulateUberDirectTracking(orderId: string, destLat: number, destLng: number, ioInstance: Server) {
    let step = 0;
    const totalSteps = 4;
    
    const trackingInterval = setInterval(() => {
      const order = db.orders.get(orderId);
      const delivery = db.deliveries.get(orderId);

      if (!order || !delivery || order.status === "CANCELLED_REJECTED" || order.status === "CANCELLED_TIMED_OUT") {
        clearInterval(trackingInterval);
        return;
      }

      step++;
      
      // Interpolate GPS positions towards customer
      const latFraction = step / totalSteps;
      delivery.driverLat = RESTAURANT_LAT + (destLat - RESTAURANT_LAT) * latFraction;
      delivery.driverLng = RESTAURANT_LNG + (destLng - RESTAURURANT_LNG_HELPER(destLng)) * latFraction;
      
      function RESTAURURANT_LNG_HELPER(lng: number) {
        return RESTAURANT_LNG; // helper coordinate mapper
      }

      if (step === 1) {
        delivery.status = "PICKED_UP";
        order.status = "DELIVERING";
        delivery.etaMinutes = 10;
        console.log(`[UBER DELIVERY DISPATCH] Courier ${delivery.driverName} picked up package for order ${orderId}`);
      } else if (step === 2) {
        delivery.status = "PICKED_UP";
        delivery.etaMinutes = 5;
      } else if (step === 3) {
        delivery.status = "ARRIVED";
        order.status = "ARRIVED";
        delivery.etaMinutes = 2;
        console.log(`[UBER DELIVERY ARRIVED] Courier is at user door for ${orderId}`);
      } else if (step === 4) {
        delivery.status = "DELIVERED";
        order.status = "COMPLETED";
        delivery.etaMinutes = 0;
        console.log(`[UBER DELIVERY COMPLETED] Uber Direct order ${orderId} delivered`);
        clearInterval(trackingInterval);
      }

      db.orders.set(orderId, order);
      db.deliveries.set(orderId, delivery);

      // Emit over sockets
      ioInstance.emit("order_tracking_update", { order, delivery });

    }, 10000); // Progresses tracking state every 10 seconds for real UX feel
  }

  // Mount Vite middleware in active Dev Environment
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`🍔 Express App running on http://0.0.0.0:${PORT}`);
    console.log(`🔌 WebSockets synced and active on Port 3000.`);
  });
}

startServer().catch((err) => {
  console.error("Critical server configuration crash: ", err);
});
