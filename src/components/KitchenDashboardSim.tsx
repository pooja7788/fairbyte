import React, { useState, useEffect } from "react";
import { Radio, AlertTriangle, ArrowRight, CheckCircle2, XCircle, Clock, Truck, ShieldCheck, CreditCard } from "lucide-react";
import { Order, Delivery } from "../types";

interface KitchenDashboardSimProps {
  activeOrder: Order | null;
  activeDelivery: Delivery | null;
  onKitchenAccept: (orderId: string) => void;
  onKitchenReject: (orderId: string) => void;
  countdownSeconds: number;
}

export default function KitchenDashboardSim({
  activeOrder,
  activeDelivery,
  onKitchenAccept,
  onKitchenReject,
  countdownSeconds
}: KitchenDashboardSimProps) {
  const [logs, setLogs] = useState<string[]>([]);

  // Push architectural backend trace logs
  useEffect(() => {
    if (!activeOrder) {
      setLogs(["[SYSTEM] Kitchen Push Node listening on WebSockets channels..."]);
      return;
    }

    if (activeOrder.status === "AUTHORIZED") {
      setLogs([
        `[WEBSOCKET] Received event: 'kitchen_order_received' for ID: ${activeOrder.id}`,
        `[RAZORPAY HOLD] Verified 2-step Auth hold on ${activeOrder.paymentIntentId} (Amount: ₹${activeOrder.billing.grandTotal})`,
        `[SYSTEM] Spawning 60s auto-void timer handler thread on backend.`,
        `[KITCHEN WARNING] Waiting for vendor Accept/Reject action in ${countdownSeconds}s...`
      ]);
    }
  }, [activeOrder]);

  // Append updates based on status transitions
  useEffect(() => {
    if (!activeOrder) return;

    if (activeOrder.status === "CONFIRMED") {
      setLogs(prev => [
        ...prev,
        `[RAZORPAY SUCCESS] Triggered Capture API on ${activeOrder.paymentIntentId}. Funds secured!`,
        `[UBER DIRECT CONNECT] Creating dispatch via OAuth 2.0 (eats.deliveries scope)`,
        `[UBER DIRECT API] Dispatched job successful. Carrier assigned. Lat: 12.9716, Lng: 77.5946`
      ]);
    } else if (activeOrder.status === "DELIVERING") {
      setLogs(prev => [
        ...prev,
        `[UBER TELEMETRY] Dispatch rider started courier loop. State: 'PICKED_UP'`
      ]);
    } else if (activeOrder.status === "ARRIVED") {
      setLogs(prev => [
        ...prev,
        `[UBER TELEMETRY] Driver arrived at GPS customer geofence.`
      ]);
    } else if (activeOrder.status === "COMPLETED") {
      setLogs(prev => [
        ...prev,
        `[RAZORPAY ARCHIVE] Order archived successfully. Delivery job complete.`
      ]);
    } else if (activeOrder.status === "CANCELLED_REJECTED") {
      setLogs(prev => [
        ...prev,
        `[RAZORPAY VOID] RELEASED balance hold on Auth ID: ${activeOrder.paymentIntentId}`,
        `[SYSTEM] State transaction cancelled. Customer funds unblocked instantly.`
      ]);
    } else if (activeOrder.status === "CANCELLED_TIMED_OUT") {
      setLogs(prev => [
        ...prev,
        `[TIMER EXPIRED] Kitchen 60s countdown elapsed!`,
        `[RAZORPAY VOID] REJECTED order. Released holding balance on Auth ID: ${activeOrder.paymentIntentId}`,
        `[SYSTEM] Order cancelled automatically. Refund finalized.`
      ]);
    }
  }, [activeOrder?.status]);

  if (!activeOrder) {
    return (
      <div className="bg-[#18181b] text-neutral-300 p-6 rounded-2xl border border-zinc-800 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-600 animate-pulse" />
          <h3 className="font-bold font-mono tracking-wider text-xs text-white uppercase">
            Active Kitchen Push Node & logs
          </h3>
        </div>
        <p className="text-[11px] text-zinc-500 font-sans leading-relaxed text-center py-6">
          No live transactions. Place an order on the checkout screen to trigger real-time Socket.io transmissions.
        </p>
      </div>
    );
  }

  const isPendingDecision = activeOrder.status === "AUTHORIZED";

  return (
    <div className="bg-[#18181b] text-neutral-300 p-6 rounded-2xl border border-zinc-800 space-y-4 shadow-xl transition-all">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isPendingDecision ? "bg-amber-500 animate-ping" : "bg-emerald-500"}`} />
          <h3 className="font-bold font-mono tracking-wider text-xs text-white uppercase flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5" />
            <span>Kitchen Push Terminal - ID: {activeOrder.id}</span>
          </h3>
        </div>

        {isPendingDecision && (
          <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-[10px] font-mono">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>{countdownSeconds}S TIMEOUT DECAY</span>
          </div>
        )}
      </div>

      {/* Decision Card (Accept / Reject) */}
      {isPendingDecision && (
        <div className="bg-zinc-900 border border-amber-500/20 p-5 rounded-xl space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-white text-xs font-extrabold">NEW TRANSACTION PUSHED BY WEBSOCKET</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Funds are pre-authorized on customer card. Decide order state.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => onKitchenReject(activeOrder.id)}
              className="cursor-pointer bg-red-650 border border-red-700 hover:bg-red-750 text-white text-xs font-bold py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
            >
              <XCircle className="w-4 h-4" />
              <span>REJECT (VOID FUNDS)</span>
            </button>

            <button
              onClick={() => onKitchenAccept(activeOrder.id)}
              className="cursor-pointer bg-emerald-600 border border-emerald-700 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>ACCEPT (CAPTURE & DISPATCH)</span>
            </button>
          </div>
        </div>
      )}

      {/* Terminal logs showing OAuth handshake and captures */}
      <div className="space-y-1.5">
        <h4 className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Backend Process Logs</h4>
        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 font-mono text-[10px] space-y-1 bg-opacity-70 max-h-[140px] overflow-y-auto">
          {logs.map((log, idx) => {
            let textColor = "text-zinc-400";
            if (log.includes("[WEBSOCKET]")) textColor = "text-pink-400";
            else if (log.includes("[RAZORPAY")) textColor = "text-yellow-400";
            else if (log.includes("[UBER")) textColor = "text-emerald-400";
            else if (log.includes("[TIMEOUT") || log.includes("[TIMER")) textColor = "text-rose-450";
            
            return (
              <div key={idx} className={`${textColor} leading-normal`}>
                &gt; {log}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
