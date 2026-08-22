import React from "react";
import { Order, Delivery } from "../types";
import { Clock, Truck, User, Phone, CheckCircle, Smartphone } from "lucide-react";

interface OrderProgressProps {
  order: Order;
  delivery: Delivery | null;
}

export default function OrderProgress({ order, delivery }: OrderProgressProps) {
  // Determine timeline stage
  const getStageCode = () => {
    switch (order.status) {
      case "AUTHORIZED": return 1;
      case "CONFIRMED": return 2;
      case "DELIVERING": return 3;
      case "ARRIVED": return 4;
      case "COMPLETED": return 5;
      default: return 1;
    }
  };

  const currentStage = getStageCode();

  return (
    <div className="bg-white border border-gray-150/80 rounded-3xl p-6 shadow-sm space-y-6">
      
      {/* Visual Status Indicator Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-zinc-100">
        <div>
          <span className="text-[10px] font-extrabold text-amber-700 bg-amber-500/10 px-3 py-1 rounded-full uppercase tracking-wider">
            Order Dispatched & Live
          </span>
          <h3 className="font-extrabold text-xl text-zinc-950 tracking-tight mt-1.5 flex items-center gap-2">
            <span>#{order.id} Track Details</span>
          </h3>
        </div>

        {delivery && (
          <div className="flex items-center gap-2.5 bg-neutral-900 text-white px-4 py-2.5 rounded-2xl">
            <Clock className="w-4 h-4 text-emerald-400" />
            <div className="text-left font-mono">
              <span className="text-[9px] uppercase text-neutral-400 block tracking-wider leading-none">Uber Direct ETA</span>
              <span className="text-xs font-bold">{delivery.etaMinutes === 0 ? "Arrived" : `${delivery.etaMinutes} mins`}</span>
            </div>
          </div>
        )}
      </div>

      {/* 5-Step Customer Progress Bar (Timeline) */}
      <div className="relative">
        <div className="absolute top-1/2 left-4 right-4 h-1 bg-zinc-100 -translate-y-1/2 -z-10" />
        <div
          className="absolute top-1/2 left-4 h-1 bg-emerald-500 -translate-y-1/2 -z-10 transition-all duration-1000"
          style={{ width: `${((currentStage - 1) / 4) * 100}%` }}
        />
        
        <div className="flex justify-between items-center text-center">
          {[
            { label: "Auth Hold", step: 1 },
            { label: "Kitchen Confirmed", step: 2 },
            { label: "Delivering", step: 3 },
            { label: "Arrived", step: 4 },
            { label: "Completed", step: 5 }
          ].map((item) => {
            const isFinished = currentStage >= item.step;
            const isActive = currentStage === item.step;
            return (
              <div key={item.step} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all ${
                    isFinished
                      ? "bg-emerald-500 border-emerald-600 text-white shadow-sm shadow-emerald-500/20"
                      : "bg-white border-zinc-200 text-zinc-400"
                  } ${isActive ? "ring-4 ring-emerald-100 scale-105" : ""}`}
                >
                  {isFinished ? "✓" : item.step}
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wide mt-2 block max-w-[70px] leading-tight ${
                    isFinished ? "text-emerald-700" : "text-zinc-400"
                  } ${isActive ? "font-extrabold text-zinc-900" : ""}`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Driver Courier Assignment layout Card */}
      {delivery ? (
        <div className="bg-zinc-50 border border-zinc-100 p-4.5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-zinc-950 rounded-xl flex items-center justify-center text-white shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-widest">Courier Partner</span>
              <p className="font-extrabold text-sm text-zinc-900">{delivery.driverName}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5 uppercase tracking-wider font-mono">Job ID: {delivery.uberJobId}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <a
              href={`tel:${delivery.driverPhone}`}
              className="bg-white hover:bg-zinc-100 border border-zinc-250 p-2.5 rounded-xl text-zinc-700 transition-colors flex items-center gap-1.5 text-xs font-bold"
            >
              <Phone className="w-4 h-4" />
              <span>Call Courier</span>
            </a>
            
            <a
              href={delivery.trackingUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-zinc-950 text-white font-bold p-2.5 rounded-xl text-xs flex items-center gap-1.5 hover:bg-zinc-800 transition-colors"
            >
              <Smartphone className="w-4 h-4" />
              <span>Uber Direct Live GPS</span>
            </a>
          </div>
        </div>
      ) : (
        <div className="bg-zinc-50 border border-dashed border-zinc-200 p-6 rounded-2xl text-center space-y-2">
          <Truck className="w-6 h-6 text-zinc-400 mx-auto animate-pulse" />
          <p className="text-xs font-semibold text-zinc-500">
            Waiting for Vendor Acceptance and Courier assignment...
          </p>
        </div>
      )}

      {/* Quick delivery notice */}
      <div className="text-[11px] text-zinc-400 text-center leading-normal">
        Uber Direct is fully integrated using OAuth 2.0. Delivery path coordinates are computed in real time.
      </div>

    </div>
  );
}
