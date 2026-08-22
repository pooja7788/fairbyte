import React from "react";
import { Database, Table, Key, ShieldCheck } from "lucide-react";

export default function DatabaseSchemaOverlay() {
  return (
    <div className="bg-[#18181b] text-gray-200 p-6 rounded-2xl border border-zinc-800 font-mono text-xs shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-emerald-500" />
          <span className="text-sm font-bold tracking-wider text-white">RECONCILIATION DATABASE SCHEMA</span>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[10px]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>ACID Compliant</span>
        </div>
      </div>

      <p className="text-zinc-400 font-sans leading-relaxed text-xs">
        Primary relational schema designed for <strong>PostgreSQL</strong> or <strong>Spanner</strong>. Tracks high-performance food orders, Razorpay transactional payment logs, and Uber Direct delivery handshakes.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* USERS TABLE */}
        <div className="bg-zinc-90030 p-4 rounded-xl border border-zinc-800 space-y-3">
          <div className="flex items-center gap-1.5 border-b border-zinc-800 pb-2">
            <Table className="w-4 h-4 text-sky-400" />
            <span className="font-bold text-white text-[13px]">users</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-sky-400 flex items-center gap-1"><Key className="w-3 h-3" /> id</span>
              <span className="text-zinc-500">SERIAL PRIMARY KEY</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-300">phone</span>
              <span className="text-zinc-500">VARCHAR(15) UNIQUE</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-300">name</span>
              <span className="text-zinc-500">VARCHAR(100) NULL</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-300 font-medium">created_at</span>
              <span className="text-zinc-500">TIMESTAMP WITH TZ</span>
            </div>
          </div>
          <div className="text-[10px] text-zinc-500 pt-1 border-t border-zinc-800/50">
            INDEX on phone for ultra-fast OTP verification.
          </div>
        </div>

        {/* ORDERS TABLE */}
        <div className="bg-zinc-90030 p-4 rounded-xl border border-zinc-800 space-y-3">
          <div className="flex items-center gap-1.5 border-b border-zinc-800 pb-2">
            <Table className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-white text-[13px]">orders</span>
          </div>
          <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-amber-400 flex items-center gap-1"><Key className="w-3 h-3" /> id</span>
              <span className="text-zinc-500">VARCHAR(20) PK</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-300">user_phone</span>
              <span className="text-zinc-500">FK REFERENCES users</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-300">subtotal</span>
              <span className="text-zinc-500">DECIMAL(10,2)</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-300">cgst</span>
              <span className="text-zinc-500 font-mono">DECIMAL(6,2) [2.5%]</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-300">sgst</span>
              <span className="text-zinc-500 font-mono">DECIMAL(6,2) [2.5%]</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-300 font-semibold">delivery_fee</span>
              <span className="text-zinc-500">DECIMAL(8,2)</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-300 font-medium text-emerald-400">grand_total</span>
              <span className="text-zinc-500">DECIMAL(10,2)</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-300">payment_intent_id</span>
              <span className="text-zinc-500">VARCHAR(60) INDEX</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-300">payment_status</span>
              <span className="text-zinc-500 font-mono">ENUM(AUTH,CAPT,VOID)</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-300 font-bold">order_status</span>
              <span className="text-zinc-500">VARCHAR(30)</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-300">items_payload</span>
              <span className="text-zinc-500">JSONB NOT NULL</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-300">created_at</span>
              <span className="text-zinc-500">TIMESTAMP WITH TZ</span>
            </div>
          </div>
          <div className="text-[10px] text-zinc-500 pt-1 border-t border-zinc-800/50">
            JSONB stores ordered item structures securely.
          </div>
        </div>

        {/* DELIVERIES TABLE */}
        <div className="bg-zinc-90030 p-4 rounded-xl border border-zinc-800 space-y-3">
          <div className="flex items-center gap-1.5 border-b border-zinc-800 pb-2">
            <Table className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white text-[13px]">deliveries</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-emerald-400 flex items-center gap-1"><Key className="w-3 h-3" /> order_id</span>
              <span className="text-zinc-500">FK REFERENCES orders PK</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-300">uber_job_id</span>
              <span className="text-zinc-500 font-semibold text-emerald-500">VARCHAR(50) UNIQUE</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-300">driver_name</span>
              <span className="text-zinc-500">VARCHAR(100)</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-300">driver_phone</span>
              <span className="text-zinc-500">VARCHAR(15)</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-300">driver_lat</span>
              <span className="text-zinc-500">DECIMAL(10,8)</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-300">driver_lng</span>
              <span className="text-zinc-500">DECIMAL(11,8)</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-300">delivery_status</span>
              <span className="text-zinc-500">VARCHAR(30)</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-300">tracking_url</span>
              <span className="text-zinc-500">TEXT</span>
            </div>
          </div>
          <div className="text-[10px] text-zinc-500 pt-1 border-t border-zinc-800/50">
            Stores Uber job details & live tracking handles.
          </div>
        </div>
      </div>
    </div>
  );
}
