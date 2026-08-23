import React, { useState } from "react";
import { X, MapPin, Building, Compass, Plus, Check, AlertCircle, RefreshCw, CheckCircle2 } from "lucide-react";
import { Address } from "../types";
import { getCurrentDeviceLocation, DetectedLocationResult } from "../lib/location";

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
  const [detectSuccess, setDetectSuccess] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDetectGps = async () => {
    setIsDetecting(true);
    setLocationError(null);
    setDetectSuccess(false);

    try {
      const result: DetectedLocationResult = await getCurrentDeviceLocation();

      if (result.success) {
        setGpsCoords({ lat: result.lat, lng: result.lng });
        setAreaLocale(result.formattedAddress || `${result.area}, ${result.city}`);
        if (result.street && !flatBuilding) {
          setFlatBuilding(result.street);
        }
        setDetectSuccess(true);
      } else {
        setLocationError(result.error || "Could not retrieve your location. Please enter it manually.");
      }
    } catch (err: any) {
      setLocationError("Location detection encountered an error. Please enter your address manually.");
    } finally {
      setIsDetecting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!areaLocale.trim()) {
      setLocationError("Please enter a valid delivery address.");
      return;
    }

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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-[2rem] max-w-md w-full p-6 sm:p-7 space-y-5 border border-[#eae4d8] shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#f0eae0] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#2d4023] flex items-center justify-center text-white shadow-sm">
              <MapPin className="w-4 h-4 text-[#e2edd8]" />
            </div>
            <h3 className="font-black text-[#1c271b] text-base font-sans">
              Add Delivery Address
            </h3>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer p-1.5 rounded-full text-[#798573] hover:text-[#1c271b]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GPS Quick Detect Button */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleDetectGps}
            disabled={isDetecting}
            className={`cursor-pointer w-full font-black py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-2xs ${
              detectSuccess
                ? "bg-[#edf4e8] text-[#24371d] border border-[#d2e2ca]"
                : "bg-[#2d4023] hover:bg-[#203018] text-white shadow-md shadow-[#2d4023]/25 active:scale-98"
            }`}
          >
            {isDetecting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Getting your location...</span>
              </>
            ) : detectSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#2d4023]" />
                <span>📍 Current Location Detected (Tap to re-detect)</span>
              </>
            ) : (
              <>
                <Compass className="w-4 h-4 text-[#e2edd8]" />
                <span>📍 Use Current Location</span>
              </>
            )}
          </button>

          {locationError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-start gap-2 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold">Location Detection Notice</p>
                <p className="text-[11px] text-red-600 leading-relaxed">{locationError}</p>
              </div>
            </div>
          )}
        </div>

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
                  className={`cursor-pointer px-4 py-2 rounded-xl font-bold border transition-all ${
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
                className="w-full mt-2 bg-[#faf7f2] border border-[#ded5c5] rounded-xl p-2.5 font-medium text-[#1c271b]"
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
              placeholder="e.g. Flat 302, Green Glen Heights / House #12"
              className="w-full bg-[#faf7f2] border border-[#ded5c5] rounded-xl p-2.5 font-medium text-[#1c271b] focus:outline-none focus:border-[#365029] focus:bg-white"
            />
          </div>

          {/* Area / Locality */}
          <div className="space-y-1">
            <label className="font-bold text-[#495744] block">Street, Area &amp; City (Auto-detected or custom)</label>
            <textarea
              rows={2}
              required
              value={areaLocale}
              onChange={(e) => setAreaLocale(e.target.value)}
              placeholder="e.g. 100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038"
              className="w-full bg-[#faf7f2] border border-[#ded5c5] rounded-xl p-2.5 font-medium text-[#1c271b] focus:outline-none focus:border-[#365029] focus:bg-white leading-relaxed"
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
              className="w-full bg-[#faf7f2] border border-[#ded5c5] rounded-xl p-2.5 font-medium text-[#1c271b] focus:outline-none focus:border-[#365029] focus:bg-white"
            />
          </div>

          {/* GPS Coordinates Preview */}
          <div className="bg-[#faf7f2] border border-[#eae4d8] rounded-xl p-2.5 flex items-center justify-between text-[11px] text-[#63705f] font-mono">
            <span>GPS Pin Coordinates:</span>
            <span className="font-bold text-[#2d4023]">{gpsCoords.lat.toFixed(4)}, {gpsCoords.lng.toFixed(4)}</span>
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
