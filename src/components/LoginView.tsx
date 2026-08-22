import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, ArrowRight, ShieldCheck, Lock, Sparkles } from "lucide-react";

interface LoginViewProps {
  onLoginSuccess: (phoneNumber: string) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit Indian phone number");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsOtpStep(true);
    }, 800);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Shift to next element
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 4) {
      setError("Please complete the 4-digit OTP");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(`+91 ${phone.substring(0, 5)} ${phone.substring(5)}`);
    }, 1000);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-3xl -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white border border-gray-100/80 p-8 rounded-3xl shadow-xl shadow-zinc-200/50"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20 text-amber-600 mb-4 shadow-inner">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-950 font-sans text-center">
            Authenticating Delivery Access
          </h2>
          <p className="text-[13px] text-zinc-500 text-center mt-1 font-medium">
            Login with OTP to order, track logistics & manage payments
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!isOtpStep ? (
            <motion.form
              key="phone-step"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
              onSubmit={handlePhoneSubmit}
              className="space-y-5"
            >
              <div>
                <label className="block text-xs font-bold text-zinc-700 tracking-wider uppercase mb-2">
                  Enter Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-zinc-400 font-mono">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => {
                      if (/^\d*$/.test(e.target.value)) setPhone(e.target.value);
                    }}
                    placeholder="98765 43210"
                    disabled={loading}
                    className="w-full bg-zinc-50 leading-none pl-14 pr-11 py-3.5 border border-zinc-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium text-zinc-800 tracking-wide font-mono transition-all duration-200"
                    required
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400">
                    <Phone className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-600 font-medium bg-red-50 p-2.5 rounded-lg border border-red-100">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-zinc-900 border border-zinc-950 hover:bg-zinc-800 text-white font-semibold py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md shadow-zinc-900/15 disabled:opacity-75 cursor-pointer active:scale-[0.98]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="otp-step"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleVerifyOtp}
              className="space-y-6"
            >
              <div className="text-center bg-zinc-50 border border-zinc-100/80 p-3.5 rounded-2xl">
                <p className="text-[11px] text-zinc-400 font-semibold tracking-wider uppercase mb-1">
                  Sent OTP to
                </p>
                <p className="text-sm font-bold text-zinc-800 font-mono">
                  +91 {phone.substring(0, 5)} {phone.substring(5)}
                </p>
                <button
                  type="button"
                  onClick={() => setIsOtpStep(false)}
                  className="text-xs text-amber-600 hover:text-amber-700 font-semibold mt-1 hover:underline"
                >
                  Change Number
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 tracking-wider uppercase mb-3 text-center">
                  Verification Code (OTP)
                </label>
                <div className="flex justify-center gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-13 h-13 text-center text-xl font-bold bg-zinc-50 border border-zinc-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono text-zinc-800 transition-all duration-200"
                      disabled={loading}
                      required
                    />
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-600 font-medium bg-red-50 p-2.5 rounded-lg border border-red-100 text-center">
                  {error}
                </p>
              )}

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-zinc-900 border border-zinc-950 hover:bg-zinc-800 text-white font-semibold py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md shadow-zinc-900/15 disabled:opacity-75 cursor-pointer active:scale-[0.98]"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Verify & Enter Shop</span>
                    </>
                  )}
                </button>
                <div className="text-center text-xs text-zinc-400">
                  Enter any 4 digits to sign in. Code decays in 10m.
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
