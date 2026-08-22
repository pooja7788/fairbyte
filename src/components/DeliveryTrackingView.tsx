import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  Bike, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Star, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  RefreshCw,
  Navigation,
  Truck,
  Wifi,
  ExternalLink
} from "lucide-react";
import { Order } from "../types";
import { getUberRideBookingUrl } from "../lib/uberMcp";

interface DeliveryTrackingViewProps {
  order: Order;
  onBackToHome: () => void;
  onBackToOrders: () => void;
}

const TIMELINE_STEPS = [
  { id: 0, title: "Order placed", desc: "Sent to kitchen directly at menu price" },
  { id: 1, title: "Restaurant accepted", desc: "Kitchen started fresh prep" },
  { id: 2, title: "Preparing your food", desc: "Chef is packaging your dishes" },
  { id: 3, title: "Rider picking up", desc: "Alex is at the kitchen" },
  { id: 4, title: "On the way", desc: "En route to your location" },
  { id: 5, title: "Delivered", desc: "Handed over at your door" }
];

export default function DeliveryTrackingView({
  order,
  onBackToHome,
  onBackToOrders
}: DeliveryTrackingViewProps) {
  const getStepFromStatus = (status: string) => {
    switch (status) {
      case "PLACED": return 0;
      case "ACCEPTED": return 1;
      case "PREPARING": return 2;
      case "READY_FOR_PICKUP":
      case "RIDER_ASSIGNED": return 3;
      case "OUT_FOR_DELIVERY":
      case "DELIVERING": return 4;
      case "DELIVERED":
      case "COMPLETED": return 5;
      default: return 2;
    }
  };

  const [currentStep, setCurrentStep] = useState(getStepFromStatus(order.status));
  const [callSimulated, setCallSimulated] = useState(false);
  const [msgSimulated, setMsgSimulated] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [deliveryJobId, setDeliveryJobId] = useState<string | null>(null);
  const socketRef = useRef<any>(null);

  // Sync step whenever order status prop is updated (e.g. from Admin dashboard)
  useEffect(() => {
    setCurrentStep(getStepFromStatus(order.status));
  }, [order.status]);

  // Connect to backend Socket.IO for live delivery tracking updates
  useEffect(() => {
    let socket: any = null;
    let autoTimer: ReturnType<typeof setInterval> | null = null;

    const connectSocket = async () => {
      try {
        // Dynamically import socket.io-client to avoid SSR issues
        const { io } = await import("socket.io-client");
        socket = io(window.location.origin, { transports: ["websocket", "polling"] });
        socketRef.current = socket;

        socket.on("connect", () => {
          setIsLive(true);
          console.log("[RestoX Tracking] Connected to delivery socket:", socket.id);
        });

        socket.on("disconnect", () => setIsLive(false));

        // Listen for backend delivery status updates
        socket.on("order_tracking_update", (data: any) => {
          if (data?.order?.id === order.id || data?.delivery?.orderId === order.id) {
            const step = getStepFromStatus(data.order?.status || data.delivery?.status);
            setCurrentStep(step);
            if (data.delivery?.jobId) setDeliveryJobId(data.delivery.jobId);
          }
        });

        socket.on("order_accepted", (data: any) => {
          if (data?.order?.id === order.id) setCurrentStep(1);
        });

      } catch (err) {
        console.warn("[RestoX Tracking] Socket unavailable, using auto-simulation:", err);
      }
    };

    connectSocket();

    // Auto-simulation fallback: advances every 12s if socket not connected
    autoTimer = setInterval(() => {
      setCurrentStep(prev => (prev < 5 ? prev + 1 : 5));
    }, 12000);

    return () => {
      if (socket) socket.disconnect();
      if (autoTimer) clearInterval(autoTimer);
    };
  }, [order.id]);

  const handleSimulateCall = () => {
    setCallSimulated(true);
    setTimeout(() => setCallSimulated(false), 3000);
  };

  const handleSimulateMsg = () => {
    setMsgSimulated(true);
    setTimeout(() => setMsgSimulated(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24">
      
      {/* 1. TOP NAV BAR */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToOrders}
          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white hover:bg-zinc-100 border border-zinc-200 text-xs font-bold text-zinc-800 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>My Orders</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Live connection badge */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold border ${
            isLive 
              ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
              : "bg-amber-50 text-amber-800 border-amber-200"
          }`}>
            <span className={`w-2 h-2 rounded-full ${isLive ? "bg-emerald-500 animate-ping" : "bg-amber-400 animate-pulse"}`} />
            <span>{isLive ? `Live · #${order.id}` : `Tracking · #${order.id}`}</span>
          </div>

          <button
            onClick={onBackToHome}
            className="cursor-pointer text-xs font-bold text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200 px-3 py-1.5 rounded-2xl shadow-2xs"
          >
            Home
          </button>
        </div>
      </div>

      {/* 2. REALISTIC INTERACTIVE MOCK MAP */}
      <div className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden shadow-xl relative h-72 sm:h-96">
        
        {/* Stylized Dark Grid Map Texture */}
        <div className="absolute inset-0 bg-[#121820] opacity-90">
          <svg className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10b981" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Simulated Roads */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 120,240 C 220,180 340,260 520,160 S 700,120 800,80"
              fill="none"
              stroke="#064e3b"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M 120,240 C 220,180 340,260 520,160 S 700,120 800,80"
              fill="none"
              stroke="#10b981"
              strokeWidth="4"
              strokeDasharray="8 6"
              className="animate-pulse"
            />
          </svg>
        </div>

        {/* RESTAURANT PIN */}
        <div className="absolute left-[15%] bottom-[35%] -translate-x-1/2 flex flex-col items-center">
          <div className="bg-zinc-950 border border-emerald-500/50 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md whitespace-nowrap mb-1">
            🏪 {order.restaurantName}
          </div>
          <div className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white shadow-lg shadow-emerald-600/50">
            <MapPin className="w-4 h-4" />
          </div>
        </div>

        {/* CUSTOMER DESTINATION PIN */}
        <div className="absolute right-[18%] top-[25%] -translate-x-1/2 flex flex-col items-center">
          <div className="bg-zinc-950 border border-zinc-700 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md whitespace-nowrap mb-1">
            📍 {order.address.label}
          </div>
          <div className="w-8 h-8 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-white shadow-lg shadow-red-500/50">
            <MapPin className="w-4 h-4" />
          </div>
        </div>

        {/* MOVING RIDER PIN (Calculated position based on step) */}
        <motion.div
          animate={{
            left: `${20 + currentStep * 13}%`,
            top: `${60 - currentStep * 8}%`
          }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20"
        >
          <div className="bg-emerald-500 text-zinc-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-md whitespace-nowrap mb-1 flex items-center gap-1">
            <Navigation className="w-3 h-3" />
            <span>Alex ({order.deliveryPartner.vehicleNumber})</span>
          </div>
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 border-2 border-white flex items-center justify-center text-zinc-950 shadow-xl shadow-emerald-500/50">
              <Bike className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="absolute -inset-1 rounded-2xl bg-emerald-400 opacity-40 animate-ping pointer-events-none" />
          </div>
        </motion.div>

        {/* Top Overlay Banner with Live ETA */}
        <div className="absolute top-4 left-4 right-4 sm:right-auto bg-zinc-950/85 backdrop-blur-md border border-zinc-800 p-3 rounded-2xl flex items-center gap-3 text-white">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center font-black text-sm">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 uppercase font-bold block">Estimated Arrival</span>
            <span className="font-black text-sm text-emerald-400">
              {currentStep >= 5 ? "Delivered!" : `Arriving in ${Math.max(2, 14 - currentStep * 3)} mins`}
            </span>
          </div>
        </div>

        {/* Demo Step Progression Controller */}
        <div className="absolute bottom-4 right-4 bg-zinc-950/90 backdrop-blur-md border border-zinc-800 p-2 rounded-2xl flex items-center gap-2 text-xs text-white">
          <span className="text-[10px] text-zinc-400 font-mono pl-1">Demo Stage:</span>
          <button
            onClick={() => setCurrentStep(prev => (prev > 0 ? prev - 1 : 0))}
            className="cursor-pointer px-2 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-bold"
          >
            ◀
          </button>
          <span className="font-mono text-emerald-400 font-bold px-1">{currentStep + 1}/6</span>
          <button
            onClick={() => setCurrentStep(prev => (prev < 5 ? prev + 1 : 5))}
            className="cursor-pointer px-2 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-bold"
          >
            ▶
          </button>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left: 6-Step Order Timeline */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 className="font-black text-base text-zinc-950 font-sans">
              Delivery Progress
            </h3>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              {TIMELINE_STEPS[currentStep].title}
            </span>
          </div>

          {/* Stepper Vertical Tree */}
          <div className="space-y-6 relative pl-2">
            {/* Connecting line */}
            <div className="absolute left-6 top-3 bottom-4 w-0.5 bg-zinc-200" />

            {TIMELINE_STEPS.map((step) => {
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              const isUpcoming = currentStep < step.id;

              return (
                <div key={step.id} className="relative flex items-start gap-4">
                  {/* Step Marker Icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 font-bold text-xs transition-all ${
                    isCompleted
                      ? "bg-emerald-600 text-white shadow-xs"
                      : isCurrent
                      ? "bg-emerald-100 text-emerald-900 border-2 border-emerald-600 animate-pulse"
                      : "bg-zinc-100 text-zinc-400 border border-zinc-300"
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <span>{step.id + 1}</span>
                    )}
                  </div>

                  {/* Text Content */}
                  <div className="space-y-0.5">
                    <h4 className={`text-xs sm:text-sm font-extrabold ${
                      isCurrent ? "text-emerald-700" : isCompleted ? "text-zinc-900" : "text-zinc-400"
                    }`}>
                      {step.title}
                    </h4>
                    <p className="text-[11px] text-zinc-500">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right: Delivery Partner Card & Transparent Order Details */}
        <div className="md:col-span-5 space-y-6">
          
          {/* DELIVERY PARTNER CARD */}
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-sm space-y-5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 block border-b border-zinc-100 pb-2">
              Delivery Partner
            </span>

            <div className="flex items-center gap-4">
              <img
                src={order.deliveryPartner.photo}
                alt={order.deliveryPartner.name}
                className="w-14 h-14 rounded-2xl object-cover border border-zinc-200 shadow-xs"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-sm text-zinc-950">
                    {order.deliveryPartner.name}
                  </h4>
                  <div className="flex items-center gap-0.5 text-[10px] font-bold bg-amber-50 text-amber-900 px-1.5 py-0.5 rounded">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                    <span>{order.deliveryPartner.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-500">
                  {order.deliveryPartner.vehicle}
                </p>
                <p className="text-[10px] font-mono text-zinc-400">
                  {order.deliveryPartner.vehicleNumber}
                </p>
              </div>
            </div>

            {/* Simulated Call / Message Actions */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={handleSimulateCall}
                className="cursor-pointer bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-95"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{callSimulated ? "Connecting..." : "Call Partner"}</span>
              </button>

              <button
                onClick={handleSimulateMsg}
                className="cursor-pointer bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-95"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>{msgSimulated ? "Opening..." : "Send Note"}</span>
              </button>
            </div>

            {/* Delivery Network Badge */}
            <div className="w-full bg-gradient-to-r from-emerald-900/10 to-emerald-600/10 border border-emerald-200 text-emerald-800 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 mt-1">
              <Truck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Autonomous delivery partner dispatch</span>
              {isLive && <Wifi className="w-3 h-3 text-emerald-500 animate-pulse" />}
            </div>

            {/* Direct Open / Book Live in Uber Button for all restaurants */}
            <a
              href={getUberRideBookingUrl(
                { name: order.restaurantName, lat: 12.9716, lng: 77.5946 },
                order.address
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer w-full bg-black hover:bg-zinc-800 text-emerald-400 border border-zinc-700 text-xs font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 text-center mt-1"
            >
              <span>🚕 Open Live in Uber</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {callSimulated && (
              <p className="text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded-xl text-center font-bold">
                📞 Calling Alex (+91 98765 24109)...
              </p>
            )}
            {msgSimulated && (
              <p className="text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded-xl text-center font-bold">
                💬 Delivery note: "Please leave package at the door."
              </p>
            )}
          </div>

          {/* Quick Receipt Summary */}
          <div className="bg-zinc-50 rounded-3xl border border-zinc-200/80 p-5 space-y-3 text-xs">
            <span className="font-extrabold text-zinc-900 block border-b border-zinc-200 pb-2">
              Order Receipt
            </span>
            <div className="space-y-1.5 text-zinc-600">
              <div className="flex justify-between">
                <span>Restaurant:</span>
                <span className="font-bold text-zinc-900">{order.restaurantName}</span>
              </div>
              <div className="flex justify-between">
                <span>Food subtotal:</span>
                <span className="font-mono">₹{order.billing.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>CGST (2.5%):</span>
                <span className="font-mono">₹{order.billing.cgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>SGST (2.5%):</span>
                <span className="font-mono">₹{order.billing.sgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Platform fee:</span>
                <span className="font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px]">₹0.00</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span className="font-mono">
                  {order.billing.deliveryFee === 0 ? "FREE" : `₹${order.billing.deliveryFee.toFixed(2)}`}
                  {order.billing.distanceKm ? ` (${order.billing.distanceKm} km @ ₹7/km)` : ""}
                </span>
              </div>
              <div className="border-t border-zinc-200 pt-2 flex justify-between font-black text-zinc-950 text-sm">
                <span>Paid via {order.paymentMethod}:</span>
                <span className="font-sans text-emerald-700">₹{order.billing.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
