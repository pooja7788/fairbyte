import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Lock, 
  Mail, 
  Phone, 
  User, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  KeyRound
} from "lucide-react";
import { UserProfile } from "../types";
import { saveUserEmail } from "../lib/supabase";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess
}: AuthModalProps) {
  const [authMode, setAuthMode] = useState<"login" | "signup" | "otp" | "forgot">("login");
  
  // Form States
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  
  // OTP State
  const [otpValues, setOtpValues] = useState(["4", "2", "8", "9"]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      setError("Please enter your email or mobile number");
      return;
    }
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const resolvedEmail = emailOrPhone.includes("@") ? emailOrPhone : "poojabhusani20@gmail.com";
      // Persist email to Supabase user_emails table (fire-and-forget)
      saveUserEmail(resolvedEmail, "login");
      onLoginSuccess({
        id: "usr-" + Date.now(),
        name: emailOrPhone.includes("@") ? emailOrPhone.split("@")[0] : "Pooja Bhusani",
        email: resolvedEmail,
        phone: !emailOrPhone.includes("@") ? emailOrPhone : "+91 98765 43210",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
        isLoggedIn: true
      });
      onClose();
    }, 600);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !emailOrPhone.trim()) {
      setError("Please fill all required fields");
      return;
    }
    if (!acceptedTerms) {
      setError("Please accept the terms & conditions");
      return;
    }
    setError("");
    setAuthMode("otp");
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const resolvedEmail = emailOrPhone.includes("@") ? emailOrPhone : "poojabhusani20@gmail.com";
      // Persist signup email to Supabase user_emails table (fire-and-forget)
      saveUserEmail(resolvedEmail, "signup");
      onLoginSuccess({
        id: "usr-" + Date.now(),
        name: fullName.trim() || "Pooja Bhusani",
        email: resolvedEmail,
        phone: !emailOrPhone.includes("@") ? emailOrPhone : "+91 98765 43210",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
        isLoggedIn: true
      });
      onClose();
    }, 800);
  };

  const handleContinueAsGuest = () => {
    onLoginSuccess({
      id: "usr-guest",
      name: "Guest Explorer",
      email: "guest@fairbyte.local",
      phone: "+91 90000 00000",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
      isLoggedIn: true
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 border border-zinc-200 shadow-2xl relative overflow-hidden"
      >
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-zinc-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-md">
            F
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-950 font-sans tracking-tight">
              {authMode === "login" && "Welcome back to RestoX"}
              {authMode === "signup" && "Create your RestoX Account"}
              {authMode === "otp" && "Verify Mobile OTP"}
              {authMode === "forgot" && "Reset your Password"}
            </h2>
            <p className="text-xs text-zinc-500 font-medium">
              {authMode === "login" && "Log in to track orders & manage transparent deliveries"}
              {authMode === "signup" && "Enjoy verified restaurant menu prices with zero markups"}
              {authMode === "otp" && "Enter the 4-digit code sent to your number"}
              {authMode === "forgot" && "We'll send you an instant verification code"}
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-bold">
            {error}
          </div>
        )}

        {/* 1. LOGIN FORM */}
        {authMode === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Email or Mobile Number</label>
              <div className="relative">
                <input
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="poojabhusani20@gmail.com or 9876543210"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-zinc-700">Password</label>
                <button
                  type="button"
                  onClick={() => setAuthMode("forgot")}
                  className="cursor-pointer text-[11px] font-bold text-emerald-700 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-9 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer w-full bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
            >
              {isLoading ? "Signing in..." : "Login to RestoX"}
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-zinc-200"></div>
              <span className="flex-shrink mx-3 text-[11px] text-zinc-400 font-bold uppercase">or</span>
              <div className="flex-grow border-t border-zinc-200"></div>
            </div>

            <button
              type="button"
              onClick={handleContinueAsGuest}
              className="cursor-pointer w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold py-2.5 rounded-xl text-xs transition-colors"
            >
              Continue as Guest
            </button>

            <p className="text-center text-xs text-zinc-500 pt-2">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setAuthMode("signup");
                }}
                className="cursor-pointer font-bold text-emerald-700 hover:underline"
              >
                Sign Up
              </button>
            </p>
          </form>
        )}

        {/* 2. SIGN UP FORM */}
        {authMode === "signup" && (
          <form onSubmit={handleSignupSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Pooja Bhusani"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Email or Mobile Number</label>
              <div className="relative">
                <input
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="poojabhusani20@gmail.com or 9876543210"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create password"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 border-zinc-300"
              />
              <label htmlFor="terms" className="text-[11px] text-zinc-600">
                I agree to RestoX Transparent Pricing & Terms
              </label>
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
            >
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-center text-xs text-zinc-500 pt-1">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setAuthMode("login");
                }}
                className="cursor-pointer font-bold text-emerald-700 hover:underline"
              >
                Login
              </button>
            </p>
          </form>
        )}

        {/* 3. OTP VERIFICATION FORM */}
        {authMode === "otp" && (
          <form onSubmit={handleOtpVerify} className="space-y-5 text-center">
            <div className="flex justify-center gap-3">
              {otpValues.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const newOtp = [...otpValues];
                    newOtp[idx] = e.target.value;
                    setOtpValues(newOtp);
                  }}
                  className="w-12 h-14 bg-zinc-50 border-2 border-emerald-500 rounded-2xl text-center font-mono font-black text-xl text-zinc-950 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              ))}
            </div>

            <p className="text-xs text-zinc-400">
              Demo Code: <span className="font-mono font-bold text-zinc-700">4289</span> • Auto-filled for hackathon
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer w-full bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-black py-3 rounded-xl text-xs shadow-md transition-all active:scale-98"
            >
              {isLoading ? "Verifying..." : "Verify & Complete"}
            </button>
          </form>
        )}

        {/* 4. FORGOT PASSWORD */}
        {authMode === "forgot" && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Enter Registered Email/Mobile</label>
              <input
                type="text"
                placeholder="poojabhusani20@gmail.com"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <button
              onClick={() => setAuthMode("otp")}
              className="cursor-pointer w-full bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-black py-3 rounded-xl text-xs shadow-md"
            >
              Send Reset OTP
            </button>

            <button
              onClick={() => setAuthMode("login")}
              className="cursor-pointer w-full text-zinc-500 hover:text-zinc-800 text-xs font-bold"
            >
              Back to Login
            </button>
          </div>
        )}

      </motion.div>
    </div>
  );
}
