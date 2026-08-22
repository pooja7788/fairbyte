import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  Clock, 
  Bike, 
  User, 
  Phone, 
  CheckCircle2, 
  MapPin, 
  Navigation, 
  Play, 
  FastForward, 
  RotateCcw, 
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
  UtensilsCrossed,
  Home
} from "lucide-react";
import { Order, OrderStatus } from "../types";

interface DeliveryTrackingViewProps {
  order: Order;
  onBackToHome: () => void;
}

const TIMELINE_STEPS: { status: OrderStatus; label: string; description: string }[] = [
  { status: "PLACED", label: "Order placed", description: "Transmitted to restaurant at menu price" },
  { status: "ACCEPTED", label: "Restaurant accepted", description: "Kitchen verified ticket order" },
  { status: "PREPARING", label: "Preparing your food", description: "Chef is cooking fresh ingredients" },
  { status: "RIDER_ASSIGNED", label: "Rider picking up", description: "Alex arrived at the restaurant counter" },
  { status: "ON_THE_WAY", label: "On the way", description: "Courier is en route to your address" },
  { status: "DELIVERED", label: "Delivered", description: "Enjoy your fresh meal with zero surprise fees!" }
];

export default function DeliveryTrackingView({
  order,
  onBackToHome
}: DeliveryTrackingViewProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(2); // Default at "Preparing your food"
  const [etaMinutes, setEtaMinutes] = useState<number>(12);
  const [isAutoSimulating, setIsAutoSimulating] = useState<boolean>(true);
  const [showOrderSummary, setShowOrderSummary] = useState<boolean>(false);
  const [simProgress, setSimProgress] = useState<number>(0.4); // 0 to 1 along route

  // Step progression auto-timer for live presentation feel
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoSimulating && currentStepIndex < TIMELINE_STEPS.length - 1) {
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          const next = prev + 1;
          if (next === 3) setEtaMinutes(9);
          if (next === 4) setEtaMinutes(4);
          if (next === 5) setEtaMinutes(0);
          return next;
        });
      }, 7000); // Advances step every 7s
    }
    return () => clearInterval(interval);
  }, [isAutoSimulating, currentStepIndex]);

  // Update route progress based on step
  useEffect(() => {
    if (currentStepIndex === 0) setSimProgress(0.05);
    else if (currentStepIndex === 1) setSimProgress(0.15);
    else if (currentStepIndex === 2) setSimProgress(0.35);
    else if (currentStepIndex === 3) setSimProgress(0.55);
    else if (currentStepIndex === 4) setSimProgress(0.85);
    else if (currentStepIndex === 5) setSimProgress(1.0);
  }, [currentStepIndex]);

  // Draw animated map
  useEffect(() => {
    const canvas = document.getElementById("tracking-map-canvas") as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Canvas background
    ctx.fillStyle = "#18181b"; // Dark mode sleek map
    ctx.fillRect(0, 0, w, h);

    // Grid road network
    ctx.strokeStyle = "#27272a";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.3); ctx.lineTo(w, h * 0.3);
    ctx.moveTo(0, h * 0.7); ctx.lineTo(w, h * 0.7);
    ctx.moveTo(w * 0.25, 0); ctx.lineTo(w * 0.25, h);
    ctx.moveTo(w * 0.75, 0); ctx.lineTo(w * 0.75, h);
    ctx.stroke();

    // Curved primary delivery road
    const startX = w * 0.15;
    const startY = h * 0.65;
    const endX = w * 0.85;
    const endY = h * 0.35;

    const ctrlX1 = w * 0.35;
    const ctrlY1 = h * 0.25;
    const ctrlX2 = w * 0.65;
    const ctrlY2 = h * 0.85;

    // Road casing
    ctx.strokeStyle = "#3f3f46";
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(ctrlX1, ctrlY1, ctrlX2, ctrlY2, endX, endY);
    ctx.stroke();

    // Road fill
    ctx.strokeStyle = "#10b981"; // Emerald path
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(ctrlX1, ctrlY1, ctrlX2, ctrlY2, endX, endY);
    ctx.stroke();

    // Landmark text labels
    ctx.font = "bold 9px monospace";
    ctx.fillStyle = "#71717a";
    ctx.fillText("INDIRANAGAR KITCHEN", startX - 20, startY + 28);
    ctx.fillText("CUSTOMER GEOFENCE", endX - 50, endY - 24);

    // 1. Restaurant Start Pin
    ctx.fillStyle = "#059669";
    ctx.beginPath();
    ctx.arc(startX, startY, 8, 0, 2 * Math.PI);
    ctx.fill();

    // 2. Customer End Pin
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.arc(endX, endY, 8, 0, 2 * Math.PI);
    ctx.fill();

    // End Pin Pulse Halo
    ctx.strokeStyle = "rgba(245, 158, 11, 0.4)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(endX, endY, 14, 0, 2 * Math.PI);
    ctx.stroke();

    // Compute Rider Position along Bezier curve
    const t = simProgress;
    const riderX = Math.pow(1 - t, 3) * startX + 3 * Math.pow(1 - t, 2) * t * ctrlX1 + 3 * (1 - t) * Math.pow(t, 2) * ctrlX2 + Math.pow(t, 3) * endX;
    const riderY = Math.pow(1 - t, 3) * startY + 3 * Math.pow(1 - t, 2) * t * ctrlY1 + 3 * (1 - t) * Math.pow(t, 2) * ctrlY2 + Math.pow(t, 3) * endY;

    // Draw Rider Circle Marker
    ctx.shadowBlur = 12;
    ctx.shadowColor = "#10b981";
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(riderX, riderY, 10, 0, 2 * Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Inner rider dot
    ctx.fillStyle = "#059669";
    ctx.beginPath();
    ctx.arc(riderX, riderY, 5, 0, 2 * Math.PI);
    ctx.fill();

    // Floating tooltip tag above rider
    ctx.fillStyle = "#09090b";
    ctx.fillRect(riderX - 35, riderY - 26, 70, 14);
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 1;
    ctx.strokeRect(riderX - 35, riderY - 26, 70, 14);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 8px sans-serif";
    ctx.fillText("ALEX • ATHER", riderX - 30, riderY - 16);

  }, [simProgress]);

  const activeStep = TIMELINE_STEPS[currentStepIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBackToHome}
          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-zinc-200 text-xs font-bold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 shadow-xs transition-all self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Home</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Live Presentation Demo Controls */}
          <div className="bg-zinc-900 text-white p-1.5 rounded-2xl border border-zinc-800 flex items-center gap-1.5 shadow-sm text-xs font-mono">
            <span className="text-[10px] text-zinc-400 font-bold px-2 uppercase">Demo Simulator:</span>
            
            <button
              onClick={() => {
                setCurrentStepIndex((prev) => (prev > 0 ? prev - 1 : 0));
                setIsAutoSimulating(false);
              }}
              disabled={currentStepIndex === 0}
              className="cursor-pointer px-2 py-1 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 rounded-lg text-[10px] font-bold"
              title="Previous Step"
            >
              Prev
            </button>

            <button
              onClick={() => {
                setCurrentStepIndex((prev) => (prev < TIMELINE_STEPS.length - 1 ? prev + 1 : prev));
                setIsAutoSimulating(false);
              }}
              disabled={currentStepIndex === TIMELINE_STEPS.length - 1}
              className="cursor-pointer px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 rounded-lg text-[10px] font-bold flex items-center gap-1 text-zinc-950"
            >
              <span>Next Stage</span>
              <FastForward className="w-3 h-3" />
            </button>

            <button
              onClick={() => {
                setCurrentStepIndex(0);
                setIsAutoSimulating(true);
              }}
              className="cursor-pointer p-1 text-zinc-400 hover:text-white"
              title="Reset Flow"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Status & Map Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT 7 COLS: Live Visual Map & Delivery Partner Card */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Mock Map Area */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl space-y-4 p-5 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                  <span>FairByte Live Telemetry Route</span>
                </h3>
              </div>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                GPS ACTIVE
              </span>
            </div>

            {/* Canvas Map */}
            <div className="rounded-2xl overflow-hidden border border-zinc-800/80">
              <canvas
                id="tracking-map-canvas"
                width={560}
                height={230}
                className="w-full bg-zinc-950 block"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-400 font-sans pt-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>To: {order.address.label}</span>
              </div>
              <span className="font-mono text-emerald-400 font-bold">
                {etaMinutes === 0 ? "Delivered 🎉" : `ETA: ~${etaMinutes} mins`}
              </span>
            </div>
          </div>

          {/* Delivery Partner Card */}
          <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                Delivery Partner
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded-xl">
                <span>★ {order.deliveryPartner.rating}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={order.deliveryPartner.photo}
                  alt={order.deliveryPartner.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-zinc-200 shadow-sm"
                />
                <div>
                  <h4 className="font-extrabold text-base text-zinc-950">
                    {order.deliveryPartner.name}
                  </h4>
                  <p className="text-xs text-zinc-500 font-medium mt-0.5">
                    {order.deliveryPartner.vehicle} ({order.deliveryPartner.vehicleNumber})
                  </p>
                  <p className="text-xs font-extrabold text-emerald-700 mt-1">
                    {etaMinutes === 0 ? "Arrived at your location" : `Arriving in ${etaMinutes} min`}
                  </p>
                </div>
              </div>

              <a
                href={`tel:${order.deliveryPartner.phone}`}
                className="cursor-pointer bg-zinc-950 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all self-stretch sm:self-auto shadow-md"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call {order.deliveryPartner.name}</span>
              </a>
            </div>
          </div>

        </div>

        {/* RIGHT 5 COLS: Dynamic 6-Step Timeline & Bill Accordion */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Order Progress Timeline */}
          <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">
                  Order #{order.id}
                </span>
                <h3 className="font-extrabold text-base text-zinc-950 tracking-tight">
                  {order.restaurantName}
                </h3>
              </div>

              <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>{order.estimatedDeliveryMin}</span>
              </div>
            </div>

            {/* Step Indicators */}
            <div className="space-y-4">
              {TIMELINE_STEPS.map((step, idx) => {
                const isPassed = currentStepIndex > idx;
                const isCurrent = currentStepIndex === idx;
                const isPending = currentStepIndex < idx;

                return (
                  <div key={step.status} className="flex gap-3 items-start relative">
                    
                    {/* Line between steps */}
                    {idx < TIMELINE_STEPS.length - 1 && (
                      <div
                        className={`absolute left-3.5 top-8 bottom-0 w-0.5 -translate-x-1/2 ${
                          isPassed ? "bg-emerald-500" : "bg-zinc-200"
                        }`}
                      />
                    )}

                    {/* Step Icon / Dot */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 z-10 transition-all ${
                        isPassed
                          ? "bg-emerald-500 text-white shadow-xs"
                          : isCurrent
                          ? "bg-emerald-600 text-white ring-4 ring-emerald-100 scale-110 shadow-md"
                          : "bg-zinc-100 text-zinc-400 border border-zinc-300"
                      }`}
                    >
                      {isPassed ? "✓" : isCurrent ? "●" : "○"}
                    </div>

                    {/* Step Text */}
                    <div className="min-w-0 flex-grow pt-0.5">
                      <h4
                        className={`text-xs font-bold ${
                          isCurrent
                            ? "text-emerald-800 font-extrabold text-sm"
                            : isPassed
                            ? "text-zinc-900"
                            : "text-zinc-400"
                        }`}
                      >
                        {step.label}
                      </h4>
                      <p className="text-[11px] text-zinc-500 font-normal mt-0.5 leading-snug">
                        {step.description}
                      </p>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

          {/* Transparent Order Summary Accordion */}
          <div className="bg-white border border-zinc-200/80 rounded-3xl p-5 shadow-xs space-y-3">
            <button
              onClick={() => setShowOrderSummary(!showOrderSummary)}
              className="cursor-pointer w-full flex items-center justify-between text-xs font-bold text-zinc-900"
            >
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-emerald-600" />
                <span>View Ordered Items ({order.items.length})</span>
              </div>
              {showOrderSummary ? (
                <ChevronUp className="w-4 h-4 text-zinc-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              )}
            </button>

            {showOrderSummary && (
              <div className="pt-3 border-t border-zinc-100 space-y-2 text-xs divide-y divide-zinc-50 animate-in fade-in duration-200">
                {order.items.map(({ item, quantity }) => (
                  <div key={item.id} className="pt-2 flex justify-between items-center text-zinc-700">
                    <span className="truncate pr-2">
                      {quantity}x {item.title}
                    </span>
                    <span className="font-mono font-bold text-zinc-900">
                      ₹{item.price * quantity}
                    </span>
                  </div>
                ))}

                <div className="pt-3 space-y-1.5 text-zinc-500">
                  <div className="flex justify-between items-center">
                    <span>Food Subtotal</span>
                    <span className="font-mono text-zinc-800">₹{order.billing.subtotal}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Delivery Fee</span>
                    <span className="font-mono text-zinc-800">₹{order.billing.deliveryFee}</span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-700 font-bold">
                    <span>Platform Fee</span>
                    <span>₹0 (FREE)</span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-950 font-black text-sm pt-2 border-t border-zinc-200">
                    <span>Total Paid</span>
                    <span className="text-emerald-700 font-sans">₹{order.billing.grandTotal}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
