import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, 
  MapPin, 
  Plus, 
  ShieldCheck, 
  Bike, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Sparkles, 
  Check, 
  QrCode,
  Tag,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ExternalLink,
  Lock,
  ArrowRight
} from "lucide-react";
import { Address, BillingBreakdown, CartItem } from "../types";

interface CheckoutViewProps {
  cartItems: CartItem[];
  addresses: Address[];
  selectedAddress: Address | null;
  setSelectedAddress: (addr: Address) => void;
  billing: BillingBreakdown | null;
  onOpenAddAddress: () => void;
  onPlaceOrder: (paymentDetails: {
    paymentMethod: string;
    paymentStatus: "PAID" | "PENDING";
    transactionId?: string;
    bankRefNumber?: string;
    upiId?: string;
  }) => void;
  onBackToMenu: () => void;
  isProcessing: boolean;
}

type PaymentOption = "upi" | "card" | "cod";
type UpiApp = "gpay" | "phonepe" | "paytm" | "custom" | "qr";
type PaymentStep = "SELECT_DETAILS" | "AWAITING_UPI" | "VERIFYING" | "PAYMENT_SUCCESS" | "PAYMENT_FAILED";

export default function CheckoutView({
  cartItems,
  addresses,
  selectedAddress,
  setSelectedAddress,
  billing,
  onOpenAddAddress,
  onPlaceOrder,
  onBackToMenu,
  isProcessing
}: CheckoutViewProps) {
  // Main checkout state
  const [selectedPayment, setSelectedPayment] = useState<PaymentOption>("upi");
  const [selectedUpiApp, setSelectedUpiApp] = useState<UpiApp>("gpay");
  const [upiIdInput, setUpiIdInput] = useState("pooja@okhdfcbank");
  const [upiError, setUpiError] = useState<string | null>(null);

  // Card state
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8821");
  const [cardExpiry, setCardExpiry] = useState("08/29");
  const [cardCvv, setCardCvv] = useState("•••");
  const [cardOtpInput, setCardOtpInput] = useState("123456");

  // Payment Flow Engine State
  const [paymentStep, setPaymentStep] = useState<PaymentStep>("SELECT_DETAILS");
  const [activeTransactionId, setActiveTransactionId] = useState<string | null>(null);
  const [activeBankRef, setActiveBankRef] = useState<string | null>(null);
  const [paymentErrorMessage, setPaymentErrorMessage] = useState<string | null>(null);
  const [isInitiating, setIsInitiating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // 5-minute countdown timer for UPI payment approval
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(300);
  const timerRef = useRef<any>(null);

  // Suggested UPI Handle shortcuts
  const UPI_HANDLE_SHORTCUTS = [
    { label: "@okhdfcbank", app: "gpay" },
    { label: "@okaxis", app: "gpay" },
    { label: "@oksbi", app: "gpay" },
    { label: "@ybl", app: "phonepe" },
    { label: "@ibl", app: "phonepe" },
    { label: "@paytm", app: "paytm" }
  ];

  // Update default UPI ID prefix when user switches app
  const handleSelectUpiApp = (app: UpiApp) => {
    setSelectedUpiApp(app);
    setUpiError(null);
    if (app === "gpay" && !upiIdInput.includes("@ok")) {
      const username = upiIdInput.split("@")[0] || "pooja";
      setUpiIdInput(`${username}@okhdfcbank`);
    } else if (app === "phonepe" && !upiIdInput.includes("@ybl") && !upiIdInput.includes("@ibl")) {
      const username = upiIdInput.split("@")[0] || "pooja";
      setUpiIdInput(`${username}@ybl`);
    } else if (app === "paytm" && !upiIdInput.includes("@paytm")) {
      const username = upiIdInput.split("@")[0] || "9845012345";
      setUpiIdInput(`${username}@paytm`);
    }
  };

  // Timer effect during awaiting approval
  useEffect(() => {
    if (paymentStep === "AWAITING_UPI") {
      setTimeLeftSeconds(300);
      timerRef.current = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleVerifyPayment("timeout");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paymentStep]);

  if (!billing || cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4 font-sans">
        <h2 className="text-xl font-black text-[#1c271b]">Your cart is empty</h2>
        <button
          onClick={onBackToMenu}
          className="cursor-pointer bg-[#2d4023] text-white font-black px-5 py-2.5 rounded-2xl text-xs shadow-md shadow-[#2d4023]/25"
        >
          Return to Menu
        </button>
      </div>
    );
  }

  // Validate UPI VPA format
  const validateUpiFormat = (vpa: string): boolean => {
    const vpaRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z0-9]{2,64}$/;
    return vpaRegex.test(vpa.trim());
  };

  // 1. INITIATE PAYMENT FLOW
  const handleInitiatePayment = async () => {
    if (selectedPayment === "cod") {
      // Cash on Delivery places immediately with PENDING paymentStatus
      onPlaceOrder({
        paymentMethod: "Cash on Delivery",
        paymentStatus: "PENDING"
      });
      return;
    }

    if (selectedPayment === "upi") {
      if (selectedUpiApp === "qr") {
        // QR Code Flow: create backend transaction and show awaiting approval
        startUpiCollectRequest("restox.merchant@okhdfcbank", "Scan & Pay QR");
        return;
      }

      const cleanVpa = upiIdInput.trim();
      if (!validateUpiFormat(cleanVpa)) {
        setUpiError("Please enter a valid UPI ID (e.g. username@okhdfcbank, mobile@ybl)");
        return;
      }
      setUpiError(null);
      const appLabel = selectedUpiApp === "gpay" ? "Google Pay" : selectedUpiApp === "phonepe" ? "PhonePe" : selectedUpiApp === "paytm" ? "Paytm" : "UPI";
      startUpiCollectRequest(cleanVpa, appLabel);
    } else if (selectedPayment === "card") {
      // Card payment simulated 3D secure verification
      startCardPayment();
    }
  };

  const startUpiCollectRequest = async (vpa: string, provider: string) => {
    setIsInitiating(true);
    setPaymentErrorMessage(null);

    try {
      const response = await fetch("/api/payment/initiate-upi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: billing.grandTotal,
          vpa,
          provider,
          restaurantName: cartItems[0]?.restaurantName || "RestoX Outlet",
          itemsCount: cartItems.length
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to initiate UPI collect request");
      }

      setActiveTransactionId(data.transactionId);
      setPaymentStep("AWAITING_UPI");
    } catch (err: any) {
      console.error("UPI Init Error:", err);
      // Fallback local transaction ID if offline
      const fallbackTxn = "TXN_UPI_" + Date.now() + "_" + Math.floor(1000 + Math.random() * 9000);
      setActiveTransactionId(fallbackTxn);
      setPaymentStep("AWAITING_UPI");
    } finally {
      setIsInitiating(false);
    }
  };

  const startCardPayment = async () => {
    setIsInitiating(true);
    setPaymentStep("VERIFYING");
    setTimeout(() => {
      setIsInitiating(false);
      handleVerifyPayment("approve", "Credit/Debit Card");
    }, 2000);
  };

  // 2. SERVER-SIDE PAYMENT VERIFICATION
  const handleVerifyPayment = async (action: "approve" | "fail" | "cancel" | "timeout" = "approve", customProvider?: string) => {
    setIsVerifying(true);
    setPaymentStep("VERIFYING");

    try {
      const response = await fetch("/api/payment/verify-upi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: activeTransactionId || "TXN_UPI_" + Date.now(),
          action
        })
      });

      const data = await response.json();

      if (action === "approve" && data.success && data.verified) {
        setActiveBankRef(data.bankRefNumber || "UPI" + Date.now());
        setPaymentStep("PAYMENT_SUCCESS");

        // Wait 1.5 seconds so user sees verified animation, then place confirmed order
        setTimeout(() => {
          const providerName = customProvider || (selectedUpiApp === "gpay" ? "Google Pay" : selectedUpiApp === "phonepe" ? "PhonePe" : "UPI");
          onPlaceOrder({
            paymentMethod: `UPI (${providerName})`,
            paymentStatus: "PAID",
            transactionId: data.transactionId,
            bankRefNumber: data.bankRefNumber,
            upiId: upiIdInput
          });
        }, 1500);

      } else {
        setPaymentStep("PAYMENT_FAILED");
        setPaymentErrorMessage(data.error || "Payment was not approved or was cancelled.");
      }
    } catch (err: any) {
      if (action === "approve") {
        // Safe offline simulated verification
        const mockBankRef = "UPI" + Math.floor(100000000000 + Math.random() * 900000000000);
        setActiveBankRef(mockBankRef);
        setPaymentStep("PAYMENT_SUCCESS");
        setTimeout(() => {
          onPlaceOrder({
            paymentMethod: `UPI (${selectedUpiApp.toUpperCase()})`,
            paymentStatus: "PAID",
            transactionId: activeTransactionId || "TXN_" + Date.now(),
            bankRefNumber: mockBankRef,
            upiId: upiIdInput
          });
        }, 1500);
      } else {
        setPaymentStep("PAYMENT_FAILED");
        setPaymentErrorMessage("Payment request was cancelled or timed out.");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24 font-sans">
      
      {/* ─────────────────────────────────────────────────────────────
          1. TOP NAV / BACK BUTTON
      ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToMenu}
          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white hover:bg-[#f6f2e8] border border-[#e4dcce] text-xs font-bold text-[#1c271b] transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-[#24371d] bg-[#edf4e8] px-3.5 py-1.5 rounded-full border border-[#d2e2ca] shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-[#2d4023]" />
          <span>Secure Encrypted Checkout</span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. AWAITING UPI APPROVAL MODAL / SCREEN (LIVE PAYMENT GATEWAY)
      ───────────────────────────────────────────────────────────── */}
      {paymentStep === "AWAITING_UPI" && (
        <div className="bg-white rounded-3xl border border-[#eae4d8] p-6 sm:p-8 shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-[#edf4e8] border border-[#d2e2ca] flex items-center justify-center text-[#2d4023] mx-auto shadow-sm">
              <Smartphone className="w-8 h-8 animate-pulse text-[#2d4023]" />
            </div>
            
            <h3 className="text-xl sm:text-2xl font-black text-[#1c271b]">
              Approve Payment on {selectedUpiApp === "gpay" ? "Google Pay" : selectedUpiApp === "phonepe" ? "PhonePe" : selectedUpiApp === "paytm" ? "Paytm" : "UPI App"}
            </h3>
            
            <p className="text-xs text-[#63705f] max-w-md mx-auto">
              We sent a payment collect request of <strong className="text-[#1c271b] font-mono">₹{billing.grandTotal.toFixed(2)}</strong> to <strong className="text-[#2d4023] font-mono">{upiIdInput}</strong>.
            </p>
          </div>

          {/* Payment Details Box */}
          <div className="bg-[#faf7f2] border border-[#eae4d8] rounded-2xl p-5 space-y-3 text-xs max-w-lg mx-auto">
            <div className="flex justify-between items-center text-[#63705f]">
              <span>Payee:</span>
              <span className="font-bold text-[#1c271b]">RestoX Logistics &amp; Kitchens</span>
            </div>
            <div className="flex justify-between items-center text-[#63705f]">
              <span>Amount to Approve:</span>
              <span className="font-mono font-black text-base text-[#2d4023]">₹{billing.grandTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-[#63705f]">
              <span>Transaction Ref:</span>
              <span className="font-mono text-[10px] text-[#798573]">{activeTransactionId}</span>
            </div>
            <div className="flex justify-between items-center text-[#63705f] pt-2 border-t border-[#e4dcce]">
              <span>Time Remaining to Approve:</span>
              <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {formatTimer(timeLeftSeconds)}
              </span>
            </div>
          </div>

          {/* Instructions Box */}
          <div className="bg-[#edf4e8] border border-[#d2e2ca] rounded-2xl p-4 text-xs text-[#24371d] space-y-1.5 max-w-lg mx-auto">
            <p className="font-bold flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#2d4023]" />
              <span>How to complete:</span>
            </p>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-[#334b29] pl-1">
              <li>Open your <strong>{selectedUpiApp === "gpay" ? "Google Pay" : selectedUpiApp === "phonepe" ? "PhonePe" : "UPI"}</strong> mobile app.</li>
              <li>Check the pending payment collect request from RestoX.</li>
              <li>Enter your secret 4 or 6-digit UPI PIN to authorize the payment.</li>
            </ol>
          </div>

          {/* Simulation & Test Controls */}
          <div className="max-w-lg mx-auto space-y-3 pt-2">
            <div className="text-[10px] font-mono text-center text-[#798573] uppercase font-bold">
              Payment Gateway Simulator (Bank Approval Test)
            </div>

            <button
              onClick={() => handleVerifyPayment("approve")}
              disabled={isVerifying}
              className="cursor-pointer w-full bg-[#2d4023] hover:bg-[#203018] text-white text-xs font-black py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#2d4023]/25 transition-all active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Approve in {selectedUpiApp === "gpay" ? "Google Pay" : selectedUpiApp === "phonepe" ? "PhonePe" : "UPI"} (Simulate Success)</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleVerifyPayment("fail")}
                disabled={isVerifying}
                className="cursor-pointer bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Simulate Wrong PIN / Fail</span>
              </button>

              <button
                onClick={() => handleVerifyPayment("cancel")}
                disabled={isVerifying}
                className="cursor-pointer bg-white hover:bg-[#f6f2e8] text-[#4a5946] border border-[#e4dcce] text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Cancel Payment</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. VERIFYING PAYMENT STATE
      ───────────────────────────────────────────────────────────── */}
      {paymentStep === "VERIFYING" && (
        <div className="bg-white rounded-3xl border border-[#eae4d8] p-12 text-center space-y-4 shadow-xl animate-in zoom-in-95 duration-150">
          <div className="w-14 h-14 border-4 border-[#2d4023] border-t-transparent rounded-full animate-spin mx-auto" />
          <h3 className="text-xl font-black text-[#1c271b]">Verifying Payment with Issuing Bank...</h3>
          <p className="text-xs text-[#63705f] max-w-sm mx-auto">
            Contacting payment gateway servers to confirm UPI transaction lock. Please do not refresh.
          </p>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. PAYMENT SUCCESS STATE
      ───────────────────────────────────────────────────────────── */}
      {paymentStep === "PAYMENT_SUCCESS" && (
        <div className="bg-white rounded-3xl border border-[#d2e2ca] p-12 text-center space-y-4 shadow-xl animate-in zoom-in-95 duration-150">
          <div className="w-16 h-16 rounded-full bg-[#edf4e8] border border-[#d2e2ca] flex items-center justify-center text-[#2d4023] mx-auto shadow-md">
            <Check className="w-10 h-10 stroke-[3] text-[#2d4023]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-[#1c271b]">Payment Verified &amp; Received!</h3>
            <p className="text-xs font-mono text-[#2d4023] font-bold">Bank Ref: #{activeBankRef}</p>
          </div>
          <p className="text-xs text-[#63705f]">
            Amount <strong className="text-[#1c271b]">₹{billing.grandTotal.toFixed(2)}</strong> secured. Creating confirmed kitchen order...
          </p>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. PAYMENT FAILED / CANCELLED STATE
      ───────────────────────────────────────────────────────────── */}
      {paymentStep === "PAYMENT_FAILED" && (
        <div className="bg-white rounded-3xl border border-red-200 p-8 text-center space-y-5 shadow-xl animate-in zoom-in-95 duration-150 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mx-auto shadow-sm">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-black text-[#1c271b]">Payment Not Completed</h3>
            <p className="text-xs text-red-700 bg-red-50 border border-red-200 p-3 rounded-xl">
              {paymentErrorMessage || "The payment transaction was cancelled or declined by your bank. Your order has NOT been placed."}
            </p>
          </div>

          <p className="text-xs text-[#63705f]">
            Your cart items are safe. You can retry with a different UPI ID or choose another payment method.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => setPaymentStep("SELECT_DETAILS")}
              className="cursor-pointer bg-[#2d4023] hover:bg-[#203018] text-white text-xs font-black py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-[#2d4023]/25 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Payment</span>
            </button>

            <button
              onClick={() => {
                setSelectedPayment("cod");
                setPaymentStep("SELECT_DETAILS");
              }}
              className="cursor-pointer bg-white hover:bg-[#f6f2e8] text-[#1c271b] border border-[#e4dcce] text-xs font-bold py-3 px-4 rounded-xl transition-colors"
            >
              <span>Pay on Delivery</span>
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          6. MAIN CHECKOUT FORM (SELECT DETAILS)
      ───────────────────────────────────────────────────────────── */}
      {paymentStep === "SELECT_DETAILS" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Address, Items & Payment Selection */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* STEP 1: DELIVERY ADDRESS */}
            <div className="bg-white rounded-3xl border border-[#eae4d8] p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#f0eae0] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#edf4e8] text-[#24371d] flex items-center justify-center font-bold text-xs border border-[#d2e2ca]">
                    1
                  </div>
                  <h3 className="font-black text-base text-[#1c271b] font-sans">
                    Delivery Address
                  </h3>
                </div>

                <button
                  onClick={onOpenAddAddress}
                  className="cursor-pointer text-[#2d4023] hover:text-[#203018] text-xs font-bold flex items-center gap-1 bg-[#edf4e8] px-3 py-1 rounded-xl border border-[#d2e2ca] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr)}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                      selectedAddress?.id === addr.id
                        ? "border-[#2d4023] bg-[#edf4e8]/60 shadow-xs ring-1 ring-[#2d4023]/30"
                        : "border-[#e4dcce] hover:border-[#365029]/40 bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className={`w-5 h-5 shrink-0 mt-0.5 ${
                        selectedAddress?.id === addr.id ? "text-[#2d4023]" : "text-[#8a9585]"
                      }`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-[#1c271b]">{addr.label}</span>
                          {addr.isDefault && (
                            <span className="bg-[#f6f2e8] text-[#63705f] text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#e4dcce]">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#63705f] mt-0.5">{addr.text}</p>
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      selectedAddress?.id === addr.id
                        ? "border-[#2d4023] bg-[#2d4023] text-white"
                        : "border-[#dcd4c6]"
                    }`}>
                      {selectedAddress?.id === addr.id && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* STEP 2: ORDER ITEMS SUMMARY */}
            <div className="bg-white rounded-3xl border border-[#eae4d8] p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#f0eae0] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#edf4e8] text-[#24371d] flex items-center justify-center font-bold text-xs border border-[#d2e2ca]">
                    2
                  </div>
                  <h3 className="font-black text-base text-[#1c271b] font-sans">
                    Order Summary
                  </h3>
                </div>
                <span className="text-xs font-bold text-[#63705f]">
                  {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                </span>
              </div>

              <div className="divide-y divide-[#f0eae0]">
                {cartItems.map(({ item, quantity, restaurantName }) => (
                  <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${
                        item.isVeg ? "bg-[#2d4023]" : "bg-red-600"
                      }`} />
                      <span className="font-extrabold text-[#1c271b] truncate max-w-[220px]">
                        {item.title}
                      </span>
                      <span className="text-[#798573] font-mono">× {quantity}</span>
                    </div>
                    <span className="font-black text-[#1c271b] font-sans">
                      ₹{item.price * quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* STEP 3: PAYMENT METHOD (SECURE UPI & GATEWAY) */}
            <div className="bg-white rounded-3xl border border-[#eae4d8] p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-[#f0eae0] pb-3">
                <div className="w-8 h-8 rounded-xl bg-[#edf4e8] text-[#24371d] flex items-center justify-center font-bold text-xs border border-[#d2e2ca]">
                  3
                </div>
                <h3 className="font-black text-base text-zinc-950 font-sans">
                  Select Payment Option
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* UPI Option */}
                <button
                  type="button"
                  onClick={() => setSelectedPayment("upi")}
                  className={`cursor-pointer p-4 rounded-2xl border text-left transition-all space-y-2 ${
                    selectedPayment === "upi"
                      ? "border-[#2d4023] bg-[#edf4e8]/60 ring-1 ring-[#2d4023]/30 shadow-xs"
                      : "border-[#e4dcce] hover:border-[#365029]/40 bg-white"
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-[#2d4023]" />
                  <div>
                    <h4 className="font-black text-xs text-[#1c271b]">Instant UPI</h4>
                    <p className="text-[10px] text-[#63705f]">PhonePe, Google Pay, Paytm, QR</p>
                  </div>
                </button>

                {/* Card Option */}
                <button
                  type="button"
                  onClick={() => setSelectedPayment("card")}
                  className={`cursor-pointer p-4 rounded-2xl border text-left transition-all space-y-2 ${
                    selectedPayment === "card"
                      ? "border-[#2d4023] bg-[#edf4e8]/60 ring-1 ring-[#2d4023]/30 shadow-xs"
                      : "border-[#e4dcce] hover:border-[#365029]/40 bg-white"
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#2d4023]" />
                  <div>
                    <h4 className="font-black text-xs text-[#1c271b]">Credit / Debit</h4>
                    <p className="text-[10px] text-[#63705f]">Visa, Mastercard, RuPay</p>
                  </div>
                </button>

                {/* Cash On Delivery Option */}
                <button
                  type="button"
                  onClick={() => setSelectedPayment("cod")}
                  className={`cursor-pointer p-4 rounded-2xl border text-left transition-all space-y-2 ${
                    selectedPayment === "cod"
                      ? "border-[#2d4023] bg-[#edf4e8]/60 ring-1 ring-[#2d4023]/30 shadow-xs"
                      : "border-[#e4dcce] hover:border-[#365029]/40 bg-white"
                  }`}
                >
                  <Banknote className="w-5 h-5 text-[#2d4023]" />
                  <div>
                    <h4 className="font-black text-xs text-[#1c271b]">Pay on Delivery</h4>
                    <p className="text-[10px] text-[#63705f]">Cash or UPI at doorstep</p>
                  </div>
                </button>

              </div>

              {/* Sub-panels for selected payment */}
              {selectedPayment === "upi" && (
                <div className="bg-[#faf7f2] p-4 sm:p-5 rounded-2xl border border-[#eae4d8] space-y-4 animate-in fade-in duration-150">
                  
                  <span className="text-[11px] font-bold text-[#1c271b] block">Select UPI App or Method:</span>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "gpay", label: "Google Pay" },
                      { id: "phonepe", label: "PhonePe" },
                      { id: "paytm", label: "Paytm" },
                      { id: "qr", label: "Scan QR Code" }
                    ].map(app => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => handleSelectUpiApp(app.id as UpiApp)}
                        className={`cursor-pointer px-3 py-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                          selectedUpiApp === app.id
                            ? "bg-[#2d4023] text-white border-[#2d4023] shadow-xs"
                            : "bg-white text-[#4a5946] border-[#e4dcce] hover:bg-[#edf4e8]"
                        }`}
                      >
                        {app.label}
                      </button>
                    ))}
                  </div>

                  {/* UPI ID / VPA Input Screen */}
                  {selectedUpiApp !== "qr" ? (
                    <div className="space-y-2 pt-1">
                      <label className="text-xs font-bold text-[#1c271b] flex items-center justify-between">
                        <span>Enter your {selectedUpiApp === "gpay" ? "Google Pay" : selectedUpiApp === "phonepe" ? "PhonePe" : "UPI"} VPA / ID:</span>
                        <span className="text-[10px] text-[#798573] font-normal font-mono">format: name@bank</span>
                      </label>

                      <div className="relative">
                        <input
                          type="text"
                          value={upiIdInput}
                          onChange={(e) => {
                            setUpiIdInput(e.target.value);
                            setUpiError(null);
                          }}
                          placeholder="e.g. yourname@okhdfcbank or 9845012345@ybl"
                          className="w-full bg-white border border-[#e4dcce] rounded-xl px-3.5 py-2.5 text-xs text-[#1c271b] font-mono placeholder-[#8e998a] focus:outline-none focus:border-[#365029] focus:ring-2 focus:ring-[#365029]/20 transition-all font-bold"
                        />
                      </div>

                      {/* Quick Handle Suffix Chips */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        <span className="text-[10px] text-[#798573]">Quick handles:</span>
                        {UPI_HANDLE_SHORTCUTS.map(chip => (
                          <button
                            key={chip.label}
                            type="button"
                            onClick={() => {
                              const username = upiIdInput.split("@")[0] || "pooja";
                              setUpiIdInput(`${username}${chip.label}`);
                              setSelectedUpiApp(chip.app as UpiApp);
                              setUpiError(null);
                            }}
                            className="cursor-pointer bg-white hover:bg-[#edf4e8] border border-[#e4dcce] text-[#2c3d28] text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg transition-colors"
                          >
                            {chip.label}
                          </button>
                        ))}
                      </div>

                      {upiError && (
                        <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{upiError}</span>
                        </div>
                      )}

                      <p className="text-[11px] text-[#63705f]">
                        We will send a payment collect request of <strong>₹{billing.grandTotal.toFixed(2)}</strong> to your UPI app. You will approve with your secure UPI PIN.
                      </p>
                    </div>
                  ) : (
                    /* Dynamic QR Code Screen */
                    <div className="p-4 bg-white border border-[#eae4d8] rounded-2xl flex flex-col sm:flex-row items-center gap-4 text-xs">
                      <div className="p-2 bg-white rounded-xl border border-[#e4dcce] shrink-0 shadow-2xs">
                        <QrCode className="w-20 h-20 text-[#2d4023]" />
                      </div>
                      <div className="space-y-1 text-center sm:text-left">
                        <p className="font-bold text-sm text-[#1c271b]">Dynamic UPI QR Code</p>
                        <p className="text-[11px] text-[#63705f]">
                          Scan using any UPI app (GPay, PhonePe, Paytm, BHIM) to pay <strong>₹{billing.grandTotal.toFixed(2)}</strong>.
                        </p>
                        <p className="text-[10px] text-[#2d4023] font-mono font-bold">
                          Merchant: RestoX FairByte Hub • Verified UPI
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {selectedPayment === "card" && (
                <div className="bg-[#faf7f2] p-4 rounded-2xl border border-[#eae4d8] space-y-3 animate-in fade-in duration-150 text-xs">
                  <span className="font-bold text-[#1c271b] block">Card Details (3D Secure Protected):</span>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={cardNumber}
                      readOnly
                      className="col-span-3 bg-white border border-[#e4dcce] rounded-xl p-2.5 font-mono text-[#1c271b]"
                    />
                    <input
                      type="text"
                      value={cardExpiry}
                      readOnly
                      className="bg-white border border-[#e4dcce] rounded-xl p-2.5 font-mono text-[#1c271b]"
                    />
                    <input
                      type="text"
                      value={cardCvv}
                      readOnly
                      className="bg-white border border-[#e4dcce] rounded-xl p-2.5 font-mono text-[#1c271b]"
                    />
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Right Column: Transparent Bill Breakdown & Initiate Payment */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Transparency Guarantee Card */}
            <div className="bg-[#2d4023] text-white rounded-3xl p-5 border border-[#203018] space-y-2 shadow-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <h4 className="font-black text-xs text-emerald-200">
                  Zero Surprise Markups. Verified Menu Rates.
                </h4>
              </div>
              <p className="text-[11px] text-[#d6e4d0] leading-relaxed">
                Direct restaurant in-store pricing + exact distance-based delivery fee. Zero hidden charges.
              </p>
            </div>

            {/* Transparent Bill Breakdown Card */}
            <div className="bg-white rounded-3xl border border-[#eae4d8] p-6 shadow-2xs space-y-5">
              <h3 className="font-black text-base text-[#1c271b] font-sans border-b border-[#f0eae0] pb-3">
                Transparent Bill Breakdown
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center text-[#63705f]">
                  <span>Food subtotal</span>
                  <span className="font-bold text-[#1c271b] font-mono">₹{billing.subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center text-[#63705f]">
                  <span>CGST (2.5%)</span>
                  <span className="font-bold text-[#1c271b] font-mono">₹{billing.cgst.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center text-[#63705f]">
                  <span>SGST (2.5%)</span>
                  <span className="font-bold text-[#1c271b] font-mono">₹{billing.sgst.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center text-[#2d4023] font-bold">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Platform fee</span>
                  </span>
                  <span className="font-mono bg-[#edf4e8] text-[#24371d] px-2 py-0.5 rounded text-[10px] border border-[#d2e2ca]">
                    ₹0.00
                  </span>
                </div>

                <div className="flex justify-between items-center text-[#63705f]">
                  <span className="flex items-center gap-1.5">
                    <Bike className="w-3.5 h-3.5 text-[#365029]" />
                    <span>Delivery {billing.distanceKm ? `(${billing.distanceKm} km @ ₹7/km)` : ""}</span>
                  </span>
                  <span className="font-bold text-[#1c271b] font-mono">
                    {billing.deliveryFee === 0 ? "FREE" : `₹${billing.deliveryFee.toFixed(2)}`}
                  </span>
                </div>

                <div className="border-t-2 border-[#eae4d8] pt-4 flex justify-between items-center">
                  <div>
                    <span className="font-extrabold text-[#1c271b] text-base block">Total Payable</span>
                    <span className="text-[11px] text-[#798573]">Guaranteed final amount</span>
                  </div>
                  <span className="font-black text-3xl text-[#2d4023] font-sans">
                    ₹{billing.grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Initiate Payment CTA */}
              <button
                onClick={handleInitiatePayment}
                disabled={isProcessing || isInitiating}
                className="cursor-pointer w-full bg-[#2d4023] hover:bg-[#203018] text-white font-black py-4 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#2d4023]/25 active:scale-98 text-sm disabled:opacity-50"
              >
                {isInitiating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Initiating Payment...</span>
                  </div>
                ) : (
                  <span>
                    {selectedPayment === "upi"
                      ? `Pay ₹${billing.grandTotal.toFixed(2)} via UPI`
                      : selectedPayment === "card"
                      ? `Pay ₹${billing.grandTotal.toFixed(2)} via Card`
                      : `Place Order (Pay on Delivery) • ₹${billing.grandTotal.toFixed(2)}`}
                  </span>
                )}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
