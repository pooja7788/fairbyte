import React, { useState } from "react";
import { X, MapPin, Building, Compass, Plus, Check } from "lucide-react";
import { Address } from "../types";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAddress: (address: { label: string; text: string; flatBuilding?: string; landmark?: string; lat: number; lng: number }) => void;
}

export default function AddressModal({
  isOpen,
  onClose,
  onSaveAddress
}: AddressModalProps) {
  const [label, setLabel] = useState<"Home" | "Work" | "Other">("Home");
  const [customLabel, setCustomLabel] = useState("");
  const [flatBuilding, setFlatBuilding] = useState("");
  const [areaLocale, setAreaLocale] = useState("Indiranagar, Bengaluru - 560038");
  const [landmark, setLandmark] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalLabel = label === "Other" && customLabel.trim() ? customLabel.trim() : label;
    const fullText = `${flatBuilding ? flatBuilding + ", " : ""}${areaLocale}${landmark ? " (Near " + landmark + ")" : ""}`;

    onSaveAddress({
      label: finalLabel,
      text: fullText,
      flatBuilding,
      landmark,
      lat: 12.9716,
      lng: 77.5946
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 border border-zinc-200 shadow-2xl animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <h3 className="font-black text-zinc-950 text-base font-sans">
              Add Bengaluru Delivery Address
            </h3>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer p-1.5 rounded-full text-zinc-400 hover:text-zinc-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Label Type */}
          <div className="space-y-1.5">
            <label className="font-bold text-zinc-700 block">Address Label</label>
            <div className="flex gap-2">
              {["Home", "Work", "Other"].map((l) => (
                <button
                  type="button"
                  key={l}
                  onClick={() => setLabel(l as any)}
                  className={`cursor-pointer px-3.5 py-1.5 rounded-xl font-bold border transition-all ${
                    label === l
                      ? "bg-zinc-950 text-white border-zinc-950 shadow-xs"
                      : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            {label === "Other" && (
              <input
                type="text"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                placeholder="e.g. Studio, Gym, Friend's Place"
                className="w-full mt-2 bg-zinc-50 border border-zinc-200 rounded-xl p-2 font-medium"
              />
            )}
          </div>

          {/* Flat / House No */}
          <div className="space-y-1">
            <label className="font-bold text-zinc-700 block">Flat / House No / Building</label>
            <input
              type="text"
              required
              value={flatBuilding}
              onChange={(e) => setFlatBuilding(e.target.value)}
              placeholder="e.g. Flat 302, Green Glen Heights"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Area / Locality */}
          <div className="space-y-1">
            <label className="font-bold text-zinc-700 block">Area / Locality in Bengaluru</label>
            <input
              type="text"
              required
              value={areaLocale}
              onChange={(e) => setAreaLocale(e.target.value)}
              placeholder="e.g. 100 Feet Road, Indiranagar, Bengaluru"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Landmark */}
          <div className="space-y-1">
            <label className="font-bold text-zinc-700 block">Nearby Landmark (Optional)</label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g. Near Metro Station / Behind Starbucks"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="cursor-pointer w-full bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-black py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all pt-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Save Delivery Address</span>
          </button>
        </form>

      </div>
    </div>
  );
}
