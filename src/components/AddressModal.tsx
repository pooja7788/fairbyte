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
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number }>({ lat: 12.9716, lng: 77.5946 });
  const [isDetecting, setIsDetecting] = useState(false);

  if (!isOpen) return null;

  const handleDetectGps = () => {
    setIsDetecting(true);
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsDetecting(false);
          setGpsCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setAreaLocale(`Live GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)} (Bengaluru)`);
        },
        () => {
          setIsDetecting(false);
          setGpsCoords({ lat: 12.9716, lng: 77.5946 });
          setAreaLocale("Central Bengaluru (12.9716, 77.5946)");
        },
        { timeout: 4000 }
      );
    } else {
      setIsDetecting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalLabel = label === "Other" && customLabel.trim() ? customLabel.trim() : label;
    const fullText = `${flatBuilding ? flatBuilding + ", " : ""}${areaLocale}${landmark ? " (Near " + landmark + ")" : ""}`;

    onSaveAddress({
      label: finalLabel,
      text: fullText,
      flatBuilding,
      landmark,
      lat: gpsCoords.lat,
      lng: gpsCoords.lng
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] max-w-md w-full p-6 sm:p-7 space-y-5 border border-[#eae4d8] shadow-2xl animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#f0eae0] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#2d4023] flex items-center justify-center text-white">
              <MapPin className="w-4 h-4 text-[#e2edd8]" />
            </div>
            <h3 className="font-black text-[#1c271b] text-base font-sans">
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

        {/* GPS Quick Detect Button */}
        <button
          type="button"
          onClick={handleDetectGps}
          disabled={isDetecting}
          className="cursor-pointer w-full bg-[#fbf9f4] hover:bg-[#edf4e8] text-[#2d4023] border border-[#ded5c5] font-black py-2.5 px-3 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-2xs"
        >
          <Compass className={`w-4 h-4 text-[#365029] ${isDetecting ? "animate-spin" : ""}`} />
          <span>{isDetecting ? "Detecting GPS location..." : "📍 Auto-Detect Current GPS Location"}</span>
        </button>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Label Type */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#495744] block">Address Label</label>
            <div className="flex gap-2">
              {["Home", "Work", "Other"].map((l) => (
                <button
                  type="button"
                  key={l}
                  onClick={() => setLabel(l as any)}
                  className={`cursor-pointer px-4 py-2 rounded-full font-bold border transition-all ${
                    label === l
                      ? "bg-[#2d4023] text-white border-[#2d4023] shadow-xs"
                      : "bg-[#faf7f2] text-[#334230] border-[#ded5c5] hover:bg-[#f6f2e8]"
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
                className="w-full mt-2 bg-[#faf7f2] border border-[#ded5c5] rounded-xl p-2.5 font-medium"
              />
            )}
          </div>

          {/* Flat / House No */}
          <div className="space-y-1">
            <label className="font-bold text-[#495744] block">Flat / House No / Building</label>
            <input
              type="text"
              required
              value={flatBuilding}
              onChange={(e) => setFlatBuilding(e.target.value)}
              placeholder="e.g. Flat 302, Green Glen Heights"
              className="w-full bg-[#faf7f2] border border-[#ded5c5] rounded-xl p-2.5 font-medium focus:outline-none focus:ring-1 focus:ring-[#365029]"
            />
          </div>

          {/* Area / Locality */}
          <div className="space-y-1">
            <label className="font-bold text-[#495744] block">Area / Locality in Bengaluru</label>
            <input
              type="text"
              required
              value={areaLocale}
              onChange={(e) => setAreaLocale(e.target.value)}
              placeholder="e.g. 100 Feet Road, Indiranagar, Bengaluru"
              className="w-full bg-[#faf7f2] border border-[#ded5c5] rounded-xl p-2.5 font-medium focus:outline-none focus:ring-1 focus:ring-[#365029]"
            />
          </div>

          {/* Landmark */}
          <div className="space-y-1">
            <label className="font-bold text-[#495744] block">Nearby Landmark (Optional)</label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g. Near Metro Station / Behind Starbucks"
              className="w-full bg-[#faf7f2] border border-[#ded5c5] rounded-xl p-2.5 font-medium focus:outline-none focus:ring-1 focus:ring-[#365029]"
            />
          </div>

          <button
            type="submit"
            className="cursor-pointer w-full bg-[#2d4023] hover:bg-[#203018] text-white font-black py-3.5 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#2d4023]/25 active:scale-98 transition-all mt-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Save Delivery Address</span>
          </button>
        </form>

      </div>
    </div>
  );
}
