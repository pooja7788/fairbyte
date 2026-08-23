import React, { useState } from "react";
import { motion } from "motion/react";
import {
  X, Lock, Mail, User, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle, Loader2
} from "lucide-react";
import { UserProfile } from "../types";
import { signInUser, signUpUser } from "../lib/supabase";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  // Shared fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Signup-only fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  // UI state
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail(""); setPassword(""); setFullName(""); setPhone("");
    setConfirmPassword(""); setError(""); setSuccessMsg("");
    setShowPassword(false);
  };

  // ── LOGIN ──────────────────────────────────────────────────────────────────
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError("Please enter your email address."); return; }
    if (!password)     { setError("Please enter your password."); return; }
    setError(""); setIsLoading(true);

    const result = await signInUser({ email: email.trim(), password });
    setIsLoading(false);

    if (!result.success) {
      setError(result.error || "Login failed. Please check your credentials.");
      return;
    }

    onLoginSuccess({
      id:        result.userId!,
      name:      result.fullName || email.split("@")[0],
      email:     result.email!,
      phone:     result.phone || "",
      avatar:    `https://ui-avatars.com/api/?name=${encodeURIComponent(result.fullName || email)}&background=2d4023&color=fff&size=200`,
      isLoggedIn: true
    });
    onClose();
  };

  // ── SIGN UP ─────────────────────────────────────────────────────────────────
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) { setError("Please enter your full name."); return; }
    if (!email.trim())    { setError("Please enter your email address."); return; }
    if (!email.includes("@")) { setError("Please enter a valid email address."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (!acceptedTerms) { setError("Please accept the terms & conditions."); return; }
    setError(""); setIsLoading(true);

    const result = await signUpUser({
      fullName: fullName.trim(),
      email:    email.trim(),
      password,
      phone:    phone.trim() || undefined
    });
    setIsLoading(false);

    if (!result.success) {
      setError(result.error || "Sign up failed. Please try again.");
      return;
    }

    // Success — log the user in immediately
    onLoginSuccess({
      id:        result.userId!,
      name:      fullName.trim(),
      email:     email.trim(),
      phone:     phone.trim() || "",
      avatar:    `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=2d4023&color=fff&size=200`,
      isLoggedIn: true
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.18 }}
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-zinc-200 shadow-2xl relative overflow-hidden"
      >
        {/* Close */}
        <button
          onClick={() => { resetForm(); onClose(); }}
          className="cursor-pointer absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-zinc-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand header */}
        <div className="flex flex-col items-center text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#2d4023] flex items-center justify-center text-white font-black text-xl shadow-md">
            R
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-950 font-sans tracking-tight">
              {authMode === "login" ? "Welcome back to RestoX" : "Create your RestoX Account"}
            </h2>
            <p className="text-xs text-zinc-500 font-medium mt-0.5">
              {authMode === "login"
                ? "Log in to track orders & manage your deliveries"
                : "Enjoy verified restaurant prices with zero markups"}
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Success */}
        {successMsg && (
          <div className="mb-4 p-3 bg-[#edf4e8] border border-[#d2e2ca] rounded-xl text-xs text-[#2d4023] font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ── LOGIN FORM ── */}
        {authMode === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="pooja@example.com"
                  autoComplete="email"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2d4023]/20 focus:border-[#2d4023]"
                />
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-9 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2d4023]/20 focus:border-[#2d4023]"
                />
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer w-full bg-[#2d4023] hover:bg-[#203018] disabled:opacity-60 text-white font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
            >
              {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : "Login to RestoX"}
            </button>

            <p className="text-center text-xs text-zinc-500 pt-1">
              Don't have an account?{" "}
              <button type="button" onClick={() => { resetForm(); setAuthMode("signup"); }}
                className="cursor-pointer font-bold text-[#2d4023] hover:underline">
                Sign Up
              </button>
            </p>
          </form>
        )}

        {/* ── SIGN UP FORM ── */}
        {authMode === "signup" && (
          <form onSubmit={handleSignupSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Full Name</label>
              <div className="relative">
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Pooja Bhusani"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2d4023]/20 focus:border-[#2d4023]" />
                <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Email Address</label>
              <div className="relative">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="pooja@example.com" autoComplete="email"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2d4023]/20 focus:border-[#2d4023]" />
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Phone Number (optional)</label>
              <div className="relative">
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2d4023]/20 focus:border-[#2d4023]" />
                <span className="text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 text-[11px]">📞</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters" autoComplete="new-password"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-9 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2d4023]/20 focus:border-[#2d4023]" />
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Confirm Password</label>
              <div className="relative">
                <input type="password" value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password" autoComplete="new-password"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2d4023]/20 focus:border-[#2d4023]" />
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input type="checkbox" id="terms" checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="w-4 h-4 rounded accent-[#2d4023]" />
              <label htmlFor="terms" className="text-[11px] text-zinc-600 cursor-pointer">
                I agree to RestoX Transparent Pricing &amp; Terms
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer w-full bg-[#2d4023] hover:bg-[#203018] disabled:opacity-60 text-white font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 mt-1"
            >
              {isLoading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account...</>
                : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
            </button>

            <p className="text-center text-xs text-zinc-500">
              Already have an account?{" "}
              <button type="button" onClick={() => { resetForm(); setAuthMode("login"); }}
                className="cursor-pointer font-bold text-[#2d4023] hover:underline">
                Login
              </button>
            </p>
          </form>
        )}
      </motion.div>
    </div>
  );
}
